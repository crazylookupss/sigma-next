"use client";

import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
  HttpTransportType,
} from "@microsoft/signalr";
import { getSession } from "next-auth/react";

// ---------------------------------------------------------------------------
// Connection singleton & state
// ---------------------------------------------------------------------------
let connection: HubConnection | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;

const MAX_RECONNECT_ATTEMPTS = 50;
const BASE_RECONNECT_DELAY = 5_000; // 5 seconds
const MAX_RECONNECT_DELAY = 60_000; // 60 seconds cap

// Connection-state listeners (used by the provider to expose state to React)
type StateListener = (state: HubConnectionState) => void;
const stateListeners = new Set<StateListener>();

function notifyStateListeners(state: HubConnectionState) {
  stateListeners.forEach((fn) => fn(state));
}

export function onConnectionStateChange(listener: StateListener): () => void {
  stateListeners.add(listener);
  // Immediately notify the current state
  if (connection) {
    listener(connection.state);
  }
  return () => {
    stateListeners.delete(listener);
  };
}

// ---------------------------------------------------------------------------
// Build the direct hub URL (bypasses Next.js rewrites → true WebSocket)
// ---------------------------------------------------------------------------
function getHubUrl(): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5107";
  return `${apiUrl}/hubs/sigma`;
}

// ---------------------------------------------------------------------------
// Exponential-backoff reconnect
// ---------------------------------------------------------------------------
function getReconnectDelay(): number {
  // 5s → 10s → 20s → 40s → 60s (capped)
  const delay = Math.min(
    BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempt),
    MAX_RECONNECT_DELAY
  );
  return delay;
}

function scheduleReconnect() {
  if (reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
    console.error(
      `[SignalR] Gave up reconnecting after ${MAX_RECONNECT_ATTEMPTS} attempts`
    );
    notifyStateListeners(HubConnectionState.Disconnected);
    return;
  }

  if (reconnectTimeout) clearTimeout(reconnectTimeout);

  const delay = getReconnectDelay();
  reconnectAttempt++;

  console.info(
    `[SignalR] Reconnect attempt ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS} in ${delay / 1000}s`
  );

  reconnectTimeout = setTimeout(() => {
    if (connection?.state === HubConnectionState.Disconnected) {
      notifyStateListeners(HubConnectionState.Reconnecting);
      connection
        .start()
        .then(() => {
          reconnectAttempt = 0; // reset on success
          console.info("[SignalR] Reconnected successfully");
          notifyStateListeners(HubConnectionState.Connected);
        })
        .catch(() => scheduleReconnect());
    }
  }, delay);
}

// ---------------------------------------------------------------------------
// Create / get the singleton connection
// ---------------------------------------------------------------------------
export function getSignalRConnection(): HubConnection {
  if (connection && connection.state !== HubConnectionState.Disconnected) {
    return connection;
  }

  connection = new HubConnectionBuilder()
    .withUrl(getHubUrl(), {
      // Direct WebSocket — skip the HTTP negotiate round-trip entirely.
      // This avoids the "unexpected token <!DOCTYPE" error and reduces
      // connection latency from ~300ms to ~50ms.
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      accessTokenFactory: async () => {
        const session = await getSession();
        return session?.accessToken ?? "";
      },
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(LogLevel.Warning)
    .build();

  // ---- lifecycle hooks ----
  connection.onreconnecting(() => {
    console.warn("[SignalR] Reconnecting…");
    notifyStateListeners(HubConnectionState.Reconnecting);
  });

  connection.onreconnected(() => {
    reconnectAttempt = 0;
    console.info("[SignalR] Reconnected");
    notifyStateListeners(HubConnectionState.Connected);
  });

  connection.onclose(() => {
    console.warn("[SignalR] Connection closed, scheduling reconnect…");
    notifyStateListeners(HubConnectionState.Disconnected);
    scheduleReconnect();
  });

  // ---- start ----
  notifyStateListeners(HubConnectionState.Connecting);

  connection.start().then(() => {
    reconnectAttempt = 0;
    console.info("[SignalR] Connected");
    notifyStateListeners(HubConnectionState.Connected);
  }).catch((err) => {
    console.warn("[SignalR] Connection failed, will retry:", err);
    scheduleReconnect();
  });

  return connection;
}

// ---------------------------------------------------------------------------
// Entity-update subscription
// ---------------------------------------------------------------------------
export function onEntityUpdate(
  callback: (eventType: string, data: Record<string, unknown>) => void
) {
  const conn = getSignalRConnection();
  conn.off("entityUpdated");
  conn.on(
    "entityUpdated",
    (payload: { type: string; data: Record<string, unknown>; timestamp: string }) => {
      callback(payload.type, payload.data);
    }
  );
}

// ---------------------------------------------------------------------------
// Teardown
// ---------------------------------------------------------------------------
export function disconnectSignalR() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  reconnectAttempt = 0;

  if (connection) {
    connection.stop();
    connection = null;
  }

  notifyStateListeners(HubConnectionState.Disconnected);
}

"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { HubConnectionState } from "@microsoft/signalr";
import {
  getSignalRConnection,
  onEntityUpdate,
  disconnectSignalR,
  onConnectionStateChange,
} from "@/services/signalr";

// ---------------------------------------------------------------------------
// Context — any component can read the live connection state
// ---------------------------------------------------------------------------
const SignalRStateContext = createContext<HubConnectionState>(
  HubConnectionState.Disconnected
);

export function useSignalRState(): HubConnectionState {
  return useContext(SignalRStateContext);
}

// ---------------------------------------------------------------------------
// Provider — auth-gated, with debounced init
// ---------------------------------------------------------------------------
export function SignalRProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const initialized = useRef(false);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    HubConnectionState.Disconnected
  );

  useEffect(() => {
    // Only connect when the user is authenticated
    if (status !== "authenticated") {
      // If we were previously connected and the session dropped, disconnect
      if (initialized.current) {
        disconnectSignalR();
        initialized.current = false;
      }
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    let unsubscribe: (() => void) | null = null;

    // Small delay to ensure auth token is fully available
    const initTimer = setTimeout(() => {
      // Subscribe to connection-state changes for UI feedback
      unsubscribe = onConnectionStateChange(setConnectionState);

      getSignalRConnection();

      onEntityUpdate((eventType) => {
        const queryKey = eventType.startsWith("service-principal")
          ? ["service-principals"]
          : eventType.startsWith("application")
            ? ["applications"]
            : null;

        if (queryKey) {
          queryClient.invalidateQueries({ queryKey });
        }
      });
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (unsubscribe) unsubscribe();
      disconnectSignalR();
      initialized.current = false;
    };
  }, [status, queryClient]);

  return (
    <SignalRStateContext.Provider value={connectionState}>
      {children}
    </SignalRStateContext.Provider>
  );
}

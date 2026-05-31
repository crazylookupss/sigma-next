# Architecture

This document describes the architecture of the SIGMA Web Client.

## Overview

SIGMA Web is a **Next.js 16 App Router** application built with React 19, using a provider-based architecture for authentication, server state, client state, theming, and real-time updates.

## High-Level Architecture

```
+------------------+     +------------------+     +------------------+
|   Next.js App    |     |   SIGMA API      |     |  Microsoft Graph |
|   (sigma-next)   | --> |   (.NET 10)      | --> |  (REST API)      |
|                  | <-- |                  | <-- |                  |
+------------------+     +------------------+     +------------------+
        |                                                   ^
        | SignalR WebSocket                                |
        +--------------------------------------------------+
```

## Provider Stack

The app uses a nested provider pattern in `src/app/layout.tsx`:

```
AuthProvider (NextAuth.js v5)
  -> QueryProvider (TanStack React Query)
    -> ThemeProvider (CSS class manager)
      -> SignalRProvider (WebSocket connection)
```

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js App Router - pages, layouts, route handlers |
| `src/components/` | Reusable UI components (charts, layout, shared, ui) |
| `src/hooks/` | TanStack React Query hooks for data fetching |
| `src/lib/` | Auth configuration, utility functions |
| `src/providers/` | React context providers (auth, query, theme, signalr) |
| `src/services/` | API client, SignalR service, data fetching functions |
| `src/stores/` | Zustand stores for client-side state |
| `src/types/` | TypeScript type definitions |

## Data Flow

1. **Authentication**: NextAuth.js handles Microsoft Entra ID OAuth2 flow, providing JWT tokens.
2. **API Calls**: `services/api-client.ts` injects Bearer tokens into all requests to the SIGMA API.
3. **Data Fetching**: React Query hooks call service functions, which use the API client.
4. **Caching**: React Query caches responses and manages background refetching.
5. **Real-Time**: SignalR receives `entityUpdated` events and invalidates relevant React Query caches.

## Authentication Flow

```
User -> /landing -> Microsoft Entra ID -> /api/auth/callback/azure-ad
       -> NextAuth.js (JWT callback) -> Session with user info
       -> Middleware (proxy.ts) validates session
       -> Dashboard pages access session via useSession()
```

## Key Design Decisions

- **No server-side data fetching**: All data is fetched client-side via React Query to leverage real-time SignalR invalidation.
- **Zustand for UI state only**: Sidebar toggle and theme preference are the only client-side state; everything else is server state via React Query.
- **AG Grid for tables**: Enterprise-grade data grid for handling large datasets with sorting, filtering, and pagination.
- **Glassmorphism design system**: Consistent visual language using backdrop blur, transparent cards, and luminous borders.

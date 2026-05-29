# SIGMA Web Client

> **S**ecure **I**dentity **G**ateway & **M**anagement **A**dmin Dashboard
>
> Modern enterprise-grade React SPA admin portal for Microsoft Entra ID directory audit and access governance.

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat&logo=tailwindcss)
![Status](https://img.shields.io/badge/status-development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

**SIGMA Web Client** is the official premium dashboard interface for the [SIGMA API Gateway](https://github.com/your-repo/sigma-api). Built with a state-of-the-art **quantum-dark glassmorphism** design system, it provides identity operators, governance officers, and global auditors with a unified panel to search, audit, and analyze:

- 👥 **Directory Users**: Details, statuses, domains, and object IDs.
- 👥 **Security Groups**: Group memberships, synchronization statistics, and types.
- ⚙️ **App Registrations**: Secret/certificate health tracker, manifest viewer, and owner lists.
- 🚀 **Enterprise Applications**: Service principals, user/group assignments, and linked registration mapping.
- 📊 **Analytics & Telemetry**: Live tenant status, sync latency, and sign-in activity.
- 🔌 **SignalR WebSockets**: Real-time server-push synchronization of entity update events.

---

## Premium UI/UX Design System

SIGMA Web Client features a carefully crafted user interface:
- 🌌 **Quantum Dark Mode**: A deep, rich, low-light backdrop utilizing harmonized slate and violet undertones.
- 🧪 **Glassmorphism Design**: High-transparency card layers using dynamic backdrop blur (`backdrop-filter`) and thin luminous borders.
- 🌀 **Micro-Animations**: Butter-smooth interactions powered by **Framer Motion** and **Tailwind CSS v4**.
- 📈 **State-of-the-Art Data Visualization**: Highly responsive charts using **Recharts** and high-speed multi-column filtering using **AG Grid React**.

---

## Tech Stack & Core Libraries

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) for highly optimized routing and server-rendered layout boundaries.
- **Compiler**: [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) for blazing-fast local development and instant hot-module reloading.
- **State Management**:
  - [TanStack React Query (v5)](https://tanstack.com/query) for server state caching, automatic cache invalidation, and background fetching.
  - [Zustand](https://github.com/pmndrs/zustand) for lightweight client state management.
- **Real-Time Pipeline**: [@microsoft/signalr](https://learn.microsoft.com/en-us/aspnet/core/signalr/) over native WebSockets for real-time updates.
- **Authentication**: [NextAuth.js (v5 Beta)](https://nextjs.org/) with Microsoft Entra ID single sign-on.
- **Grid Components**: [AG Grid React](https://www.ag-grid.com/react-data-grid/) for high-throughput, enterprise-grade directory list manipulation.

---

## Quick Start

### Prerequisites

- [Node.js v20.x or higher](https://nodejs.org/)
- Running instance of the [SIGMA API Backend Gateway](https://github.com/your-repo/sigma-api)
- Microsoft Entra ID tenant with a configured Client App Registration (see [Authentication](#authentication))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd sigma-next
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and populate the values (see [Configuration](#configuration)).

4. **Launch the Development Server**:
   Launch with Next.js Turbopack compiler enabled for the best performance:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## Configuration

The client requires the following variables in `.env.local` for authentication and API communication:

```env
# The base URL of your running C# SIGMA API Gateway
NEXT_PUBLIC_API_URL=http://localhost:5107

# Local URL where this Next.js app is hosted
NEXTAUTH_URL=http://localhost:3000

# Strong 32-character key generated using: openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret-here

# Entra ID App Registration Client ID (for the SIGMA Client App)
AZURE_AD_CLIENT_ID=your-azure-ad-client-app-id-here

# Entra ID App Registration Client Secret (for the SIGMA Client App)
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-app-secret-here

# Entra ID Tenant ID (Directory ID) where your users exist
AZURE_AD_TENANT_ID=your-azure-ad-tenant-id-here
```

---

## Authentication Model

SIGMA utilizes a **Two-App Registration** model in Microsoft Entra ID for least-privilege security:

1. **Backend API App (`SIGMA-Api`)**: Holds Graph API application permissions (`User.Read.All`, `Group.Read.All`, etc.).
2. **Frontend Client App (`SIGMA-Web`)**: Holds **zero** direct Graph permissions. It handles user sign-in and obtains a delegated JWT token.

```
┌──────────────┐     User JWT Token     ┌──────────────┐    Graph Call     ┌─────────────────┐
│              │    (access_as_user)    │              │ (App Secret)      │                 │
│  Client App  │ ─────────────────────▶ │  SIGMA.Api   │ ────────────────▶ │ Microsoft Graph │
│ (sigma-next) │                        │ (API Gateway)│                   │      (API)      │
│              │ ◀───────────────────── │              │ ◀──────────────── │                 │
└──────────────┘      API Response      └──────────────┘    Graph Data     └─────────────────┘
```

### Entra ID Setup for the Client App
1. Go to **Microsoft Entra admin center → App registrations → New registration**.
2. Name: `SIGMA-Web`.
3. Supported account types: **Accounts in this organizational directory only** (Single tenant).
4. Redirect URI: Select **Web** and enter `http://localhost:3000/api/auth/callback/azure-ad`.
5. Under **API permissions**:
   - Add a permission.
   - Go to **APIs my organization uses** and select your backend API (`SIGMA-Api`).
   - Select **Delegated permissions** → `access_as_user`.
   - Click **Grant admin consent** for your tenant.
6. Under **Certificates & secrets**: Create a new Client Secret and copy its value to your `NEXT_PUBLIC_API_URL` environment variables.

---

## Project Structure

```
sigma-next/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # App Router Layouts, Pages, and Route Handlers
│   │   ├── (dashboard)/    # Auth-protected administration dashboard pages
│   │   ├── api/            # API Route endpoints (NextAuth handlers)
│   │   ├── landing/        # Glassmorphic Login/SignIn landing page
│   │   └── layout.tsx      # Root providers injection point
│   ├── components/         # Reusable presentation and UI elements
│   │   ├── charts/         # Donut and Line charts utilizing Recharts
│   │   ├── layout/         # Navigation components (Sidebar, Header)
│   │   ├── shared/         # Common display widgets (MetricCard, StatusBadge)
│   │   └── ui/             # Core building block elements (Badge, Button, Card)
│   ├── hooks/              # Custom TanStack React Query encapsulation hooks
│   ├── lib/                # Common util algorithms, styling handlers, and auth configuration
│   ├── providers/          # Global context bindings (Query, Auth, Theme, SignalR)
│   ├── services/           # Axios-equivalent API client and SignalR sockets service
│   ├── stores/             # Global client-state structures powered by Zustand
│   └── types/              # Unified TypeScript definitions and structures
├── next.config.ts          # Core Next.js configuration
├── package.json            # Scripts and package manifests
└── tailwind.config.ts      # Tailwind CSS configuration tokens
```

---

## Real-Time Synchronization Pipeline

This application uses a highly optimized **Direct SignalR WebSocket Connection** for event-driven real-time cache updates:

- **Bypasses Proxies**: The connection avoids Next.js server rewrites, establishing a direct connection to `ws://YOUR_API_URL/hubs/sigma` via WebSockets.
- **Fast Negotiation**: Uses `skipNegotiation: true` to bypass initial HTTP negotiation round-trips, speeding up connection times down to ~50ms.
- **Graceful Reconnection**: Uses an escalating exponential backoff delay strategy (`5s` → `10s` → `20s` → `40s` → max `60s`) to ensure server resilience.
- **Context Injection**: Exposes a React Context hook `useSignalRState()` allowing any UI component to display live connection telemetry.
- **Smart Invalidation**: When the server broadcasts an `entityUpdated` message, TanStack React Query automatically invalidates the corresponding query keys (`["applications"]`, `["service-principals"]`), sparking quiet, smooth background re-fetches with zero screen flickering.

---

## Contribution

We welcome contributions from the community! Please follow these guidelines:
1. Fork the repo and create your feature branch: `git checkout -b feature/amazing-feature`.
2. Commit your changes with descriptive messages: `git commit -m 'feat: add support for pagination filter'`.
3. Push to the branch: `git push origin feature/amazing-feature`.
4. Open a Pull Request for review.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

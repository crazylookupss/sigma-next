# SIGMA Web Client

> **S**ecure **I**dentity **G**ateway & **M**anagement **A**dmin Dashboard
>
> Modern enterprise-grade React SPA admin portal for Microsoft Entra ID directory audit and access governance.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat&logo=tailwindcss)
[![CI](https://github.com/crazylookupss/sigma-next/actions/workflows/ci.yml/badge.svg)](https://github.com/crazylookupss/sigma-next/actions/workflows/ci.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Security Policy](https://img.shields.io/badge/security-policy-red.svg)](SECURITY.md)

---

## Overview

**SIGMA Web Client** is the official premium dashboard interface for the [SIGMA API Gateway](https://github.com/crazylookupss/SIGMA-Beta). Built with a state-of-the-art **quantum-dark glassmorphism** design system, it provides identity operators, governance officers, and global auditors with a unified panel to search, audit, and analyze:

- **Directory Users**: Details, statuses, domains, and object IDs.
- **Security Groups**: Group memberships, synchronization statistics, and types.
- **App Registrations**: Secret/certificate health tracker, manifest viewer, and owner lists.
- **Enterprise Applications**: Service principals, user/group assignments, and linked registration mapping.
- **Analytics & Telemetry**: Live tenant status, sync latency, and sign-in activity.
- **Governance Findings**: Security audit dashboard with ownerless apps, expired secrets, and compliance findings.
- **SignalR WebSockets**: Real-time server-push synchronization of entity update events.

---

## Premium UI/UX Design System

- **Quantum Dark Mode**: A deep, rich, low-light backdrop utilizing harmonized slate and violet undertones.
- **Glassmorphism Design**: High-transparency card layers using dynamic backdrop blur (`backdrop-filter`) and thin luminous borders.
- **Micro-Animations**: Butter-smooth interactions powered by **Framer Motion** and **Tailwind CSS v4**.
- **State-of-the-Art Data Visualization**: Highly responsive charts using **Recharts** and high-speed multi-column filtering using **AG Grid React**.
- **3 Theme System**: Quantum Dark (default), Aether Light, and Nebula Violet.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Compiler** | [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **State (Server)** | [TanStack React Query v5](https://tanstack.com/query) |
| **State (Client)** | [Zustand](https://github.com/pmndrs/zustand) |
| **Authentication** | [NextAuth.js v5 Beta](https://nextjs.org/) with Microsoft Entra ID |
| **Real-Time** | [@microsoft/signalr](https://learn.microsoft.com/en-us/aspnet/core/signalr/) over WebSockets |
| **Data Grid** | [AG Grid React](https://www.ag-grid.com/react-data-grid/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## Quick Start

### Prerequisites

- [Node.js v20.x or higher](https://nodejs.org/)
- Running instance of the [SIGMA API Backend Gateway](https://github.com/crazylookupss/SIGMA-Beta)
- Microsoft Entra ID tenant with a configured Client App Registration (see [Authentication](#authentication))

### Installation

```bash
# Clone the repository
git clone https://github.com/crazylookupss/sigma-next.git
cd sigma-next

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Configuration below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

### Docker

```bash
docker compose up --build
```

---

## Configuration

The client requires the following variables in `.env.local`:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of your SIGMA API | `http://localhost:5107` |
| `NEXTAUTH_URL` | URL where this Next.js app is hosted | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Strong 32-char secret (`openssl rand -base64 32`) | `<random-secret>` |
| `AZURE_AD_CLIENT_ID` | Entra ID Client App Registration ID | `<client-app-id>` |
| `AZURE_AD_CLIENT_SECRET` | Entra ID Client App Registration Secret | `<client-app-secret>` |
| `AZURE_AD_TENANT_ID` | Entra ID Tenant (Directory) ID | `<tenant-id>` |

---

## Authentication Model

SIGMA uses a **Two-App Registration** model in Microsoft Entra ID for least-privilege security:

1. **Backend API App (`SIGMA-Api`)**: Holds Graph API application permissions (`User.Read.All`, `Group.Read.All`, etc.).
2. **Frontend Client App (`SIGMA-Web`)**: Holds **zero** direct Graph permissions. It handles user sign-in and obtains a delegated JWT token.

```
+--------------+     User JWT Token     +--------------+    Graph Call     +-----------------+
|              |    (access_as_user)    |              | (App Secret)      |                 |
|  Client App  | ----------------------> |  SIGMA.Api   | ----------------> | Microsoft Graph |
| (sigma-next) |                        | (API Gateway)|                   |      (API)      |
|              | <---------------------- |              | <---------------- |                 |
+--------------+      API Response      +--------------+    Graph Data     +-----------------+
```

### Entra ID Setup for the Client App

1. Go to **Microsoft Entra admin center > App registrations > New registration**.
2. Name: `SIGMA-Web`.
3. Supported account types: **Accounts in this organizational directory only** (Single tenant).
4. Redirect URI: Select **Web** and enter `http://localhost:3000/api/auth/callback/azure-ad`.
5. Under **API permissions**:
   - Add a permission > **APIs my organization uses** > select `SIGMA-Api`.
   - Select **Delegated permissions** > `access_as_user`.
   - Click **Grant admin consent**.
6. Under **Certificates & secrets**: Create a new Client Secret.

---

## Project Structure

```
sigma-next/
├── public/                     # Static assets and icons
├── src/
│   ├── app/                    # App Router layouts, pages, and route handlers
│   │   ├── (dashboard)/        # Auth-protected administration dashboard pages
│   │   │   ├── page.tsx        # Dashboard overview
│   │   │   ├── users/          # User directory + detail pages
│   │   │   ├── groups/         # Security groups + detail pages
│   │   │   ├── applications/   # Enterprise apps + detail pages
│   │   │   ├── app-registrations/  # App registrations + detail pages
│   │   │   └── governance/     # Governance findings dashboard
│   │   ├── api/auth/           # NextAuth.js API route handler
│   │   ├── landing/            # Public sign-in page (glassmorphic)
│   │   └── layout.tsx          # Root providers injection point
│   ├── components/             # Reusable presentation and UI elements
│   │   ├── charts/             # Donut and Line charts (Recharts)
│   │   ├── layout/             # Sidebar, Header, ThemeToggle
│   │   ├── shared/             # MetricCard, StatusBadge, OverviewField
│   │   └── ui/                 # Badge, Button, Card, Skeleton
│   ├── hooks/                  # TanStack React Query hooks
│   ├── lib/                    # Auth config, utilities
│   ├── providers/              # Query, Auth, Theme, SignalR providers
│   ├── services/               # API client, SignalR service
│   ├── stores/                 # Zustand client-state stores
│   └── types/                  # TypeScript type definitions
├── docs/                       # Project documentation
├── Dockerfile
├── docker-compose.yml
├── .env.example                # Environment variable template
├── next.config.ts              # Next.js configuration
├── package.json
└── CONTRIBUTING.md
```

---

## Real-Time Synchronization Pipeline

The application uses a **Direct SignalR WebSocket Connection** for event-driven real-time cache updates:

- **Bypasses Proxies**: Direct connection to `ws://YOUR_API_URL/hubs/sigma` via WebSockets.
- **Fast Negotiation**: `skipNegotiation: true` for ~50ms connection times.
- **Graceful Reconnection**: Exponential backoff (`5s` -> `10s` -> `20s` -> `40s` -> max `60s`).
- **Smart Invalidation**: Server `entityUpdated` messages auto-invalidate TanStack React Query caches.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | Project architecture and design decisions |
| [Components](docs/components.md) | Component library and usage patterns |
| [Deployment](docs/deployment.md) | Docker, Vercel, and manual deployment |

---

## Related Projects

| Project | Description |
|---------|-------------|
| [SIGMA API](https://github.com/crazylookupss/SIGMA-Beta) | .NET 10 backend API gateway |

---

## Testing

```bash
# E2E smoke tests (Playwright)
npx playwright install chromium
npm run build
npm run test:e2e
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
Please report security issues via [SECURITY.md](SECURITY.md).

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

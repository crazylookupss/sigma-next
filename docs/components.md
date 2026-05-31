# Components

## UI Components (`src/components/ui/`)

Core building blocks used throughout the application.

| Component | File | Variants | Description |
|-----------|------|----------|-------------|
| Badge | `badge.tsx` | 6 variants (default, secondary, destructive, outline, success, warning) | Status indicators |
| Button | `button.tsx` | 5 variants x 4 sizes | Interactive actions |
| Card | `card.tsx` | Card, CardHeader, CardContent | Content containers |
| Skeleton | `skeleton.tsx` | N/A | Loading placeholders |

All UI components use **class-variance-authority (CVA)** for variant management and **tailwind-merge** for class deduplication via the `cn()` utility.

## Shared Components (`src/components/shared/`)

| Component | File | Description |
|-----------|------|-------------|
| MetricCard | `metric-card.tsx` | Dashboard KPI card with icon, value, and label |
| OverviewField | `overview-field.tsx` | Label-value row with optional copy-to-clipboard |
| StatusBadge | `status-badge.tsx` | Colored status indicator (active, warning, error, etc.) |

## Layout Components (`src/components/layout/`)

| Component | File | Description |
|-----------|------|-------------|
| Sidebar | `sidebar.tsx` | Collapsible navigation with 6 nav items |
| Header | `header.tsx` | Top bar with theme toggle, user info, sign-out |
| ThemeToggle | `theme-toggle.tsx` | 3-way theme switcher (Dark/Light/Violet) |

## Chart Components (`src/components/charts/`)

| Component | File | Description |
|-----------|------|-------------|
| DonutChart | `donut-chart.tsx` | Recharts PieChart (donut variant) for distributions |
| LineChart | `line-chart.tsx` | Recharts LineChart for time-series data |

## Pages (`src/app/`)

### Public

| Route | Page | Description |
|-------|------|-------------|
| `/landing` | `LandingPage` | Glassmorphic sign-in page with Microsoft SSO |

### Dashboard (Auth-Protected)

| Route | Page | Description |
|-------|------|-------------|
| `/` | `DashboardPage` | 5 metric cards, tenant diagnostics, sync timeline |
| `/users` | `UsersPage` | AG Grid user directory with search |
| `/users/[id]` | `UserDetailPage` | 5-tab user inspector (863 lines) |
| `/groups` | `GroupsPage` | AG Grid security groups list |
| `/groups/[id]` | `GroupDetailPage` | 10-tab group inspector (750 lines) |
| `/applications` | `ApplicationsPage` | Enterprise apps with dashboard metrics |
| `/applications/[id]` | `ApplicationDetailPage` | 6-tab SP detail (900+ lines) |
| `/app-registrations` | `AppRegistrationsPage` | App registrations grid |
| `/app-registrations/[id]` | `AppRegistrationDetailPage` | 8-tab app detail (901 lines) |
| `/governance/findings` | `GovernanceFindingsPage` | Security audit with 5-category grid |

## Creating New Components

Follow these conventions:

1. Use functional components with TypeScript
2. Use `cn()` from `src/lib/utils.ts` for conditional classes
3. Place reusable UI in `src/components/ui/`
4. Place feature-specific components in `src/components/shared/` or co-locate with the page
5. Prefer CVA for variant-based styling

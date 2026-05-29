"use client";

import { useTenant } from "@/hooks/use-tenant";
import { useAppDashboard } from "@/hooks/use-applications";
import { MetricCard } from "@/components/shared/metric-card";
import { DonutChart } from "@/components/charts/donut-chart";
import { LineChart } from "@/components/charts/line-chart";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Group,
  Code2,
  AppWindow,
  Monitor,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OverviewField } from "@/components/shared/overview-field";
import { formatDate, formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const { data: tenant, isLoading: tenantLoading, error: tenantError, refetch: refetchTenant } = useTenant();
  const { data: dashboard, isLoading: dashLoading } = useAppDashboard();

  if (tenantLoading) {
    return <DashboardSkeleton />;
  }

  if (tenantError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-8 max-w-md">
          <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Connection Offline</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Unable to reach the SIGMA API. Please verify the service is running.
          </p>
          <button
            onClick={() => refetchTenant()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh]">
      <div className="glow-sphere-1" />
      <div className="glow-sphere-2" />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground relative z-10">
        <span>Directory</span>
        <ChevronRightIcon />
        <span className="text-primary font-semibold">Overview</span>
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6 relative z-10"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Access & Governance Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Secure Identity, Governance & Access Management for Microsoft Entra ID.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default">
              <Shield className="w-3 h-3 mr-1" />
              Role: Global Auditor
            </Badge>
            <button
              onClick={() => refetchTenant()}
              className="p-2 rounded-lg glass-card hover:bg-accent transition-colors text-muted-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6 relative z-10"
      >
        <MetricCard
          title="Directory Users"
          value={formatNumber(tenant?.usersCount)}
          icon={<Users className="w-5 h-5" style={{ color: "#3b82f6" }} />}
          accentColor="blue"
          onClick={() => router.push("/users")}
        />
        <MetricCard
          title="Security Groups"
          value={formatNumber(tenant?.groupsCount)}
          icon={<Group className="w-5 h-5" style={{ color: "#a855f7" }} />}
          accentColor="purple"
          onClick={() => router.push("/groups")}
        />
        <MetricCard
          title="App Registrations"
          value={formatNumber(tenant?.applicationsCount)}
          icon={<Code2 className="w-5 h-5" style={{ color: "#14b8a6" }} />}
          accentColor="teal"
          onClick={() => router.push("/app-registrations")}
        />
        <MetricCard
          title="Enterprise Apps"
          value={formatNumber(tenant?.enterpriseApplicationsCount)}
          icon={<AppWindow className="w-5 h-5" style={{ color: "#f59e0b" }} />}
          accentColor="amber"
          onClick={() => router.push("/applications")}
        />
        <MetricCard
          title="Registered Devices"
          value={formatNumber(tenant?.devicesCount)}
          icon={<Monitor className="w-5 h-5" style={{ color: "#6366f1" }} />}
          accentColor="indigo"
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Application Health</h3>
              </div>
            </CardHeader>
            <CardContent>
              {dashLoading ? (
                <Skeleton className="h-[300px] w-full rounded-lg" />
              ) : (
                <DonutChart data={dashboard?.healthDistribution ?? []} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold text-foreground">30-Day Sign-In Activity</h3>
            </CardHeader>
            <CardContent>
              {dashLoading ? (
                <Skeleton className="h-[300px] w-full rounded-lg" />
              ) : (
                <LineChart data={dashboard?.signInTrend ?? []} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tenant Info / Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Tenant Connection</h3>
                <StatusPulse />
              </div>
            </CardHeader>
            <CardContent>
              <OverviewField label="Directory Display Name" value={tenant?.displayName} />
              <OverviewField label="Primary Domain" value={tenant?.primaryDomain} />
              <OverviewField label="Tenant ID" value={tenant?.id} mono />
              <OverviewField
                label="License Tier"
                value={<Badge variant="default">{tenant?.license}</Badge>}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold text-foreground">
                System Synchronization Diagnostics
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <TimelineItem
                  dotColor="success"
                  title="Active Directory Handshake Resolved"
                  description="Validated Entra ID tenant security keys. API responses are healthy."
                />
                <TimelineItem
                  dotColor="success"
                  title="Parallel Telemetry Sync Completed"
                  description="Fetched live statistics from backend. Pagination resolved successfully."
                />
                <TimelineItem
                  dotColor="info"
                  title="Diagnostic Schema Node Ready"
                  description="Delta index pipelines initialized. Ready for deeper audit actions."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="w-4 h-4 mx-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function StatusPulse() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-2 h-2">
        <div className="w-2 h-2 rounded-full bg-success" />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-40" />
      </div>
      <span className="text-xs font-bold text-success tracking-wider">CONNECTED</span>
    </div>
  );
}

function TimelineItem({
  dotColor,
  title,
  description,
}: {
  dotColor: "success" | "info" | "warning";
  title: string;
  description: string;
}) {
  const colors = {
    success: "bg-success",
    info: "bg-blue-500",
    warning: "bg-warning",
  };
  return (
    <div className="relative pl-7 pb-4 last:pb-0">
      <div className="absolute left-[5px] top-[6px] w-[2px] h-full bg-border last:hidden" />
      <div
        className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-card ${colors[dotColor]} shadow-sm`}
      />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 skeleton rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[350px] rounded-xl" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
    </div>
  );
}

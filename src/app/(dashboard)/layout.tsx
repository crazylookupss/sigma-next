import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SignalRProvider } from "@/providers/signalr-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignalRProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-60 lg:ml-60 transition-all duration-200">
          <Header />
          <main className="flex-1 p-6 relative overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SignalRProvider>
  );
}

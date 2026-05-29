import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the X-Powered-By header for security
  poweredByHeader: false,

  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5107";
    return [
      {
        // Forward v1 Entra API calls to the SIGMA API backend.
        // This intentionally excludes /api/auth/* which is handled by NextAuth locally.
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
      // NOTE: SignalR /hubs/* rewrite removed — the client now connects
      // directly to the backend URL for true WebSocket support.
      // Next.js rewrites only handle HTTP, not WebSocket upgrades.
    ];
  },
};

export default nextConfig;

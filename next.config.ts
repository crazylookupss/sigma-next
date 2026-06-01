import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Remove the X-Powered-By header for security
  poweredByHeader: false,

  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tanstack/react-query",
      "recharts",
      "framer-motion",
      "class-variance-authority",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

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

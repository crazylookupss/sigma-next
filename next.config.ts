import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5107";
    const apiOrigin = new URL(apiUrl).origin;
    const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || "";
    let sentryOrigin = "";
    try {
      if (sentryDsn) sentryOrigin = new URL(sentryDsn).origin;
    } catch {}

    const connectSrc = [
      "'self'",
      apiOrigin,
      apiOrigin.replace("http", "ws"),
      sentryOrigin,
    ].filter(Boolean).join(" ");

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
          { key: "X-XSS-Protection", value: "0" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              `connect-src ${connectSrc}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
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

export default withSentryConfig(nextConfig, {
  // Automatically tree-shake Sentry logger to reduce bundle size
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});

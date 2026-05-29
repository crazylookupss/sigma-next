"use client";

import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="glass-card p-8 max-w-md text-center">
        <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-2">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset} variant="default">
          Try again
        </Button>
      </div>
    </div>
  );
}

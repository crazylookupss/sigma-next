"use client";

import { signIn } from "next-auth/react";
import { Shield, Users, Lock, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="glow-sphere-1" />
      <div className="glow-sphere-2" />

      <div className="relative z-10 text-center max-w-lg px-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/10">
          <Shield className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
          SIGMA Access Portal
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed text-sm">
          Secure Identity, Governance &amp; Access Management for Microsoft Entra ID.
          Monitor users, groups, applications, and audit your directory with
          real-time visibility.
        </p>

        <button
          id="btn-sign-in-entra"
          onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]"
        >
          {/* Microsoft Logo SVG */}
          <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          Sign in with Microsoft
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          You will be redirected to your Microsoft Entra ID tenant for authentication.
        </p>

        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">Identity</p>
            <p className="text-xs text-muted-foreground">Users &amp; Groups</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">Governance</p>
            <p className="text-xs text-muted-foreground">Access Control</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">Audit</p>
            <p className="text-xs text-muted-foreground">Activity Trail</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Users, Lock, BarChart3 } from "lucide-react";
import { SignInButton } from "@/components/shared/sign-in-button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="glow-sphere-1" />
      <div className="glow-sphere-2" />

      <div className="relative z-10 text-center max-w-lg px-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/5">
          <Image
            src="/logo/logo-icon.png"
            alt="SIGMA Logo Mark"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
        </div>

        <div className="flex justify-center mb-6">
          <Image
            src="/logo/logo-text.png"
            alt="SIGMA - Identity, Governance, Security, Intelligence"
            width={340}
            height={98}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="sr-only">SIGMA Access Portal</h1>
        <p className="text-muted-foreground mb-10 leading-relaxed text-sm">
          Secure Identity, Governance &amp; Access Management for Microsoft Entra ID.
          Monitor users, groups, applications, and audit your directory with
          real-time visibility.
        </p>

        <SignInButton />

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

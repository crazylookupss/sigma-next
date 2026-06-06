"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
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
  );
}

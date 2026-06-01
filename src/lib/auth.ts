import NextAuth from "next-auth";
import EntraID from "next-auth/providers/microsoft-entra-id";

const apiScope =
  process.env.AZURE_AD_API_SCOPE ??
  "api://f0ee212a-b836-4f5c-aafe-bee4b0ebfcfb/access_as_user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: process.env.AUTH_TRUST_HOST === "true",
  providers: [
    EntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: `openid profile email offline_access ${apiScope}`,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/landing",
  },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

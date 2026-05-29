import NextAuth from "next-auth";
import EntraID from "next-auth/providers/microsoft-entra-id";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    EntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: "openid profile email offline_access api://f0ee212a-b836-4f5c-aafe-bee4b0ebfcfb/access_as_user ",
        }, //api://80fd4919-4d7d-4fae-95a2-3342858a5166/access_as_user // api://f0ee212a-b836-4f5c-aafe-bee4b0ebfcfb/access_as_user
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

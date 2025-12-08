import NextAuth from "next-auth"
import { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak"

import { getDokployUserByEmail } from "@/lib/dokploy";

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Fetch dokploy user ID
        if (user.email) {
          const dokployUser = await getDokployUserByEmail(user.email);
          token.dokployUserId = dokployUser?.id || null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.dokployUserId = token.dokployUserId || null;
      }
      return session;
    }
  }
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
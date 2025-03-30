import NextAuth, { Session } from "next-auth";
import Google from "next-auth/providers/google";
import { NextRequest } from "next/server";

type AuthType = {
  auth: Session | null;
  request: NextRequest;
};

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }: AuthType) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);

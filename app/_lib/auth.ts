import NextAuth, { Session, User } from "next-auth";
import Google from "next-auth/providers/google";
import { NextRequest } from "next/server";
import { createGuest, getGuest } from "@/app/_lib/data-service";

type AuthType = {
  auth: Session | null;
  request: NextRequest;
};

interface CustomSession extends Session {
  user:
    | {
        name?: string;
        email?: string;
        image?: string;
        id?: string;
      }
    | undefined;
}

const authConfig = {
  trust: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }: AuthType) {
      return !!auth?.user;
    },
    async signIn({ user }: { user: User }) {
      try {
        if (!user.email) return false;
        const existingGuest = await getGuest(user.email);
        if (!existingGuest) {
          await createGuest({
            email: user.email,
            fullName: user.name || "",
          });
        }

        return true;
      } catch {
        return false;
      }
    },
    async session({ session }: { session: Session }) {
      const customSession = session as CustomSession;

      if (customSession.user?.email) {
        const guest = await getGuest(customSession.user.email);

        if (guest) {
          customSession.user.id = String(guest.id);
        }
      }

      return customSession;
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

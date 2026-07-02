import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isCorrectPassword) throw new Error("Invalid credentials");

        if (user.role === "SUPERADMIN") {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantName: user.restaurantName,
          };
        }

        if (credentials.portal === "STAFF" && user.role !== "ADMIN") {
          throw new Error("Only restaurant staff can access this portal");
        }
        
        if (credentials.portal === "STUDENT" && user.role !== "STUDENT") {
          throw new Error("Restaurant staff must use the staff portal");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          restaurantName: user.restaurantName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.restaurantName = user.restaurantName;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.restaurantName = token.restaurantName as string | null;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

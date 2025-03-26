import axios from "axios";
import NextAuth, { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { apiRequest } from "../api/api-handler/generic";

interface UserJWT extends JWT {
  id: string;
  email: string;
  roleName: string;
  name: string;
  phone: string;
  gender: string;
  avatarUrl: string;
  roleId: number;
  access_token: string;
  refresh_token: string;
  emailVerified: Date | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const result = await apiRequest<{ payload: any, meta_data: any }>(() =>
            axios.post(`${API_URL}/auths`, {
              email: credentials.email,
              password: credentials.password,
            })
          );

          if (result.success) {
            const { payload, meta_data } = result.data;
            return { ...payload, ...meta_data };
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as UserJWT;
      if (token) {
        const {
          id,
          email,
          roleName,
          name,
          phone,
          gender,
          avatarUrl,
          roleId,
          access_token  ,
          refresh_token,
        } = token;
        Object.assign(session.user, {
          id,
          email,
          roleName,
          name,
          phone,
          gender,
          avatarUrl,
          roleId,
          access_token,
          refresh_token,
        });
      }
      return session;
    },
  },
  pages: { signIn: "/signin" },
  secret: process.env.NEXTAUTH_SECRET!,
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth(authOptions);

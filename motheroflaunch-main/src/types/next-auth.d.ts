// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      pro?: boolean;
      role?: "user" | "creator" | "admin";
      githubUsername?: string;
      fuma?: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
    };
    accessToken?: string;

    // ✅ Add this to match Better Auth
    session?: {
      id: string;
      userId: string;
      token: string;
      createdAt: string;
      updatedAt: string;
      expiresAt: string;
      ipAddress?: string;
      userAgent?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    pro?: boolean;
    role?: "user" | "creator" | "admin";
    githubUsername?: string;
    createdAt?: string;
  }
}

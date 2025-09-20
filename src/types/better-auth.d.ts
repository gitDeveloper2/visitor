// types/better-auth.d.ts
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "../app/auth";

// Extend the Better Auth types with our custom fields
export type User = inferAdditionalFields<typeof auth>["user"];
export type Session = inferAdditionalFields<typeof auth>["session"];

// Additional type definitions for our custom fields
export interface CustomUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  avatarUrl?: string;
  githubUsername?: string;
  pro: boolean;
  role: string;
  suspended: boolean;
  socialAccounts: Array<{ type: string; value: string }>;
  kind: string;
}

export interface CustomSession {
  user: CustomUser;
  expires: string;
  votingToken?: string;
}

// Export the auth instance type
export type AuthInstance = typeof auth;

// Module augmentation to extend Better Auth types
declare module "better-auth/client" {
  interface Session {
    votingToken?: string;
  }
}
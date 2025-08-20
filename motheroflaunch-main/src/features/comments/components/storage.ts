// features/comments/components/storage.ts
import { createMongoDBAdapter } from "@fuma-comment/server/adapters/mongo-db";
import { db } from "@features/shared/lib/mongodb";

export const storage = createMongoDBAdapter({
  db,
  auth: "next-auth", // or "better-auth"
});

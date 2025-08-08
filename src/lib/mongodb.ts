// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";
import { PageStats } from "../types/PageStats";
const uri =
  process.env.NEXT_PUBLIC_MONGO_URI_DEV ??
  process.env.NEXT_PUBLIC_MONGO_URI ??
  "mongodb+srv://2iamjustin:Z4aFXyaraOXkjUDB@cluster0.10dpslm.mongodb.net/?retryWrites=true&w=majority"; // Use environment variable for URI
const databasename = process.env.NEXT_PUBLIC_MONGO_DATABASE || "basicutils";

const client = new MongoClient(uri);

let db: Db;

export async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(databasename);
    } catch (error) {
      throw new Error("Database connection error");
    }
  }

  return { db, client };
}

export const updatePageStats = async (slug: string, stats: PageStats) => {
  const result = await db.collection("pageStats").updateOne(
    { slug }, // Match the page by its slug
    {
      $set: {
        ...stats,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return result;
};


export const dbObject = client.db(databasename);

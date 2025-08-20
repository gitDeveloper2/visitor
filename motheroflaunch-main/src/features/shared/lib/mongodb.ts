// lib/mongodb.ts
import { MongoClient } from "mongodb";
import { env } from "./env";

const uri = env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const client = new MongoClient(uri);

export const db = client.db(env.MONGODB_DATABASE);

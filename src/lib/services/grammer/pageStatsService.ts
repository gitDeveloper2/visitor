import { Db } from "mongodb";
import { PageStats } from "../../../types/PageStats";
import { connectToDatabase } from "../../mongodb";

export const updatePageStats = async (slug: string, stats: PageStats) => {
    const { db } = await connectToDatabase();
  
    const existingEntry = await db.collection("pageStats").findOne({ slug });
  
    const mergedStats = {
      ...existingEntry, // Include existing fields
      ...stats, // Overwrite with new stats
    };
  
    const updateDocument = {
      slug,
      ...mergedStats, // Assign all merged stats directly
      updatedAt: new Date(),
    };
  
    const result = await db.collection("pageStats").updateOne(
      { slug },
      { $set: updateDocument },
      { upsert: true }
    );
  
    return result;
  };
  

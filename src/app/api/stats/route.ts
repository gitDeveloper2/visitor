import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import { extractTextContentFromHTML } from "../../../utils/transformers/HtmlStrings";
import { analyzePage } from "../../../lib/services/grammer/contentAnalysisService";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const stats = await db.collection("pageStats").find().toArray();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching page stats:", error);
    return NextResponse.json({ error: "Failed to fetch page stats" }, { status: 500 });
  }
}



export const POST = async () => {
  const { db } = await connectToDatabase();
  
  try {
    // Fetch all pages from the database
    const pages = await db.collection("pages").find().toArray();

    if (!pages.length) {
      return NextResponse.json({ message: "No pages found" }, { status: 404 });
    }

    // Prepare the bulk update operation
   // Prepare the bulk update operation
const bulkUpdates = pages.map(async (page) => {
  try {
    if (!page.content) {
      return null; // Skip if content is missing
    }

    // Extract text content and analyze the page
    const textContent = extractTextContentFromHTML(page.content);
    const stats = await analyzePage(textContent);

    // Create the update object for bulk write with upsert: true
    const updateDoc = {
      updateOne: {
        filter: { slug: page.slug },
        update: {
          $set: { 
            "stats": {
              ...stats,
              url: page.slug,
              slug: page.slug,
            },
            updatedAt: new Date(),
          },
        },
        upsert: true, // Ensure it inserts a new document if none is found
      },
    };

    return updateDoc;
  } catch (error) {
    console.error(`Error processing page ${page.slug}:`, error);
    return null; // Skip the update for this page on error
  }
});


    // Resolve all bulk update operations
    const bulkOps = (await Promise.all(bulkUpdates)).filter(Boolean); // Filter out null entries

    if (bulkOps.length === 0) {
      console.log("No stats were updated")
      return NextResponse.json({ message: "No updates were made" }, { status: 200 });
    }

    // Perform bulk update
    const result = await db.collection("pageStats").bulkWrite(bulkOps);

    return NextResponse.json({
      message: "Stats calculation completed",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    }, { status: 200 });

  } catch (error) {
    console.error("Error calculating stats for all pages:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};


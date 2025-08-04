import { docs } from "googleapis/build/src/apis/docs";
import { Category, subcategory } from "../../../app/data/CatgoriesData";
import logger from "../../../utils/logger/customLogger";
import { connectToDatabase } from "../../mongodb";
import { WithId, Document, ObjectId } from "mongodb"; // Import necessary types from mongodb
const BASEURL=process.env.NEXT_PUBLIC_BASE_URL||"https://basicutils.com";
const documentId = new ObjectId("60d5f4837d5b1c6c8f1edb1a"); // Example ObjectId
// Fetch data from the database
const fetchPagesFromDatabase = async () => {
  const { db } = await connectToDatabase();
  const pagesCollection = db.collection("pages");

  return pagesCollection
    .find({}, { projection: { domain: 1, canonical_url: 1, _id: 0 } })
    .toArray();
};

// Group pages by their domain
const groupPagesByDomain = (pages: WithId<Document>[]): Record<string, string[]> => {
  return pages.reduce((acc, page) => {
    const domain = page.domain as string;
    const canonicalUrl = page.canonical_url as string;

    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(canonicalUrl);
    return acc;
  }, {} as Record<string, string[]>);
};

const enrichWithStaticUrls = (
  subcategories: subcategory[],
  domain: string,
  staticUrls: Record<string, string[]>
): subcategory[] => {
  const staticUrlKey = domain.toLowerCase().trim();

  // Explicitly check if the static URL key exists
  if (staticUrls[staticUrlKey]) {
    staticUrls[staticUrlKey].forEach((url) => {
      // Avoid duplicates in subcategories
      if (!subcategories.some((subcat) => subcat.path === url)) {
        subcategories.push({
          name: `${staticUrlKey} Blog`,
          path: url,
        });
      }
    });
  } else {
    // console.log(`No static URLs found for domain '${staticUrlKey}'.`);
  }

  return subcategories;
};




const mapUrlsToSubcategories = (urls: string[]): subcategory[] => {
  // Deduplicate URLs before processing
  const uniqueUrls = Array.from(new Set(urls));

  return uniqueUrls.map((url) => {
    const slug = url.replace(BASEURL, ""); // Extract slug from URL
    const name =
      slug
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replace(/[-_]/g, " ") // Convert slug to a readable name
        ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";
    return {
      name,
      path: slug,
    };
  });
};

// Save processed categories to the database (ensure successful save)
const saveCategoriesToDatabase = async (categories: Category[]) => {
  try {
    const { db } = await connectToDatabase();
    const categoriesIndexCollection = db.collection("categoriesIndex");

    await categoriesIndexCollection.replaceOne(
      { _id: documentId }, // Use a string for _id
      { categories, updatedAt: new Date() }, // Save categories with a timestamp
      { upsert: true }
    );
    // console.log("Categories successfully saved to the database.");
  } catch (error) {
    console.error("Error saving categories to the database:", error);
    throw new Error("Failed to save categories to the database.");
  }
};
// Fetch processed categories directly from the index
export const fetchProcessedCategories = async (): Promise<Category[]> => {
  try {
    const { db } = await connectToDatabase();
    const categoriesIndexCollection = db.collection("categoriesIndex");

    // Fetch the document with the processed categories
    const document = await categoriesIndexCollection.findOne({ _id: documentId });

    if (!document || !document.categories) {
      throw new Error("No processed categories found in the database.");
    }

    // console.log("Successfully fetched processed categories from the database.");
    return document.categories as Category[];
  } catch (error) {
    logger.error("Error fetching processed categories:", error);
    throw error;
  }
};

// Fetch and save categories (triggered by Vercel cron job)
export const fetchAndSaveCategories = async (): Promise<void> => {
  try {
    // 1. Fetch pages from the database
    const pages = await fetchPagesFromDatabase();

    // 2. Group pages by domain
    const groupedByDomain = groupPagesByDomain(pages);

    // 3. Static URLs mapping for enrichment
    const staticUrls: Record<string, string[]> = {
      react: ["https://basicutils.com/blog/lucide_react_icons"],
      prisma: ["https://basicutils.com/blog/prisma-self-relations"],
      devops: ["https://basicutils.com/blog/understanding_github_actions_workflow_dispatch2"],
      zod: [
        "https://basicutils.com/blog/zod_enum_validation",
        "https://basicutils.com/blog/zod_full_tutorial",
      ],
    };

    // 4. Construct categories from database data
    const categories = Object.entries(groupedByDomain)
      .map(([domain, urls]) => {
        // Skip processing for the "apps" category
        if (domain === "apps") return null;

        // Map URLs to subcategories
        let subcategories = mapUrlsToSubcategories(urls);

        // Enrich with static URLs
        subcategories = enrichWithStaticUrls(subcategories, domain, staticUrls);

        return {
          name: domain,
          path: `/categories/${domain.toLowerCase().replace(/\s+/g, "-")}`,
          subcategories,
        };
      })
      .filter((category) => category !== null) as Category[];

    // 5. Add static-only domains
    Object.keys(staticUrls).forEach((staticDomain) => {
      if (!categories.some((category) => category.name === staticDomain)) {
        const subcategories = staticUrls[staticDomain].map((url) => {
          const slug = url.replace(BASEURL, "");
          const name =
            slug
              .split("/")
              .filter(Boolean)
              .pop()
              ?.replace(/[-_]/g, " ")
              ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";
          return {
            name,
            path: slug,
          };
        });

        categories.push({
          name: staticDomain,
          path: `/categories/${staticDomain.toLowerCase().replace(/\s+/g, "-")}`,
          subcategories,
        });
      }
    });

    // Debugging: Log final categories
    // console.log("Final categories:", categories);

    // 6. Save categories to the database
    await saveCategoriesToDatabase(categories);
  } catch (error) {
    logger.error("Error fetching and saving categories:", error);
    throw error;
  }
};







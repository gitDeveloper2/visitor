import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import logger from '../../../utils/logger/customLogger';

export async function POST(req: Request) {
  logger.debug("Started index operation");
  try {
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    const relatedPagesCollection = db.collection('related_pages');
    const indexCollection = db.collection('index');

    const pages = await pagesCollection.find().toArray();
    const tagsMap: { [key: string]: { url: string, title: string, meta_description: string, keywords: string[] }[] } = {};

    pages.forEach(page => {
      const { relatedPages, canonical_url, title, meta_description, keywords } = page;
      if (relatedPages && Array.isArray(relatedPages)) {
        relatedPages.forEach(tag => {
          if (!tagsMap[tag]) {
            tagsMap[tag] = [];
          }
          if (!tagsMap[tag].some(p => p.url === canonical_url)) {
            tagsMap[tag].push({
              url: canonical_url,
              title,
              meta_description, // Add meta_description to the map
              keywords: keywords.split(",") // Assuming keywords are stored as a comma-separated string
            });
          }
        });
      }
    });

    await relatedPagesCollection.deleteMany({});

    const relatedPagesBulkOperations = Object.keys(tagsMap).map(tag => ({
      updateOne: {
        filter: { tag },
        update: { $set: { pages: tagsMap[tag] } },
        upsert: true,
      },
    }));

    await relatedPagesCollection.bulkWrite(relatedPagesBulkOperations);

    await updateIndexCollection(db);
    logger.info("Indexing completed successfully");
    return NextResponse.json({ message: 'Indexing completed successfully' }, { status: 200 });
  } catch (error) {
    logger.error('Error:', { error });
    return NextResponse.json({ message: 'Error indexing pages', error: error }, { status: 500 });
  }
}

async function updateIndexCollection(db: any) {
  const relatedPagesCollection = db.collection('related_pages');
  const indexCollection = db.collection('index');
  const pagesCollection = db.collection('pages');

  const pages = await pagesCollection.find().toArray();
  const relatedPagesData = await relatedPagesCollection.find().toArray();

  const indexMap: { [key: string]: { url: string, title: string, meta_description: string, keywords: string[] }[] } = {};

  pages.forEach(page => {
    const { canonical_url } = page;
    indexMap[canonical_url] = [];
  });

  pages.forEach(page => {
    const { canonical_url, relatedPages, meta_description, keywords } = page;
    if (relatedPages && Array.isArray(relatedPages)) {
      const allRelatedPages = new Map<string, { url: string, title: string, meta_description: string, keywords: string[] }>();

      relatedPages.forEach(tag => {
        const tagData = relatedPagesData.find(entry => entry.tag === tag);
        if (tagData) {
          tagData.pages.forEach(p => {
            if (p.url !== canonical_url && !allRelatedPages.has(p.url)) {
              allRelatedPages.set(p.url, { 
                url: p.url, 
                title: p.title, 
                meta_description: p.meta_description, // Include meta_description
                keywords: p.keywords // Include keywords
              });
            }
          });
        }
      });

      indexMap[canonical_url] = Array.from(allRelatedPages.values());
    }
  });

  await indexCollection.deleteMany({});

  const indexBulkOperations = Object.keys(indexMap).map(pageUrl => ({
    updateOne: {
      filter: { page: pageUrl },
      update: { $set: { relatedPages: indexMap[pageUrl] } },
      upsert: true,
    },
  }));

  await indexCollection.bulkWrite(indexBulkOperations);
}


import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { generateAndInsertToc } from '../../../utils/generators/tableofContents';
import { normalizeHTML } from '../../../utils/transformers/HtmlStrings';
import logger from '../../../utils/logger/customLogger';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const session=await getServerSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthenticated User" }, { status: 401 });
  
  
    }
    const { content, slug, generateToc,refs,faqs } = await request.json();

    // Validate input
    if (!content || !slug) {
      logger.warn("Missing content or slug.");
      return NextResponse.json(
        { message: 'Missing content or slug.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Step 1: Conditionally generate Table of Contents first
    const contentWithToc = generateToc
      ? generateAndInsertToc(content)
      : content;

    // Step 2: Normalize content (after TOC generation)
    const finalContent = normalizeHTML(contentWithToc);
    const defaultRefs = {
      inline: {},
      background: {},
    };
    const defaultFaqs = [];
    // Update the database entry matching the slug with new content
    const result = await db.collection('news').updateOne(
      { slug }, // Match the page by its slug
      {
        $set: {
          content: finalContent,
          refs: refs || defaultRefs,
          faqs: faqs || defaultFaqs,
        },
      }
    );

   
    // Check if the update was successful
    if (result.modifiedCount === 1) {
      logger.info(`${slug} updated successfully`);
      return NextResponse.json({ message: 'Content saved successfully!' });
    } else {
      logger.error(`${slug} failed to update`);
      return NextResponse.json(
        { message: 'Failed to update content.' },
        { status: 400 }
      );
    }
  } catch (error) {
    logger.error('Error updating content:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

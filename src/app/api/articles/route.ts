import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from '../../../lib/mongodb';
import logger from '../../../utils/logger/customLogger';
import { getServerSession } from "../../../lib/auth";
import {redirect} from "next/navigation"
import dbConnect from '../../../lib/config/mongodb';
import BlogPost from '../../../models/BlogPost';
// Optionally import a sanitization library here
// import DOMPurify from 'dompurify';

// Define the response format with default values
const defaultResponse = {
  domain: '',
  slug: '',
  title: '',
  content: '',
  keywords: '',
  meta_description: '',
  canonical_url: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  parentPath: '',
  thisPagePath: '',
  relatedPages: [], // Added field for related pages,
  authorId:"joseph-horace"
};

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const requiredFields = ['domain', 'slug', 'title', 'content', 'keywords', 'meta_description', 'content_type'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ message: `${field} is missing` }, { status: 400 });
      }
    }
    await dbConnect();
    const newBlog = await BlogPost.create({
      ...body,
      author: session.user.email || session.user.name,
      published: false,
      date: new Date(),
      date_updated: new Date(),
    });
    return NextResponse.json({ message: 'Blog post submitted successfully.', blog: newBlog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Blog submission failed.', error: error?.toString() }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const author = url.searchParams.get('author');
    const filter: any = {};
    if (status) filter.published = status === 'published';
    if (author) filter.author = author;
    const blogs = await BlogPost.find(filter).sort({ date: -1 });
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch blogs.', error: error?.toString() }, { status: 500 });
  }
}

export async function PUT(req: Request) {

  try {
    // Parse the JSON body
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['domain', 'slug', 'title', 'content'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ message: `${field} is missing` }, { status: 400 });
      }
    }

    // Optionally: Sanitize HTML content if needed
    // body.content = DOMPurify.sanitize(body.content);

    // Connect to the database
    const { db } = await connectToDatabase();

    // Find the document by domain and slug, and update it with the new values
    const collection = db.collection('pages');
    const result = await collection.updateOne(
      { domain: body.domain, slug: body.slug }, // Search criteria (unique identifier)
      {
        $set: {
          ...body,
          updated_at: new Date().toISOString(), // Always update the timestamp
        },
      }
    );

    // Check if the document was found and updated
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'No page found with the provided domain and slug' },
        { status: 404 }
      );
    }

    // Return a success response with the updated document details
    return NextResponse.json(
      { message: 'Page updated successfully', updatedDocument: body },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error:', { error });
    return NextResponse.json(
      { message: 'Error updating content', error: error },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import logger from '../../../utils/logger/customLogger';
import { getServerSession } from 'next-auth';
import {redirect} from "next/navigation"
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
 
  const session=await getServerSession()
  


  if (!session) {
    return NextResponse.json({ message: "Unauthenticated User" }, { status: 401 });


  }
  try {
    // Parse the JSON body
    const body = await req.json();
  
  

    // Define the response object with default values
    let response = { ...defaultResponse };

    // Update the response object with provided values
    response = {
      ...response,
      ...body,
      news:true,
      created_at: new Date().toISOString(), // Always set to the current date and time
      updated_at: new Date().toISOString(), // Always set to the current date and time
    };

    // Validate required fields
    const requiredFields = ['domain', 'slug', 'title', 'content'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ message: `${field} is missing`, example: response }, { status: 400 });
      }
    }

    // Optional: Sanitize HTML content
    // response.content = DOMPurify.sanitize(response.content);

    // Connect to the database
    const { db } = await connectToDatabase();

    // Insert the document into the 'pages' collection
    const collection = db.collection('news');
    const result = await collection.insertOne(response);

    // Return a success response
    // logger.info("Page inserted successfully",{id: result.insertedId.toString(), insertedDocument: response })
    
    return NextResponse.json({ message: 'Page inserted successfully', id: result.insertedId.toString(), insertedDocument: response }, { status: 201 });
  } catch (error) {
    logger.error('Error:', {error:error});
    return NextResponse.json({ message: 'Error inserting content', error: error }, { status: 500 });
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
    const collection = db.collection('news');
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

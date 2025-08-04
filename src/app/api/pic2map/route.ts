import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'node:fs/promises';
import { extractExifData, updateExifDataAndReturnImage } from '../../../utils/extractors/pic2map';
import { ExifApiResponse, ExifData } from '../../../types/ExifData';


export async function POST(req: NextRequest): Promise<NextResponse> {
  
  let filePath: string | null = null; // To track the file path for cleanup

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
   

    if (!file) {
    
      const errorResponse: ExifApiResponse = {
        success: false,
        message: 'No file uploaded',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
     
      const errorResponse: ExifApiResponse = {
        success: false,
        message: 'File size exceeds the maximum limit of 10MB',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    
    const uploadDir = path.join('/tmp', 'uploads'); // Vercel's writable tmp directory
    await fs.mkdir(uploadDir, { recursive: true });

    const uniqueFileName = `${Date.now()}-${file.name}`;
    filePath = path.join(uploadDir, uniqueFileName);
    

    const arrayBuffer = await file.arrayBuffer();
    
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(filePath, buffer);
  

    const exifMetadata: ExifData = await extractExifData(filePath);
  

    if (!exifMetadata.hasExif) {
      const errorResponse: ExifApiResponse = {
        success: false,
        message: exifMetadata.message || 'No EXIF data found',
        data: exifMetadata, // Still return this for debugging purposes
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const successResponse: ExifApiResponse = {
      success: true,
      message: 'EXIF data extracted successfully.',
      data: exifMetadata,
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error("Error in API:", error);
    const errorResponse: ExifApiResponse = {
      success: false,
      message: 'Error processing the image',
      errorDetails: error instanceof Error ? error.stack : error,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error("Error deleting temporary file:", cleanupError);
      }
    }
  }
}



export async function PUT(req: NextRequest): Promise<NextResponse> {

  try {
    // console.log("processing formdata")
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const exifUpdates = JSON.parse(formData.get('metadata') as string); // This will contain the EXIF data to update
   
    if (!file) {
      const errorResponse = {
        success: false,
        message: 'No file uploaded',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const uniqueFileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Write the uploaded file to the temporary directory
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Update EXIF data and return the updated image buffer
    const updatedImageBuffer = await updateExifDataAndReturnImage(filePath, exifUpdates, uniqueFileName);

    // Set the correct headers for file download
    const successResponse = new NextResponse(updatedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',  // Adjust MIME type based on the file
        'Content-Disposition': `attachment; filename=${uniqueFileName}`,
      },
    });
    
    return successResponse;

  } catch (error) {
  
    const errorResponse = {
      success: false,
      message: 'Error updating EXIF data',
      errorDetails: error,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
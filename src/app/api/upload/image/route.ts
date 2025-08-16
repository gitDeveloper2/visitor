import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import crypto from 'crypto';
import cld from '@/lib/cloudinary';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Check if Cloudinary is configured
const isCloudinaryConfigured = CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET;

// Create Cloudinary API signature (SHA-1 of sorted params + API secret)
function createSignature(params: Record<string, string | number>): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(toSign + CLOUDINARY_API_SECRET).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ message: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (should already be compressed to <1MB)
    const maxSize = 1024 * 1024; // 1MB
    if (imageFile.size > maxSize) {
      return NextResponse.json({ message: 'Image too large' }, { status: 400 });
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured) {
      return NextResponse.json({ 
        message: 'Image upload service not configured. Please contact administrator.' 
      }, { status: 503 });
    }

    // Convert file to base64 data URI (Cloudinary accepts base64 in 'file')
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${imageFile.type};base64,${base64Image}`;

   
    

    // Use multipart/form-data as recommended by Cloudinary
    const body = new FormData();
    body.append('file', dataURI);
    body.append("upload_preset", "blog-images");
    body.append('api_key', String(CLOUDINARY_API_KEY));

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('Cloudinary upload error:', error);
      return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
    }

    const uploadResult = await uploadResponse.json();

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured) {
      return NextResponse.json({ 
        message: 'Image upload service not configured. Please contact administrator.' 
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ message: 'No public ID provided' }, { status: 400 });
    }

    // Signed delete request
    const timestamp = new Date().getTime();
    console.log(timestamp);
    const signature = createSignature({ public_id: publicId, timestamp });

    const body = new FormData();
    body.append('public_id', publicId);
    body.append('timestamp', String(timestamp));
    body.append('api_key', String(CLOUDINARY_API_KEY));
    body.append('signature', signature);

  


    const deleteResponse = await fetch(
      // `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,

      {
        method: 'POST',
        body,
      }
    );

    if (!deleteResponse.ok) {
      const error = await deleteResponse.text();
      console.error('Cloudinary delete error:', error);
      return NextResponse.json({ message: 'Failed to delete image' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
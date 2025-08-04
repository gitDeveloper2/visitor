import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import logger from '../../../utils/logger/customLogger';

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Load the service account key file
    const keyFilePath = path.join(process.cwd(), 'keyfiles/google-service-account.json');
    const keyFile = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: keyFile.client_email,
        private_key: keyFile.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Prepare the file metadata and media for upload
    const originalFileName = (file as File).name;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert Buffer to Readable Stream
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    const fileMetadata = {
      name: originalFileName,
    };

    const media = {
      mimeType: file.type,
      body: bufferStream,
    };

    // Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    const fileId = response.data.id;

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Generate the file's direct download URL
    const fileUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    logger.info("file uploaded successfully",{fileUrl:fileUrl})
    return NextResponse.json({ path: fileUrl });
  } catch (error) {
    logger.error('Upload error:', {error:error});
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
};

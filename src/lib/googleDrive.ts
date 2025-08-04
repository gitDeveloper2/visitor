import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Initialize Google Drive API client
const drive = google.drive('v3');

export async function uploadFileToDrive(filePath: string, mimeType: string, accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const response = await drive.files.create({
    auth,
    requestBody: {
      name: path.basename(filePath), // Extract the file name
      mimeType,
    },
    media: {
      mimeType,
      body: fs.createReadStream(filePath),
    },
  });

  return response.data;
}

// app/api/gsc/fetch.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// const auth = new google.auth.GoogleAuth({
//   keyFile: CREDENTIALS_PATH,
//   scopes: SCOPES,
// });
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GSC_EMAIL as string, 
    private_key: process.env.GSC_KEY as string,
  },
  scopes: SCOPES,
});

const webmasters = google.webmasters({ version: 'v3', auth });

function calculateDateRange(days: string | null) {
  const endDate = new Date();
  const startDate = new Date();
  const daysCount = days ? parseInt(days, 10) : 90;
  startDate.setDate(endDate.getDate() - daysCount);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteUrl = 'https://basicutils.com';
  const days = searchParams.get('days');

  const { startDate, endDate } = calculateDateRange(days);

  try {
    const data = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page', 'query'],
        rowLimit: 1000,
      },
    });

    const gscData = data.data.rows?.map(row => ({
      url: row.keys[0],
      query: row.keys[1],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.clicks / (row.impressions || 1),
      avgPosition: row.position || 0,
    }));

    return NextResponse.json({ success: true, data: gscData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error });
  }
}

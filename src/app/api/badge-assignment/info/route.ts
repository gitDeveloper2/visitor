import { NextRequest, NextResponse } from 'next/server';
import { getBadgeAssignmentInfo } from '@/utils/badgeAssignmentService';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');
    
    if (!appId) {
      return NextResponse.json(
        { success: false, error: 'App ID is required' },
        { status: 400 }
      );
    }
    
    const data = await getBadgeAssignmentInfo(appId);
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Failed to get badge assignment info' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
      appId
    });
  } catch (error) {
    console.error('Error getting badge assignment info:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get badge assignment info',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { assignBadgeTextToApp } from '@/utils/badgeAssignmentService';

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
    
    const badgeText = await assignBadgeTextToApp(appId);
    
    return NextResponse.json({
      success: true,
      badgeText,
      appId
    });
  } catch (error) {
    console.error('Error getting badge text:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get badge text',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
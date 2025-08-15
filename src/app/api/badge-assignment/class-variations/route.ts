import { NextRequest, NextResponse } from 'next/server';
import { getBadgeClassVariations } from '@/utils/badgeAssignmentService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');
    const count = parseInt(searchParams.get('count') || '3');
    
    if (!appId) {
      return NextResponse.json(
        { success: false, error: 'App ID is required' },
        { status: 400 }
      );
    }
    
    const classVariations = await getBadgeClassVariations(appId, count);
    
    return NextResponse.json({
      success: true,
      classVariations,
      appId,
      count
    });
  } catch (error) {
    console.error('Error getting badge class variations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get badge class variations',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
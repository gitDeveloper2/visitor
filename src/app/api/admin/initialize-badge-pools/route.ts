import { NextRequest, NextResponse } from 'next/server';
import { initializeBadgePools } from '@/utils/badgeDatabaseService';

export async function POST(request: NextRequest) {
  try {
    await initializeBadgePools();
    
    return NextResponse.json({
      success: true,
      message: 'Badge pools initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing badge pools:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize badge pools',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if pools are initialized
    const { getAllBadgeTextsFromDB, getAllBadgeClassesFromDB } = await import('@/utils/badgeDatabaseService');
    
    const texts = await getAllBadgeTextsFromDB();
    const classes = await getAllBadgeClassesFromDB();
    
    return NextResponse.json({
      success: true,
      data: {
        textsCount: texts.length,
        classesCount: classes.length,
        isInitialized: texts.length > 0 && classes.length > 0,
        lastCheck: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error checking badge pools status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

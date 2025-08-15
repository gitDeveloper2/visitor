import { NextRequest, NextResponse } from 'next/server';
import { 
  initializeBadgePools,
  getAllBadgeTextsFromDB,
  getAllBadgeClassesFromDB,
  assignBadgeTextToApp,
  assignBadgeClassToApp
} from '@/utils/badgeDatabaseService';

export async function GET(request: NextRequest) {
  try {
    // Initialize badge pools if they don't exist
    await initializeBadgePools();
    
    // Get all badge texts and classes from database
    const texts = await getAllBadgeTextsFromDB();
    const classes = await getAllBadgeClassesFromDB();
    
    // Test badge assignment for a sample app
    const testAppId = 'test-app-123';
    const assignedText = await assignBadgeTextToApp(testAppId);
    const assignedClass = await assignBadgeClassToApp(testAppId);
    
    return NextResponse.json({
      success: true,
      message: 'Database-based badge system is working',
      data: {
        totalTexts: texts.length,
        totalClasses: classes.length,
        sampleTexts: texts.slice(0, 5).map(t => t.text),
        sampleClasses: classes.slice(0, 5).map(c => c.className),
        testAssignment: {
          appId: testAppId,
          assignedText,
          assignedClass
        }
      }
    });
  } catch (error) {
    console.error('Error testing badge system:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test badge system',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
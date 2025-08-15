import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { 
  regenerateBadgesForApp, 
  regenerateBadgesForMultipleApps, 
  regenerateAllVerificationBadges,
  getBadgeInfoForApp,
  validateBadgeConsistency
} from '@/utils/badgeRegenerationService';
import { connectToDatabase } from '@/lib/mongodb';

// GET: Get badge information for an app
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');
    const action = searchParams.get('action');

    if (!appId) {
      return NextResponse.json({ 
        message: 'App ID is required' 
      }, { status: 400 });
    }

    if (action === 'info') {
      // Get badge information for an app
      const badgeInfo = await getBadgeInfoForApp(appId);
      return NextResponse.json(badgeInfo);
    } else if (action === 'validate') {
      // Validate badge consistency
      const validation = await validateBadgeConsistency(appId);
      return NextResponse.json(validation);
    } else {
      return NextResponse.json({ 
        message: 'Invalid action. Use "info" or "validate"' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in badge regeneration GET:', error);
    return NextResponse.json(
      { message: 'Failed to get badge information' },
      { status: 500 }
    );
  }
}

// POST: Regenerate badges
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, appIds, regenerateAll } = body;

    if (action === 'regenerate-single' && body.appId) {
      // Regenerate badges for a single app
      const result = await regenerateBadgesForApp(body.appId);
      return NextResponse.json(result);
    }

    if (action === 'regenerate-multiple' && appIds && Array.isArray(appIds)) {
      // Regenerate badges for multiple apps
      const result = await regenerateBadgesForMultipleApps(appIds);
      return NextResponse.json({
        success: true,
        message: `Regenerated badges for ${appIds.length} apps`,
        results: result
      });
    }

    if (action === 'regenerate-all' || regenerateAll) {
      // Regenerate badges for all apps
      const result = await regenerateAllVerificationBadges();
      return NextResponse.json(result);
    }

    return NextResponse.json({ 
      message: 'Invalid action or missing parameters' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error in badge regeneration POST:', error);
    return NextResponse.json(
      { message: 'Failed to regenerate badges' },
      { status: 500 }
    );
  }
}

// PUT: Update badge assignments for an app
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { appId, customBadgeText, customBadgeClass } = body;

    if (!appId) {
      return NextResponse.json({ 
        message: 'App ID is required' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Get the app
    const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
    if (!app) {
      return NextResponse.json({ 
        message: 'App not found' 
      }, { status: 404 });
    }

    // Update custom badge assignments if provided
    const updateData: any = {};
    
    if (customBadgeText) {
      updateData.customBadgeText = customBadgeText;
    }
    
    if (customBadgeClass) {
      updateData.customBadgeClass = customBadgeClass;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ 
        message: 'No updates provided' 
      }, { status: 400 });
    }

    updateData.updatedAt = new Date();

    const updateResult = await db.collection('userapps').updateOne(
      { _id: new ObjectId(appId) },
      { $set: updateData }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ 
        message: 'Failed to update app' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Badge assignments updated successfully',
      appId,
      updates: updateData
    });

  } catch (error) {
    console.error('Error updating badge assignments:', error);
    return NextResponse.json(
      { message: 'Failed to update badge assignments' },
      { status: 500 }
    );
  }
}

// DELETE: Reset badge assignments to deterministic defaults
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ 
        message: 'App ID is required' 
      }, { status: 400 });
    }

    // Regenerate badges to reset to deterministic defaults
    const result = await regenerateBadgesForApp(appId);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Badge assignments reset to defaults successfully',
        appId,
        result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to reset badge assignments',
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error resetting badge assignments:', error);
    return NextResponse.json(
      { message: 'Failed to reset badge assignments' },
      { status: 500 }
    );
  }
}

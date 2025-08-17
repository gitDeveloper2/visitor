import { NextRequest, NextResponse } from 'next/server';
import { assignBadgeClassToApp } from '@/utils/badgeAssignmentService';

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

    const badgeClass = await assignBadgeClassToApp(appId);

    return NextResponse.json({
      success: true,
      badgeClass
    });
  } catch (error) {
    console.error('Error assigning badge class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign badge class' },
      { status: 500 }
    );
  }
} 
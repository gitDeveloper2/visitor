import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { 
  getTotalBadgeTexts,
  isValidBadgeText,
  getAllBadgeTexts,
  expandBadgeTextPool,
  removeBadgeText,
  updateBadgeText,
  resetToDefaults,
  exportBadgePools,
  importBadgePools
} from '@/utils/badgeAssignmentService';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'getTotalTexts':
        const totalTexts = await getTotalBadgeTexts();
        return NextResponse.json({ success: true, totalTexts });

      case 'getAllTexts':
        const texts = await getAllBadgeTexts();
        return NextResponse.json({ success: true, texts });

      case 'exportPools':
        const exportData = await exportBadgePools();
        return NextResponse.json({ success: true, data: exportData });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in badge management GET:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'addText':
        if (!data.text || !isValidBadgeText(data.text)) {
          return NextResponse.json({ success: false, error: 'Invalid badge text' }, { status: 400 });
        }
        await expandBadgeTextPool([data.text]);
        return NextResponse.json({ success: true, message: 'Badge text added successfully' });

      case 'removeText':
        if (!data.text) {
          return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
        }
        await removeBadgeText(data.text);
        return NextResponse.json({ success: true, message: 'Badge text removed successfully' });

      case 'updateText':
        if (!data.oldText || !data.newText || !isValidBadgeText(data.newText)) {
          return NextResponse.json({ success: false, error: 'Invalid text data' }, { status: 400 });
        }
        await updateBadgeText(data.oldText, data.newText);
        return NextResponse.json({ success: true, message: 'Badge text updated successfully' });

      case 'expandPool':
        if (!data.texts || !Array.isArray(data.texts) || data.texts.length === 0) {
          return NextResponse.json({ success: false, error: 'texts array is required' }, { status: 400 });
        }
        await expandBadgeTextPool(data.texts);
        return NextResponse.json({ success: true, message: 'Badge pool expanded successfully' });

      case 'resetToDefaults':
        await resetToDefaults();
        return NextResponse.json({ success: true, message: 'Badge pools reset to defaults' });

      case 'importPools':
        if (!data || !data.badgeTexts || !data.badgeClasses) {
          return NextResponse.json({ success: false, error: 'Invalid import data' }, { status: 400 });
        }
        await importBadgePools(data);
        return NextResponse.json({ success: true, message: 'Badge pools imported successfully' });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in badge management POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

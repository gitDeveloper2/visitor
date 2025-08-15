import { NextRequest, NextResponse } from 'next/server';
import {
  getAllBadgeTextsFromDB,
  getAllBadgeClassesFromDB,
  addBadgeTextsToDB,
  addBadgeClassesToDB,
  removeBadgeTextFromDB,
  removeBadgeClassFromDB,
  updateBadgeTextInDB,
  updateBadgeClassInDB,
  resetBadgePoolsToDefaults,
  exportBadgePoolsFromDB,
  importBadgePoolsToDB,
  toggleBadgeTextActive,
  toggleBadgeClassActive
} from '@/utils/badgeDatabaseService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'texts':
        const texts = await getAllBadgeTextsFromDB();
        return NextResponse.json({
          success: true,
          data: texts,
          message: 'Badge texts retrieved successfully'
        });

      case 'classes':
        const classes = await getAllBadgeClassesFromDB();
        return NextResponse.json({
          success: true,
          data: classes,
          message: 'Badge classes retrieved successfully'
        });

      case 'export':
        const exportDataExport = await exportBadgePoolsFromDB();
        return NextResponse.json({
          success: true,
          data: exportDataExport,
          message: 'Badge pools exported successfully'
        });

      default:
        const [allTexts, allClasses, exportDataDefault] = await Promise.all([
          getAllBadgeTextsFromDB(),
          getAllBadgeClassesFromDB(),
          exportBadgePoolsFromDB()
        ]);
        
        return NextResponse.json({
          success: true,
          data: {
            texts: allTexts,
            classes: allClasses,
            export: exportDataDefault
          },
          message: 'All badge data retrieved successfully'
        });
    }

  } catch (error) {
    console.error('Error retrieving badge data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'add-texts':
        if (!data.texts || !Array.isArray(data.texts)) {
          return NextResponse.json(
            { success: false, error: 'Invalid data: texts array required' },
            { status: 400 }
          );
        }

        const textResults = await addBadgeTextsToDB(data.texts);
        const allTexts = await getAllBadgeTextsFromDB();

        return NextResponse.json({
          success: true,
          message: `Added ${textResults.added.length} new badge texts`,
          added: textResults.added,
          errors: textResults.errors,
          total: allTexts.length
        });

      case 'add-classes':
        if (!data.classes || !Array.isArray(data.classes)) {
          return NextResponse.json(
            { success: false, error: 'Invalid data: classes array required' },
            { status: 400 }
          );
        }

        const classResults = await addBadgeClassesToDB(data.classes);
        const allClasses = await getAllBadgeClassesFromDB();

        return NextResponse.json({
          success: true,
          message: `Added ${classResults.added.length} new CSS classes`,
          added: classResults.added,
          errors: classResults.errors,
          total: allClasses.length
        });

      case 'import':
        if (!data.badgeTexts || !data.badgeClasses) {
          return NextResponse.json(
            { success: false, error: 'Invalid data: badgeTexts and badgeClasses required' },
            { status: 400 }
          );
        }

        const importResult = await importBadgePoolsToDB(data);

        return NextResponse.json({
          success: true,
          message: 'Badge pools imported successfully',
          data: importResult
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error adding badge data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'update-text':
        if (!data.oldText || !data.newText) {
          return NextResponse.json(
            { success: false, error: 'Invalid data: oldText and newText required' },
            { status: 400 }
          );
        }

        const textUpdated = await updateBadgeTextInDB(data.oldText, data.newText);
        if (!textUpdated) {
          return NextResponse.json(
            { success: false, error: 'Badge text not found or update failed' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Badge text updated successfully',
          oldText: data.oldText,
          newText: data.newText
        });

      case 'update-class':
        if (!data.oldClass || !data.newClass) {
          return NextResponse.json(
            { success: false, error: 'Invalid data: oldClass and newClass required' },
            { status: 400 }
          );
        }

        const classUpdated = await updateBadgeClassInDB(data.oldClass, data.newClass);
        if (!classUpdated) {
          return NextResponse.json(
            { success: false, error: 'CSS class not found or update failed' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'CSS class updated successfully',
          oldClass: data.oldClass,
          newClass: data.newClass
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error updating badge data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'remove-text':
        if (!data.text) {
          return NextResponse.json(
            { success: false, error: 'Invalid data: text required' },
            { status: 400 }
          );
        }

        const textRemoved = await removeBadgeTextFromDB(data.text);
        if (!textRemoved) {
          return NextResponse.json(
            { success: false, error: 'Badge text not found' },
            { status: 404 }
          );
        }

        const remainingTexts = await getAllBadgeTextsFromDB();
        return NextResponse.json({
          success: true,
          message: 'Badge text removed successfully',
          removedText: data.text,
          total: remainingTexts.length
        });

      case 'remove-class':
        if (!data.className) {
          return NextResponse.json(
            { success: false, error: 'Invalid data: className required' },
            { status: 400 }
          );
        }

        const classRemoved = await removeBadgeClassFromDB(data.className);
        if (!classRemoved) {
          return NextResponse.json(
            { success: false, error: 'CSS class not found' },
            { status: 404 }
          );
        }

        const remainingClasses = await getAllBadgeClassesFromDB();
        return NextResponse.json({
          success: true,
          message: 'CSS class removed successfully',
          removedClass: data.className,
          total: remainingClasses.length
        });

      case 'reset':
        const resetSuccess = await resetBadgePoolsToDefaults();
        if (!resetSuccess) {
          return NextResponse.json(
            { success: false, error: 'Failed to reset badge pools' },
            { status: 500 }
          );
        }
        
        const resetData = await exportBadgePoolsFromDB();
        return NextResponse.json({
          success: true,
          message: 'Badge pools reset to defaults successfully',
          data: resetData
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error removing badge data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

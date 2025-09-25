import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import logger from '../../../utils/logger/customLogger';

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    logger.info(`🔄 Attempting to revalidate path: ${path}`);

    try {
      await revalidatePath(path); // await is important
      logger.info(`✅ revalidatePath(${path}) called successfully`);
    } catch (revalidateError) {
      logger.error(`❌ revalidatePath failed`, revalidateError);
      throw revalidateError;
    }

    return NextResponse.json(
      {
        message: `Path ${path} revalidated successfully`,
        timestamp: new Date().toISOString(),
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error revalidating path', error);
    return NextResponse.json(
      {
        message: 'Error revalidating path',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

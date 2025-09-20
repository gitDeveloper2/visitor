import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import logger from '../../../utils/logger/customLogger';

export async function POST(req: Request) {
  try {
    const { path } = await req.json(); // Parse the JSON body to get the path
  
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Trigger revalidation for the provided path
    console.log(`🔄 Attempting to revalidate path: ${path}`);
    
    try {
      revalidatePath(path);
      console.log(`✅ revalidatePath(${path}) called successfully`);
      
      // Also try revalidating with 'page' type explicitly
      revalidatePath(path, 'page');
      console.log(`✅ revalidatePath(${path}, 'page') called successfully`);
      
    } catch (revalidateError) {
      console.error(`❌ revalidatePath failed:`, revalidateError);
      throw revalidateError;
    }
    
    logger.info(`Path ${path} revalidated successfully`);
    return NextResponse.json({ 
      message: `Path ${path} revalidated successfully`,
      timestamp: new Date().toISOString(),
      success: true
    }, { status: 200 });
  } catch (error) {
    logger.error('Error:', {error:error});
    return NextResponse.json({ message: 'Error revalidating path', error: error}, { status: 500 });
  }
}

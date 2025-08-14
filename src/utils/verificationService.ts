import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

interface VerificationScore {
  total: number;        // Max 100 points
  linkScore: number;    // 0-40 points
  textScore: number;    // 0-30 points  
  dofollowScore: number; // 0-20 points
  accessibilityScore: number; // 0-10 points
  status: 'pending' | 'verified' | 'needs_review' | 'failed';
  details: {
    hasLink: boolean;
    hasCorrectUrl: boolean;
    hasCorrectText: boolean;
    isDofollow: boolean;
    isAccessible: boolean;
    linkCount: number;
    textMatches: string[];
    errors: string[];
  };
}

interface VerificationResult {
  success: boolean;
  found: boolean;
  score: VerificationScore;
  error?: string;
  method: 'static' | 'rendered' | 'admin_review';
  attempt: number;
}

interface VerificationAttempt {
  attempt: number;
  method: 'static' | 'rendered' | 'admin_review';
  score: VerificationScore;
  timestamp: Date;
  details: string;
}

export async function verifyAppBadge(appId: string): Promise<VerificationResult> {
  try {
    const { db } = await connectToDatabase();
    
    // Get app details
    const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
    if (!app) {
      return { 
        success: false, 
        found: false, 
        score: createEmptyScore(),
        error: 'App not found',
        method: 'static',
        attempt: 1
      };
    }

    if (!app.verificationUrl) {
      return { 
        success: false, 
        found: false, 
        score: createEmptyScore(),
        error: 'No verification URL provided',
        method: 'static',
        attempt: 1
      };
    }

    const appUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/launch/${app.slug}`;
    
    // Progressive verification attempts
    const result = await progressiveVerification(app.verificationUrl, appUrl, app.name, appId);
    
    // Update verification status in database
    await updateVerificationStatus(db, appId, result);
    
    return result;
    
  } catch (error) {
    console.error('Verification error:', error);
    return { 
      success: false, 
      found: false, 
      score: createEmptyScore(),
      error: error instanceof Error ? error.message : 'Unknown error',
      method: 'static',
      attempt: 1
    };
  }
}

function createEmptyScore(): VerificationScore {
  return {
    total: 0,
    linkScore: 0,
    textScore: 0,
    dofollowScore: 0,
    accessibilityScore: 0,
    status: 'failed',
    details: {
      hasLink: false,
      hasCorrectUrl: false,
      hasCorrectText: false,
      isDofollow: false,
      isAccessible: false,
      linkCount: 0,
      textMatches: [],
      errors: []
    }
  };
}

async function progressiveVerification(
  verificationUrl: string, 
  expectedAppUrl: string, 
  appName: string,
  appId: string
): Promise<VerificationResult> {
  
  // Get previous attempts
  const { db } = await connectToDatabase();
  const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
  
  // Handle legacy data: verificationAttempts might be a number instead of array
  let attempts = [];
  if (app?.verificationAttempts) {
    if (Array.isArray(app.verificationAttempts)) {
      attempts = app.verificationAttempts;
    } else if (typeof app.verificationAttempts === 'number') {
      // Legacy format: convert number to empty array
      attempts = [];
      console.log(`🔄 Converting legacy verificationAttempts from number (${app.verificationAttempts}) to array for app ${appId}`);
    }
  }
  
  const currentAttempt = attempts.length + 1;

  console.log(`🔄 Attempt ${currentAttempt} for app ${appId}`);

  // Attempt 1: Static HTML (fast)
  if (currentAttempt === 1) {
    console.log('📄 Attempting static HTML verification...');
    const result = await verifyStaticHtml(verificationUrl, expectedAppUrl, appName);
    result.attempt = currentAttempt;
    result.method = 'static';
    return result;
  }

  // Attempt 2: Rendered HTML (slower, for SPAs)
  if (currentAttempt === 2) {
    console.log('🌐 Attempting rendered HTML verification...');
    const result = await verifyRenderedHtml(verificationUrl, expectedAppUrl, appName);
    result.attempt = currentAttempt;
    result.method = 'rendered';
    return result;
  }

  // Attempt 3+: Admin review (manual)
  console.log('👨‍💼 Flagging for admin review...');
  return {
    success: true,
    found: false,
    score: createEmptyScore(),
    method: 'admin_review',
    attempt: currentAttempt
  };
}

async function verifyStaticHtml(
  url: string, 
  expectedAppUrl: string, 
  appName: string
): Promise<VerificationResult> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BasicUtils-Verification-Bot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 15000, // 15 second timeout
    });

    if (!response.ok) {
      return { 
        success: false, 
        found: false, 
        score: createEmptyScore(),
        error: `HTTP ${response.status}: ${response.statusText}`,
        method: 'static',
        attempt: 1
      };
    }

    const html = await response.text();
    const score = calculateVerificationScore(html, expectedAppUrl, appName);
    
    return {
      success: true,
      found: score.status === 'verified',
      score,
      method: 'static',
      attempt: 1
    };
    
  } catch (error) {
    return { 
      success: false, 
      found: false, 
      score: createEmptyScore(),
      error: error instanceof Error ? error.message : 'Network error',
      method: 'static',
      attempt: 1
    };
  }
}

async function verifyRenderedHtml(
  url: string, 
  expectedAppUrl: string, 
  appName: string
): Promise<VerificationResult> {
  try {
    // For now, we'll use a headless browser approach
    // In production, you might want to use services like Browserless or Puppeteer
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      timeout: 20000, // 20 second timeout for rendered content
    });

    if (!response.ok) {
      return { 
        success: false, 
        found: false, 
        score: createEmptyScore(),
        error: `HTTP ${response.status}: ${response.statusText}`,
        method: 'rendered',
        attempt: 2
      };
    }

    const html = await response.text();
    const score = calculateVerificationScore(html, expectedAppUrl, appName);
    
    return {
      success: true,
      found: score.status === 'verified',
      score,
      method: 'rendered',
      attempt: 2
    };
    
  } catch (error) {
    return { 
      success: false, 
      found: false, 
      score: createEmptyScore(),
      error: error instanceof Error ? error.message : 'Rendered content error',
      method: 'rendered',
      attempt: 2
    };
  }
}

function calculateVerificationScore(html: string, expectedAppUrl: string, appName: string): VerificationScore {
  const details = {
    hasLink: false,
    hasCorrectUrl: false,
    isDofollow: false,
    isAccessible: false,
    linkCount: 0,
    textMatches: [],
    errors: []
  };

  try {
    // Enhanced link extraction with better regex patterns
    const linkRegex = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>/gi;
    const links: string[] = [];
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      links.push(match[1]);
    }

    details.linkCount = links.length;
    details.hasLink = links.length > 0;

    // Check if any link points to our app (with flexible matching)
    const hasCorrectUrl = links.some(link => {
      try {
        const url = new URL(link, 'http://example.com');
        const expectedUrl = new URL(expectedAppUrl);
        
        // Check hostname and pathname match
        const hostMatch = url.hostname === expectedUrl.hostname;
        const pathMatch = url.pathname === expectedUrl.pathname;
        
        // Also check for partial matches (e.g., subdomains, query params)
        const partialHostMatch = url.hostname.includes(expectedUrl.hostname) || 
                                expectedUrl.hostname.includes(url.hostname);
        
        return (hostMatch && pathMatch) || partialHostMatch;
      } catch {
        return false;
      }
    });

    details.hasCorrectUrl = hasCorrectUrl;

    // Enhanced text verification with multiple patterns
    const verificationTexts = [
      'BasicUtils',
      'Verified App',
      'Verified on BasicUtils',
      'View on BasicUtils',
      appName,
      'basicutils.com',
      'basicutils'
    ];

    const foundTexts = verificationTexts.filter(text => 
      html.toLowerCase().includes(text.toLowerCase())
    );

    details.textMatches = foundTexts;
    const hasCorrectText = foundTexts.length > 0;

    // Check if it's a dofollow link (no rel="nofollow")
    let isDofollow = false;
    if (hasCorrectUrl) {
      const dofollowRegex = new RegExp(
        `<a[^>]+href\\s*=\\s*["']${expectedAppUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`,
        'i'
      );
      
      const linkMatch = html.match(dofollowRegex);
      if (linkMatch) {
        const relMatch = linkMatch[0].match(/rel\s*=\s*["']([^"']+)["']/i);
        isDofollow = !relMatch || !relMatch[1].toLowerCase().includes('nofollow');
      }
    }

    details.isDofollow = isDofollow;
    details.isAccessible = hasCorrectUrl && hasCorrectText;

    // Calculate scores
    const linkScore = hasCorrectUrl ? 40 : 0;
    const textScore = hasCorrectText ? Math.min(30, foundTexts.length * 10) : 0;
    const dofollowScore = isDofollow ? 20 : 0;
    const accessibilityScore = details.isAccessible ? 10 : 0;

    const total = linkScore + textScore + dofollowScore + accessibilityScore;

    // Determine status based on score
    let status: VerificationScore['status'];
    if (total >= 90) {
      status = 'verified';
    } else if (total >= 70) {
      status = 'verified';
    } else if (total >= 50) {
      status = 'needs_review';
    } else {
      status = 'failed';
    }

    return {
      total,
      linkScore,
      textScore,
      dofollowScore,
      accessibilityScore,
      status,
      details
    };

  } catch (error) {
    details.errors.push(error instanceof Error ? error.message : 'Error parsing HTML');
    return {
      total: 0,
      linkScore: 0,
      textScore: 0,
      dofollowScore: 0,
      accessibilityScore: 0,
      status: 'failed',
      details
    };
  }
}

async function updateVerificationStatus(db: any, appId: string, result: VerificationResult) {
  const updateData: any = {
    verificationCheckedAt: new Date(),
    updatedAt: new Date(),
    lastVerificationMethod: result.method,
    lastVerificationAttempt: result.attempt,
  };

  // Add verification attempt to history
  const attempt: VerificationAttempt = {
    attempt: result.attempt,
    method: result.method,
    score: result.score,
    timestamp: new Date(),
    details: result.error || `Verification completed with score: ${result.score.total}`
  };

  if (result.success) {
    if (result.score.status === 'verified') {
      updateData.verificationStatus = 'verified';
      updateData.isVerified = true;
      updateData.verificationScore = result.score.total;
      updateData.badges = ['Verified'];
    } else if (result.score.status === 'needs_review') {
      updateData.verificationStatus = 'needs_review';
      updateData.isVerified = false;
      updateData.verificationScore = result.score.total;
    } else {
      updateData.verificationStatus = 'failed';
      updateData.isVerified = false;
      updateData.verificationScore = result.score.total;
    }
  } else {
    updateData.verificationStatus = 'failed';
    updateData.isVerified = false;
    updateData.verificationScore = 0;
  }

  // Handle legacy data: if verificationAttempts is a number, convert it to array first
  const existingApp = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
  let updateOperation: any;
  
  if (existingApp?.verificationAttempts && typeof existingApp.verificationAttempts === 'number') {
    // Legacy format: replace the number with an array containing the new attempt
    updateOperation = {
      $set: {
        ...updateData,
        verificationAttempts: [attempt] // Replace number with array
      }
    };
    console.log(`🔄 Converting legacy verificationAttempts from number to array for app ${appId}`);
  } else {
    // Normal format: push to existing array
    updateOperation = {
      $set: updateData,
      $push: { verificationAttempts: attempt }
    };
  }

  // Update verification attempts array
  await db.collection('userapps').updateOne(
    { _id: new ObjectId(appId) },
    updateOperation
  );
}

// Batch verification for multiple apps with intelligent scheduling
export async function verifyPendingApps() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all pending verification apps with priority scoring
    const pendingApps = await db.collection('userapps').find({
      $or: [
        { verificationStatus: 'pending' },
        { verificationStatus: 'needs_review' },
        { verificationStatus: 'failed' }
      ],
      requiresVerification: true
    }).sort({ 
      verificationScore: -1,  // Higher scores first
      verificationAttempts: 1, // Fewer attempts first
      verificationSubmittedAt: 1 // Older submissions first
    }).toArray();

    console.log(`Found ${pendingApps.length} apps for verification`);

    const results = [];
    for (const app of pendingApps) {
      try {
        console.log(`Verifying app: ${app.name} (Score: ${app.verificationScore || 0})`);
        
        const result = await verifyAppBadge(app._id.toString());
        results.push({
          appId: app._id,
          appName: app.name,
          ...result
        });
        
        // Handle legacy data: verificationAttempts might be a number
        const attemptsCount = Array.isArray(app.verificationAttempts) 
          ? app.verificationAttempts.length 
          : (typeof app.verificationAttempts === 'number' ? app.verificationAttempts : 0);
        
        // Adaptive delay based on app priority and attempts
        const delay = calculateOptimalDelay(app.verificationScore || 0, attemptsCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        
      } catch (error) {
        console.error(`Error verifying app ${app._id}:`, error);
        results.push({
          appId: app._id,
          appName: app.name,
          success: false,
          found: false,
          score: createEmptyScore(),
          error: error instanceof Error ? error.message : 'Unknown error',
          method: 'static',
          attempt: 1
        });
      }
    }

    return results;
    
  } catch (error) {
    console.error('Batch verification error:', error);
    throw error;
  }
}

function calculateOptimalDelay(score: number, attempts: number): number {
  // Base delay: 2 seconds
  let delay = 2000;
  
  // Reduce delay for high-priority apps (high scores)
  if (score >= 70) {
    delay = Math.max(1000, delay - 1000);
  }
  
  // Increase delay for apps with many attempts (to avoid overwhelming)
  if (attempts >= 3) {
    delay = Math.min(5000, delay + 1000);
  }
  
  return delay;
}

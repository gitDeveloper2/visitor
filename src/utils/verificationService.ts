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
    seoScore: number;
    antiTrackingScore: number;
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

    const appSiteUrl = (app.externalUrl || app.website || '').trim();
    const appUrl = appSiteUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/launch/${app.slug}`;
    
    // Enhanced URL validation - ensure verification URL is a child of app URL
    const urlValidationResult = validateVerificationUrl(app.verificationUrl, appUrl);
    if (!urlValidationResult.isValid) {
      return {
        success: false,
        found: false,
        score: createEmptyScore(),
        error: urlValidationResult.error,
        method: 'static',
        attempt: 1
      };
    }
    
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

// Enhanced URL validation function
function isPrivateHost(host: string): boolean {
  return (
    host === 'localhost' ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
    host.endsWith('.local')
  );
}

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '');
}

function validateVerificationUrl(verificationUrl: string, appUrl: string): { isValid: boolean; error?: string } {
  try {
    const verificationUrlObj = new URL(verificationUrl);
    const appUrlObj = new URL(appUrl);
    
    // Check 1: Hostname must match or be a subdomain
    const verificationHost = normalizeHost(verificationUrlObj.hostname);
    const appHost = normalizeHost(appUrlObj.hostname);
    
    if (
      verificationHost !== appHost &&
      !verificationHost.endsWith('.' + appHost) &&
      !appHost.endsWith('.' + verificationHost)
    ) {
      return {
        isValid: false,
        error: 'Verification URL must be on the same domain or subdomain as your app'
      };
    }
    
    // Check 2: Protocol must be HTTPS (security requirement)
    if (verificationUrlObj.protocol !== 'https:' && !isPrivateHost(verificationHost)) {
      return {
        isValid: false,
        error: 'Verification URL must use HTTPS for security'
      };
    }
    
    // Check 3: URL must not be a common spam/redirect domain
    const suspiciousDomains = [
      'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'v.gd', 'ow.ly',
      'buff.ly', 'adf.ly', 'sh.st', 'adfly.me', 'shorte.st', 'sh.st'
    ];
    
    if (suspiciousDomains.some(domain => verificationHost.includes(domain))) {
      return {
        isValid: false,
        error: 'URL shorteners and redirect services are not allowed for verification'
      };
    }
    
    // Check 4: URL must not be a file (must be a webpage)
    const fileExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi'];
    if (fileExtensions.some(ext => verificationUrlObj.pathname.toLowerCase().endsWith(ext))) {
      return {
        isValid: false,
        error: 'Verification URL must point to a webpage, not a file'
      };
    }
    
    // Check 5: URL must not be an API endpoint
    if (verificationUrlObj.pathname.includes('/api/') || verificationUrlObj.pathname.includes('/admin/')) {
      return {
        isValid: false,
        error: 'Verification URL cannot be an API endpoint or admin page'
      };
    }
    
    return { isValid: true };
    
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format'
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
      errors: [],
      seoScore: 0,
      antiTrackingScore: 0
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
    errors: [],
    seoScore: 0,
    antiTrackingScore: 0
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

    // Check if any link points to our app (with enhanced matching)
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

    // Enhanced text verification with multiple patterns and anti-tracking variations
    const verificationTexts = [
      // Standard verification texts
      'BasicUtils',
      'Verified App',
      'Verified on BasicUtils',
      'View on BasicUtils',
      appName,
      'basicutils.com',
      'basicutils',
      
      // Anti-tracking variations (different from standard to avoid crawler detection)
      'Verified by BasicUtils',
      'Featured on BasicUtils',
      'Available on BasicUtils',
      'Discover on BasicUtils',
      'Explore on BasicUtils',
      'Check out on BasicUtils',
      'Find on BasicUtils',
      'Browse on BasicUtils',
      'View details on BasicUtils',
      'Learn more on BasicUtils'
    ];

    const foundTexts = verificationTexts.filter(text => 
      html.toLowerCase().includes(text.toLowerCase())
    );

    details.textMatches = foundTexts;
    const hasCorrectText = foundTexts.length > 0;

    // Enhanced dofollow link checking with better regex
    let isDofollow = false;
    let dofollowLinkHtml = '';
    
    if (hasCorrectUrl) {
      // Find the specific link that matches our expected URL
      const matchingLinkRegex = new RegExp(
        `<a[^>]+href\\s*=\\s*["']${expectedAppUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>.*?</a>`,
        'is'
      );
      
      const linkMatch = html.match(matchingLinkRegex);
      if (linkMatch) {
        dofollowLinkHtml = linkMatch[0];
        const relMatch = linkMatch[0].match(/rel\s*=\s*["']([^"']+)["']/i);
        isDofollow = !relMatch || !relMatch[1].toLowerCase().includes('nofollow');
        
        // Additional SEO checks
        const hasTitle = /title\s*=\s*["']([^"']+)["']/i.test(linkMatch[0]);
        const hasAlt = /alt\s*=\s*["']([^'']+)["']/i.test(linkMatch[0]);
        const hasDescription = /aria-label\s*=\s*["']([^'']+)["']/i.test(linkMatch[0]);
        
        // Bonus points for accessibility and SEO
        if (hasTitle || hasAlt || hasDescription) {
          details.seoScore += 5;
        }
      }
    }

    details.isDofollow = isDofollow;
    details.isAccessible = hasCorrectUrl && hasCorrectText;

    // Anti-tracking score calculation
    // Check for variations in link structure and text to avoid crawler detection
    let antiTrackingScore = 0;
    
    if (hasCorrectUrl && hasCorrectText) {
      // Check if the link structure is different from standard patterns
      const linkVariations = [
        // Different link structures
        /<a[^>]+class\s*=\s*["'][^"']*verif[^"']*["'][^>]*>/i,
        /<a[^>]+id\s*=\s*["'][^"']*verif[^"']*["'][^>]*>/i,
        /<a[^>]+data-verif[^>]*>/i,
        
        // Different text patterns
        /verified\s+by/i,
        /featured\s+on/i,
        /available\s+on/i,
        /discover\s+on/i,
        /explore\s+on/i
      ];
      
      linkVariations.forEach(pattern => {
        if (pattern.test(html)) {
          antiTrackingScore += 2;
        }
      });
      
      // Check for custom styling (indicates manual implementation)
      const hasCustomStyling = /style\s*=\s*["'][^"']*verif[^"']*["']/i.test(html) ||
                              /class\s*=\s*["'][^"']*verif[^"']*["']/i.test(html);
      
      if (hasCustomStyling) {
        antiTrackingScore += 3;
      }
    }
    
    details.antiTrackingScore = Math.min(antiTrackingScore, 10);

    // Calculate enhanced scores
    const linkScore = hasCorrectUrl ? 35 : 0;
    const textScore = hasCorrectText ? Math.min(25, foundTexts.length * 8) : 0;
    const dofollowScore = isDofollow ? 20 : 0;
    const accessibilityScore = details.isAccessible ? 10 : 0;
    const seoBonus = details.seoScore;
    const antiTrackingBonus = details.antiTrackingScore;

    const total = linkScore + textScore + dofollowScore + accessibilityScore + seoBonus + antiTrackingBonus;

    // Enhanced status determination with better thresholds
    let status: VerificationScore['status'];
    if (total >= 95) {
      status = 'verified';
    } else if (total >= 80) {
      status = 'verified';
    } else if (total >= 65) {
      status = 'needs_review';
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
      details: {
        ...details,
        seoScore: seoBonus,
        antiTrackingScore: antiTrackingBonus
      }
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

import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateVerificationBadgeHtmlServer, generateAntiTrackingBadgesServer, generateSEOOptimizedBadgeServer } from '@/utils/badgeGenerationServer';
import { 
  assignBadgeTextToApp, 
  assignBadgeClassToApp, 
  getBadgeTextVariations, 
  getBadgeClassVariations 
} from '@/utils/badgeAssignmentService';

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

function validateVerificationUrl(verificationUrl: string, appSiteUrl: string): { isValid: boolean; error?: string } {
  try {
    const verificationUrlObj = new URL(verificationUrl);
    const appUrlObj = new URL(appSiteUrl);
    
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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const appId = params.id;
    if (!ObjectId.isValid(appId)) {
      return NextResponse.json({ message: 'Invalid app ID format' }, { status: 400 });
    }

    const { verificationUrl } = await request.json();
    
    if (!verificationUrl) {
      return NextResponse.json({ message: 'Verification URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(verificationUrl);
    } catch {
      return NextResponse.json({ message: 'Invalid URL format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Find the app and verify ownership
    const app = await db.collection('userapps').findOne({
      _id: new ObjectId(appId),
      authorId: session.user.id,
    });

    if (!app) {
      return NextResponse.json({ message: 'App not found or access denied' }, { status: 404 });
    }

    // Check if app requires verification (free apps only)
    if (app.pricing !== 'Free' && app.pricing !== 'free') {
      return NextResponse.json({ 
        message: 'Verification is only required for free apps' 
      }, { status: 400 });
    }

    // Check if already verified
    if (app.verificationStatus === 'verified') {
      return NextResponse.json({ 
        message: 'App is already verified' 
      }, { status: 400 });
    }

    // Enhanced URL validation
    const basicUtilsAppUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/launch/${app.slug}`;
    const appSiteUrl = (app.externalUrl || app.website || '').trim();
    if (!appSiteUrl) {
      return NextResponse.json({ 
        message: 'Your app does not have a website/externalUrl configured. Please add a website to your app first.' 
      }, { status: 400 });
    }
    const urlValidationResult = validateVerificationUrl(verificationUrl, appSiteUrl);
    
    if (!urlValidationResult.isValid) {
      return NextResponse.json({ 
        message: urlValidationResult.error || 'Invalid verification URL' 
      }, { status: 400 });
    }

    // Generate deterministic badge assignments for this app
    const assignedBadgeText = await assignBadgeTextToApp(appId);
    const assignedBadgeClass = await assignBadgeClassToApp(appId);
    const badgeTextVariations = await getBadgeTextVariations(appId, 3);
    const badgeClassVariations = await getBadgeClassVariations(appId, 3);

    // Generate multiple badge variations for anti-tracking with consistent text
    const defaultBadge = await generateVerificationBadgeHtmlServer(app.name, basicUtilsAppUrl, appId, 'default', 'light');
    const antiTrackingBadges = await generateAntiTrackingBadgesServer(app.name, basicUtilsAppUrl, appId, 3);
    const seoOptimizedBadge = await generateSEOOptimizedBadgeServer(app.name, basicUtilsAppUrl, appId);

    // Update app with verification request and badge assignments
    const updateResult = await db.collection('userapps').updateOne(
      { _id: new ObjectId(appId) },
      {
        $set: {
          verificationStatus: 'pending',
          verificationUrl: verificationUrl,
          verificationSubmittedAt: new Date(),
          verificationBadgeHtml: defaultBadge,
          verificationBadgeVariations: antiTrackingBadges,
          verificationSeoBadge: seoOptimizedBadge,
          
          // Store deterministic badge assignments for consistency
          verificationBadgeText: assignedBadgeText,
          verificationBadgeClass: assignedBadgeClass,
          verificationBadgeTextPool: badgeTextVariations,
          verificationBadgeClassPool: badgeClassVariations,
          
          requiresVerification: true,
          updatedAt: new Date(),
        },
        $inc: { verificationAttempts: 1 }
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: 'Failed to update app' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Verification request submitted successfully',
      verificationUrl: verificationUrl,
      badgeHtml: defaultBadge,
      badgeVariations: antiTrackingBadges,
      seoBadge: seoOptimizedBadge,
      status: 'pending'
    });

  } catch (error) {
    console.error('Error submitting verification:', error);
    return NextResponse.json(
      { message: 'Failed to submit verification request' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const appId = params.id;
    if (!ObjectId.isValid(appId)) {
      return NextResponse.json({ message: 'Invalid app ID format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get verification status
    const app = await db.collection('userapps').findOne(
      { _id: new ObjectId(appId), authorId: session.user.id },
      { 
        projection: { 
          verificationStatus: 1, 
          verificationUrl: 1, 
          verificationSubmittedAt: 1,
          verificationCheckedAt: 1,
          verificationAttempts: 1,
          verificationBadgeHtml: 1,
          requiresVerification: 1,
          name: 1,
          slug: 1,
          pricing: 1
        } 
      }
    );

    if (!app) {
      return NextResponse.json({ message: 'App not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      verificationStatus: app.verificationStatus || 'not_required',
      verificationUrl: app.verificationUrl,
      verificationSubmittedAt: app.verificationSubmittedAt,
      verificationCheckedAt: app.verificationCheckedAt,
      verificationAttempts: app.verificationAttempts || 0,
      verificationBadgeHtml: app.verificationBadgeHtml,
      requiresVerification: app.requiresVerification || false,
      appName: app.name,
      appSlug: app.slug,
      pricing: app.pricing
    });

  } catch (error) {
    console.error('Error getting verification status:', error);
    return NextResponse.json(
      { message: 'Failed to get verification status' },
      { status: 500 }
    );
  }
}

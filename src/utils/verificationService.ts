import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

interface VerificationResult {
  success: boolean;
  found: boolean;
  error?: string;
  details?: {
    hasLink: boolean;
    hasCorrectUrl: boolean;
    hasCorrectText: boolean;
    isDofollow: boolean;
  };
}

export async function verifyAppBadge(appId: string): Promise<VerificationResult> {
  try {
    const { db } = await connectToDatabase();
    
    // Get app details
    const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
    if (!app) {
      return { success: false, found: false, error: 'App not found' };
    }

    if (!app.verificationUrl) {
      return { success: false, found: false, error: 'No verification URL provided' };
    }

    const appUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/launch/${app.slug}`;
    
    // Fetch the verification page
    const response = await fetch(app.verificationUrl, {
      headers: {
        'User-Agent': 'BasicUtils-Verification-Bot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000, // 10 second timeout
    });

    if (!response.ok) {
      return { 
        success: false, 
        found: false, 
        error: `HTTP ${response.status}: ${response.statusText}` 
      };
    }

    const html = await response.text();
    
    // Check for verification badge
    const verificationResult = checkForVerificationBadge(html, appUrl, app.name);
    
    // Update verification status in database
    await updateVerificationStatus(db, appId, verificationResult);
    
    return verificationResult;
    
  } catch (error) {
    console.error('Verification error:', error);
    return { 
      success: false, 
      found: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

function checkForVerificationBadge(html: string, expectedAppUrl: string, appName: string): VerificationResult {
  try {
    // Create a DOM parser (we'll use a simple regex approach for now)
    // In production, you might want to use a proper HTML parser like jsdom
    
    const details = {
      hasLink: false,
      hasCorrectUrl: false,
      hasCorrectText: false,
      isDofollow: false,
    };

    // Check for link to our app
    const linkRegex = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>/gi;
    const links: string[] = [];
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      links.push(match[1]);
    }

    // Check if any link points to our app
    const hasCorrectUrl = links.some(link => {
      try {
        const url = new URL(link, 'http://example.com');
        const expectedUrl = new URL(expectedAppUrl);
        return url.hostname === expectedUrl.hostname && 
               url.pathname === expectedUrl.pathname;
      } catch {
        return false;
      }
    });

    details.hasCorrectUrl = hasCorrectUrl;

    // Check for verification text
    const verificationTexts = [
      'BasicUtils',
      'Verified App',
      appName,
      'View on BasicUtils'
    ];

    const hasCorrectText = verificationTexts.some(text => 
      html.toLowerCase().includes(text.toLowerCase())
    );

    details.hasCorrectText = hasCorrectText;

    // Check if it's a dofollow link (no rel="nofollow")
    const dofollowRegex = new RegExp(
      `<a[^>]+href\\s*=\\s*["']${expectedAppUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`,
      'i'
    );
    
    const linkMatch = html.match(dofollowRegex);
    if (linkMatch) {
      const relMatch = linkMatch[0].match(/rel\s*=\s*["']([^"']+)["']/i);
      const isDofollow = !relMatch || !relMatch[1].toLowerCase().includes('nofollow');
      details.isDofollow = isDofollow;
    }

    // Check for any link
    details.hasLink = links.length > 0;

    const found = hasCorrectUrl && hasCorrectText && details.isDofollow;

    return {
      success: true,
      found,
      details
    };

  } catch (error) {
    return {
      success: false,
      found: false,
      error: error instanceof Error ? error.message : 'Error parsing HTML'
    };
  }
}

async function updateVerificationStatus(db: any, appId: string, result: VerificationResult) {
  const updateData: any = {
    verificationCheckedAt: new Date(),
    updatedAt: new Date(),
  };

  if (result.success) {
    if (result.found) {
      updateData.verificationStatus = 'verified';
      updateData.isVerified = true;
      // Add verified badge
      updateData.badges = ['Verified'];
    } else {
      updateData.verificationStatus = 'failed';
      updateData.isVerified = false;
    }
  } else {
    updateData.verificationStatus = 'failed';
    updateData.isVerified = false;
  }

  await db.collection('userapps').updateOne(
    { _id: new ObjectId(appId) },
    { $set: updateData }
  );
}

// Batch verification for multiple apps
export async function verifyPendingApps() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all pending verification apps
    const pendingApps = await db.collection('userapps').find({
      verificationStatus: 'pending',
      requiresVerification: true
    }).toArray();

    console.log(`Found ${pendingApps.length} apps pending verification`);

    const results = [];
    for (const app of pendingApps) {
      try {
        const result = await verifyAppBadge(app._id.toString());
        results.push({
          appId: app._id,
          appName: app.name,
          ...result
        });
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Error verifying app ${app._id}:`, error);
        results.push({
          appId: app._id,
          appName: app.name,
          success: false,
          found: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
    
  } catch (error) {
    console.error('Batch verification error:', error);
    throw error;
  }
}

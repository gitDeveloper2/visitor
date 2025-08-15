import { connectToDatabase } from '@/lib/mongodb';
import { createHash } from 'crypto';

// Types for badge data
export interface IBadgeText {
  _id?: string;
  text: string;
  isActive: boolean;
  usageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBadgeClass {
  _id?: string;
  className: string;
  isActive: boolean;
  usageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Initialize default badge pools in database
export async function initializeBadgePools() {
  try {
    const { db } = await connectToDatabase();
    
    // Check if pools already exist
    const existingTexts = await db.collection('badgeTexts').countDocuments();
    const existingClasses = await db.collection('badgeClasses').countDocuments();
    
    if (existingTexts === 0) {
      // Initialize default badge texts
      const defaultTexts = [
        "Verified by BasicUtils",
        "Featured on BasicUtils", 
        "Endorsed by BasicUtils",
        "Powered by BasicUtils",
        "Trusted by BasicUtils",
        "Recommended by BasicUtils",
        "Approved by BasicUtils",
        "Certified by BasicUtils",
        "Validated by BasicUtils",
        "Authenticated by BasicUtils",
        "Secured by BasicUtils",
        "Protected by BasicUtils",
        "Monitored by BasicUtils",
        "Supervised by BasicUtils",
        "Oversee by BasicUtils",
        "Managed by BasicUtils",
        "Supported by BasicUtils",
        "Backed by BasicUtils",
        "Sponsored by BasicUtils",
        "Partnered with BasicUtils"
      ];
      
      const badgeTexts = defaultTexts.map(text => ({
        text,
        isActive: true,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      await db.collection('badgeTexts').insertMany(badgeTexts);
      console.log('Default badge texts initialized');
    }
    
    if (existingClasses === 0) {
      // Initialize default CSS classes
      const defaultClasses = [
        "verified-badge",
        "featured-badge",
        "endorsed-badge", 
        "powered-badge",
        "trusted-badge",
        "recommended-badge",
        "approved-badge",
        "certified-badge",
        "validated-badge",
        "authenticated-badge",
        "secured-badge",
        "protected-badge",
        "monitored-badge",
        "supervised-badge",
        "overseen-badge",
        "managed-badge",
        "supported-badge",
        "backed-badge",
        "sponsored-badge",
        "partnered-badge"
      ];
      
      const badgeClasses = defaultClasses.map(className => ({
        className,
        isActive: true,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      await db.collection('badgeClasses').insertMany(badgeClasses);
      console.log('Default CSS classes initialized');
    }
    
  } catch (error) {
    console.error('Error initializing badge pools:', error);
  }
}

// Get all badge texts from database
export async function getAllBadgeTextsFromDB(): Promise<IBadgeText[]> {
  try {
    const { db } = await connectToDatabase();
    const texts = await db.collection('badgeTexts')
      .find({ isActive: true })
      .sort({ text: 1 })
      .toArray();
    
    return texts.map(doc => ({
      _id: doc._id?.toString(),
      text: doc.text,
      isActive: doc.isActive,
      usageCount: doc.usageCount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching badge texts from DB:', error);
    return [];
  }
}

// Get all CSS classes from database
export async function getAllBadgeClassesFromDB(): Promise<IBadgeClass[]> {
  try {
    const { db } = await connectToDatabase();
    const classes = await db.collection('badgeClasses')
      .find({ isActive: true })
      .sort({ className: 1 })
      .toArray();
    
    return classes.map(doc => ({
      _id: doc._id?.toString(),
      className: doc.className,
      isActive: doc.isActive,
      usageCount: doc.usageCount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching CSS classes from DB:', error);
    return [];
  }
}

// Add new badge texts to database
export async function addBadgeTextsToDB(texts: string[]): Promise<{ success: boolean; added: string[]; errors: string[] }> {
  try {
    const { db } = await connectToDatabase();
    const results = { success: true, added: [] as string[], errors: [] as string[] };
    
    for (const text of texts) {
      try {
        const existing = await db.collection('badgeTexts').findOne({ text: text.trim() });
        if (!existing) {
          await db.collection('badgeTexts').insertOne({
            text: text.trim(),
            isActive: true,
            usageCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          results.added.push(text.trim());
        } else {
          results.errors.push(`"${text}" already exists`);
        }
      } catch (error) {
        results.errors.push(`Failed to add "${text}": ${error.message}`);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error adding badge texts to DB:', error);
    return { success: false, added: [], errors: [error.message] };
  }
}

// Add new CSS classes to database
export async function addBadgeClassesToDB(classes: string[]): Promise<{ success: boolean; added: string[]; errors: string[] }> {
  try {
    const { db } = await connectToDatabase();
    const results = { success: true, added: [] as string[], errors: [] as string[] };
    
    for (const className of classes) {
      try {
        const existing = await db.collection('badgeClasses').findOne({ className: className.trim() });
        if (!existing) {
          await db.collection('badgeClasses').insertOne({
            className: className.trim(),
            isActive: true,
            usageCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          results.added.push(className.trim());
        } else {
          results.errors.push(`"${className}" already exists`);
        }
      } catch (error) {
        results.errors.push(`Failed to add "${className}": ${error.message}`);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error adding CSS classes to DB:', error);
    return { success: false, added: [], errors: [error.message] };
  }
}

// Update badge text in database
export async function updateBadgeTextInDB(oldText: string, newText: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('badgeTexts').updateOne(
      { text: oldText },
      { 
        $set: { 
          text: newText.trim(),
          updatedAt: new Date()
        } 
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating badge text in DB:', error);
    return false;
  }
}

// Update CSS class in database
export async function updateBadgeClassInDB(oldClass: string, newClass: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('badgeClasses').updateOne(
      { className: oldClass },
      { 
        $set: { 
          className: newClass.trim(),
          updatedAt: new Date()
        } 
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating CSS class in DB:', error);
    return false;
  }
}

// Remove badge text from database
export async function removeBadgeTextFromDB(text: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('badgeTexts').deleteOne({ text });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error removing badge text from DB:', error);
    return false;
  }
}

// Remove CSS class from database
export async function removeBadgeClassFromDB(className: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('badgeClasses').deleteOne({ className });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error removing CSS class from DB:', error);
    return false;
  }
}

// Toggle badge text active status
export async function toggleBadgeTextActive(text: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const badge = await db.collection('badgeTexts').findOne({ text });
    if (badge) {
      await db.collection('badgeTexts').updateOne(
        { text },
        { 
          $set: { 
            isActive: !badge.isActive,
            updatedAt: new Date()
          } 
        }
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error toggling badge text active status:', error);
    return false;
  }
}

// Toggle CSS class active status
export async function toggleBadgeClassActive(className: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const badge = await db.collection('badgeClasses').findOne({ className });
    if (badge) {
      await db.collection('badgeClasses').updateOne(
        { className },
        { 
          $set: { 
            isActive: !badge.isActive,
            updatedAt: new Date()
          } 
        }
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error toggling CSS class active status:', error);
    return false;
  }
}

// Reset badge pools to defaults
export async function resetBadgePoolsToDefaults(): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing pools
    await db.collection('badgeTexts').deleteMany({});
    await db.collection('badgeClasses').deleteMany({});
    
    // Re-initialize with defaults
    await initializeBadgePools();
    
    return true;
  } catch (error) {
    console.error('Error resetting badge pools to defaults:', error);
    return false;
  }
}

// Export badge pools from database
export async function exportBadgePoolsFromDB() {
  try {
    const { db } = await connectToDatabase();
    
    const texts = await db.collection('badgeTexts').find({}).toArray();
    const classes = await db.collection('badgeClasses').find({}).toArray();
    
    return {
      badgeTexts: texts.map(t => t.text),
      badgeClasses: classes.map(c => c.className),
      exportDate: new Date().toISOString(),
      totalTexts: texts.length,
      totalClasses: classes.length,
      metadata: {
        texts: texts,
        classes: classes
      }
    };
  } catch (error) {
    console.error('Error exporting badge pools from DB:', error);
    return null;
  }
}

// Import badge pools to database
export async function importBadgePoolsToDB(data: { badgeTexts: string[], badgeClasses: string[] }): Promise<{ success: boolean; importedTexts: number; importedClasses: number; errors: string[] }> {
  try {
    const results = { success: true, importedTexts: 0, importedClasses: 0, errors: [] as string[] };
    
    // Import texts
    if (data.badgeTexts && Array.isArray(data.badgeTexts)) {
      const textResults = await addBadgeTextsToDB(data.badgeTexts);
      results.importedTexts = textResults.added.length;
      results.errors.push(...textResults.errors);
    }
    
    // Import classes
    if (data.badgeClasses && Array.isArray(data.badgeClasses)) {
      const classResults = await addBadgeClassesToDB(data.badgeClasses);
      results.importedClasses = classResults.added.length;
      results.errors.push(...classResults.errors);
    }
    
    return results;
  } catch (error) {
    console.error('Error importing badge pools to DB:', error);
    return { success: false, importedTexts: 0, importedClasses: 0, errors: [error.message] };
  }
}

// Get badge assignment info for an app
export async function getBadgeAssignmentInfoFromDB(appId: string) {
  try {
    const texts = await getAllBadgeTextsFromDB();
    const classes = await getAllBadgeClassesFromDB();
    
    // Use the same deterministic logic
    const hash = createHashFromId(appId);
    const textIndex = hash % texts.length;
    const classIndex = hash % classes.length;
    
    return {
      appId,
      assignedBadgeText: texts[textIndex]?.text || 'Default Badge Text',
      assignedBadgeClass: classes[classIndex]?.className || 'default-badge',
      badgeTextVariations: getTextVariations(texts, hash, 3),
      badgeClassVariations: getClassVariations(classes, hash, 3),
      totalAvailableTexts: texts.length,
      totalAvailableClasses: classes.length
    };
  } catch (error) {
    console.error('Error getting badge assignment info from DB:', error);
    return null;
  }
}

// Helper function to create hash from app ID
function createHashFromId(appId: string): number {
  const hash = createHash('md5').update(appId).digest('hex');
  return parseInt(hash.substring(0, 8), 16);
}

// Helper function to get text variations
function getTextVariations(texts: IBadgeText[], hash: number, count: number): string[] {
  const variations: string[] = [];
  for (let i = 0; i < count && i < texts.length; i++) {
    const index = (hash + i) % texts.length;
    variations.push(texts[index]?.text || '');
  }
  return variations.filter(t => t);
}

// Helper function to get class variations
function getClassVariations(classes: IBadgeClass[], hash: number, count: number): string[] {
  const variations: string[] = [];
  for (let i = 0; i < count && i < classes.length; i++) {
    const index = (hash + i) % classes.length;
    variations.push(classes[index]?.className || '');
  }
  return variations.filter(t => t);
}

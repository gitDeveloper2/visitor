import { createHash } from 'crypto';
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
  getBadgeAssignmentInfoFromDB,
  IBadgeText,
  IBadgeClass
} from './badgeDatabaseService';

// Create a deterministic hash from app ID
function createHashFromId(appId: string): number {
  const hash = createHash('md5').update(appId).digest('hex');
  return parseInt(hash.substring(0, 8), 16);
}

// Assign deterministic badge text to an app
export async function assignBadgeTextToApp(appId: string): Promise<string> {
  const texts = await getAllBadgeTextsFromDB();
  if (texts.length === 0) {
    return 'Verified by BasicUtils'; // Fallback
  }
  
  const hash = createHashFromId(appId);
  const index = hash % texts.length;
  return texts[index]?.text || 'Verified by BasicUtils';
}

// Assign deterministic CSS class to an app
export async function assignBadgeClassToApp(appId: string): Promise<string> {
  const classes = await getAllBadgeClassesFromDB();
  if (classes.length === 0) {
    return 'verified-badge'; // Fallback
  }
  
  const hash = createHashFromId(appId);
  const index = hash % classes.length;
  return classes[index]?.className || 'verified-badge';
}

// Get multiple badge text variations for an app
export async function getBadgeTextVariations(appId: string, count: number = 3): Promise<string[]> {
  const texts = await getAllBadgeTextsFromDB();
  if (texts.length === 0) {
    return ['Verified by BasicUtils']; // Fallback
  }
  
  const hash = createHashFromId(appId);
  const variations: string[] = [];
  
  for (let i = 0; i < count && i < texts.length; i++) {
    const index = (hash + i) % texts.length;
    variations.push(texts[index]?.text || '');
  }
  
  return variations.filter(t => t);
}

// Get multiple CSS class variations for an app
export async function getBadgeClassVariations(appId: string, count: number = 3): Promise<string[]> {
  const classes = await getAllBadgeClassesFromDB();
  if (classes.length === 0) {
    return ['verified-badge']; // Fallback
  }
  
  const hash = createHashFromId(appId);
  const variations: string[] = [];
  
  for (let i = 0; i < count && i < classes.length; i++) {
    const index = (hash + i) % classes.length;
    variations.push(classes[index]?.className || '');
  }
  
  return variations.filter(t => t);
}

// Validation functions
export function isValidBadgeText(badgeText: string): boolean {
  return badgeText.trim().length > 0 && 
         badgeText.trim().length <= 100 &&
         !badgeText.includes('<') && 
         !badgeText.includes('>') &&
         !badgeText.includes('"') &&
         !badgeText.includes("'");
}

export function isValidBadgeClass(className: string): boolean {
  const classRegex = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
  return classRegex.test(className) && 
         className.length >= 3 && 
         className.length <= 50;
}

// Management functions
export async function getTotalBadgeTexts(): Promise<number> {
  const texts = await getAllBadgeTextsFromDB();
  return texts.length;
}

export async function getTotalBadgeClasses(): Promise<number> {
  const classes = await getAllBadgeClassesFromDB();
  return classes.length;
}

// Add new badge texts to the database
export async function expandBadgeTextPool(newTexts: string[]): Promise<{ success: boolean; added: string[]; errors: string[] }> {
  const validTexts = newTexts.filter(text => isValidBadgeText(text));
  return await addBadgeTextsToDB(validTexts);
}

// Add new CSS classes to the database
export async function expandBadgeClassPool(newClasses: string[]): Promise<{ success: boolean; added: string[]; errors: string[] }> {
  const validClasses = newClasses.filter(className => isValidBadgeClass(className));
  return await addBadgeClassesToDB(validClasses);
}

// Remove badge text from database
export async function removeBadgeText(text: string): Promise<boolean> {
  return await removeBadgeTextFromDB(text);
}

// Remove CSS class from database
export async function removeBadgeClass(className: string): Promise<boolean> {
  return await removeBadgeClassFromDB(className);
}

// Update existing badge text
export async function updateBadgeText(oldText: string, newText: string): Promise<boolean> {
  if (!isValidBadgeText(newText)) return false;
  return await updateBadgeTextInDB(oldText, newText);
}

// Update existing CSS class
export async function updateBadgeClass(oldClass: string, newClass: string): Promise<boolean> {
  if (!isValidBadgeClass(newClass)) return false;
  return await updateBadgeClassInDB(oldClass, newClass);
}

// Get badge assignment information for an app
export async function getBadgeAssignmentInfo(appId: string) {
  return await getBadgeAssignmentInfoFromDB(appId);
}

// Get all badge texts with metadata
export async function getAllBadgeTexts(): Promise<IBadgeText[]> {
  return await getAllBadgeTextsFromDB();
}

// Get all CSS classes with metadata
export async function getAllBadgeClasses(): Promise<IBadgeClass[]> {
  return await getAllBadgeClassesFromDB();
}

// Reset pools to default values
export async function resetToDefaults(): Promise<boolean> {
  return await resetBadgePoolsToDefaults();
}

// Export pools for external use
export async function exportBadgePools() {
  return await exportBadgePoolsFromDB();
}

// Import badge pools (with validation)
export async function importBadgePools(data: { badgeTexts: string[], badgeClasses: string[] }) {
  return await importBadgePoolsToDB(data);
}

// Legacy compatibility functions (deprecated - use database versions)
export const BADGE_TEXT_POOL: string[] = [];
export const BADGE_CLASS_POOL: string[] = [];

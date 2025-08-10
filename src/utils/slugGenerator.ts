/**
 * Generates a URL-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generates a unique slug by appending a number if the slug already exists
 * @param title - The title to convert to a slug
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique URL-friendly slug
 */
export function generateUniqueSlug(title: string, existingSlugs: string[]): string {
  let slug = generateSlug(title);
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${generateSlug(title)}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Validates if a slug is valid (URL-friendly)
 * @param slug - The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
} 
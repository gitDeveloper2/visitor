import * as cheerio from 'cheerio';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Removes the existing TOC with <h2 id="toc-header"> and its direct adjacent <ol id="toc"> if they exist.
 * @param $ - The Cheerio instance loaded with HTML content.
 */
function removeExistingToc($: cheerio.CheerioAPI): void {
  // Find all instances of <h2 id="toc-header">
  const tocHeaders = $('h2#toc-header');

  // Loop through each TOC header
  tocHeaders.each((_, element) => {
    const tocHeader = $(element);

    // Check if the next sibling is <ol id="toc">
    if (tocHeader.next().is('ol')) {
      const tocList = tocHeader.next();
      
      // Log for debugging
      
      // Remove both <h2 id="toc-header"> and <ol id="toc">
      tocList.remove();
      tocHeader.remove();
    }
  });
}


/**
 * Collects <h1> and <h2> headings from the HTML content.
 * @param $ - The Cheerio instance loaded with HTML content.
 * @returns An array of TocItem objects containing id, text, and level.
 */
function collectHeadings($: cheerio.CheerioAPI): TocItem[] {
  const tocItems: TocItem[] = [];
  const seenIds = new Set<string>();

  // Select only <h2> elements
  $('h2').each((_, element) => {
    const text = $(element).text().trim();
    if (!text) return; // Skip empty headings

    const level = 2; // Since we are only using <h2>, the level is always 2
    let id = text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove non-alphanumeric characters
      .split(' ')
      .slice(0, 3) // Limit to the first 3 words for shorter IDs
      .join('-');

    // Ensure unique ID by appending a counter if the ID is already seen
    let uniqueId = id;
    let counter = 1;
    while (seenIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }

    $(element).attr('id', uniqueId);
    seenIds.add(uniqueId);

    tocItems.push({ id: uniqueId, text, level });
  });

  return tocItems;
}



/**
 * Generates the Table of Contents HTML string from collected headings.
 * @param tocItems - An array of TocItem objects.
 * @returns A string containing the TOC HTML.
 */
function generateTocHtml(tocItems: TocItem[]): string {
  return `
    <h2 id="toc-header">Table of Contents</h2>
    <ol id="toc" class="toc">
      ${tocItems
        .map((item) => {
          const isBlank = !item.text.trim(); // Check if text is blank
          return isBlank
            ? ''
            : `<li style="margin-left: ${(item.level - 1) * 20}px">
                 <a id="toclink-${item.id}" href="#${item.id}">${item.text}</a>
               </li>`;
        })
        .filter(Boolean) // Remove empty entries
        .join('')}
    </ol>
  `;
}


/**
 * Inserts the generated TOC HTML after the first <h1> element.
 * @param $ - The Cheerio instance loaded with HTML content.
 * @param tocHtml - The generated TOC HTML string.
 */
function insertToc($: cheerio.CheerioAPI, tocHtml: string): void {
  const firstH1 = $('h1').first();
  if (firstH1.length > 0) {
    firstH1.after(tocHtml);
  }
}

/**
 * Main function to generate a Table of Contents (TOC), remove any existing TOC, and insert the new TOC after the first <h1>.
 * @param htmlContent - The HTML content as a string.
 * @returns The updated HTML content with the TOC inserted.
 */
export function generateAndInsertToc(htmlContent: string): string {

  try {
    const $ = cheerio.load(htmlContent);

    // Step 1: Remove any existing TOC
    removeExistingToc($);

    // Step 2: Collect headings for TOC
    const tocItems = collectHeadings($);

    // Step 3: Generate TOC HTML
    const tocHtml = generateTocHtml(tocItems);
    // Step 4: Insert TOC into the HTML
    insertToc($, tocHtml);

    return $('body').html() || htmlContent;
  } catch (error) {
    console.error('Error generating and inserting TOC:', error);
    return htmlContent;
  }
}

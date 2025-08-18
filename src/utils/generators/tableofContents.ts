import * as cheerio from 'cheerio';

export interface TocItem {
	id: string;
	text: string;
	level: number;
}

/**
 * Removes any existing TOC variants:
 * - Legacy: <h2 id="toc-header"> followed by <ol id="toc">
 * - New: A single container with id="toc"
 */
function removeExistingToc($: cheerio.CheerioAPI): void {
	// Remove legacy H2 + adjacent OL
	const tocHeaders = $('h2#toc-header');
	tocHeaders.each((_, element) => {
		const tocHeader = $(element);
		if (tocHeader.next().is('ol#toc')) {
			const tocList = tocHeader.next();
			tocList.remove();
			tocHeader.remove();
		}
	});

	// Remove any single-container TOC with id="toc"
	$('#toc').each((_, el) => {
		$(el).remove();
	});
}

/**
 * Collects headings from the HTML content.
 * Currently collects only <h2> headings for a concise TOC.
 */
function collectHeadings($: cheerio.CheerioAPI): TocItem[] {
	const tocItems: TocItem[] = [];
	const seenIds = new Set<string>();

	$('h2').each((_, element) => {
		const text = $(element).text().trim();
		if (!text) return;

		const level = 2;
		let id = text
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, '')
			.split(' ')
			.slice(0, 3)
			.join('-');

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
 * Generates a single-container TOC with a header and list inside.
 */
function generateTocHtml(tocItems: TocItem[]): string {
	return `
		<div id="toc" class="toc">
			<div class="toc-header">Table of Contents</div>
			<ol class="toc-list">
				${tocItems
					.map((item) => {
						const isBlank = !item.text.trim();
						return isBlank
							? ''
							: `<li style="margin-left: ${(item.level - 1) * 20}px"><a id="toclink-${item.id}" href="#${item.id}">${item.text}</a></li>`;
					})
					.filter(Boolean)
					.join('')}
			</ol>
		</div>
	`;
}

/**
 * Inserts the generated TOC HTML after the first <h1> element.
 */
function insertToc($: cheerio.CheerioAPI, tocHtml: string): void {
	const firstH1 = $('h1').first();
	if (firstH1.length > 0) {
		firstH1.after(tocHtml);
	}
}

/**
 * Main function to generate a TOC, remove any existing TOC, and insert the new TOC.
 */
export function generateAndInsertToc(htmlContent: string): string {
	try {
		const $ = cheerio.load(htmlContent);
		removeExistingToc($);
		const tocItems = collectHeadings($);
		const tocHtml = generateTocHtml(tocItems);
		insertToc($, tocHtml);
		return $('body').html() || htmlContent;
	} catch (error) {
		console.error('Error generating and inserting TOC:', error);
		return htmlContent;
	}
}

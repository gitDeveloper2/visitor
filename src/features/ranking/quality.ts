// Server-safe blog quality scoring. Run on create/update and store to DB.

export type BlogQualityBreakdown = {
	wordCount: number;
	headingsScore: number; // penalize missing H1, non-sequential headings
	linksScore: number; // penalize too many links
	imagesScore: number; // small boost for having an image
	tagsScore: number; // 3-8 tags best
	total: number;
};

function stripHtml(html: string): string {
	return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

import { BLOG_QUALITY_CONFIG } from './config';

export function computeBlogQuality(html: string, opts?: { maxLinks?: number }) {
	const maxLinks = opts?.maxLinks ?? BLOG_QUALITY_CONFIG.maxLinks;
	const text = stripHtml(html);
	const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;

	// Heading structure analysis
	const hMatches = Array.from(String(html || '').matchAll(/<h([1-6])[^>]*>/gi));
	let hasH1 = false;
	let lastLevel = 0;
	let badJumps = 0;
	for (const m of hMatches) {
		const level = parseInt(m[1], 10);
		if (level === 1) hasH1 = true;
		if (lastLevel > 0 && level > lastLevel + 1) badJumps += 1; // e.g., H2 -> H4
		lastLevel = level;
	}
	let headingsScore = 1.0;
	if (!hasH1) headingsScore -= 0.3;
	if (badJumps > 0) headingsScore -= Math.min(0.5, badJumps * 0.1);
	headingsScore = Math.max(0, headingsScore);

	// Links analysis
	const links = (html.match(/<a\s+[^>]*href=/gi) || []).length;
	let linksScore = 1.0;
	if (links > maxLinks) {
		const over = links - maxLinks;
		linksScore -= Math.min(0.6, over * 0.05);
	}
	linksScore = Math.max(0, linksScore);

	return { wordCount, headingsScore, linksScore };
}

export function finalizeBlogQualityScore(params: {
	wordCount: number;
	headingsScore: number;
	linksScore: number;
	hasImage: boolean;
	tagsCount: number;
}): BlogQualityBreakdown {
	const { wordCount, headingsScore, linksScore, hasImage, tagsCount } = params;
	// Word count target: configurable ideal window
	let wc = 0.5;
	if (wordCount >= BLOG_QUALITY_CONFIG.wordIdealMin && wordCount <= BLOG_QUALITY_CONFIG.wordIdealMax) wc = 1.0;
	else if (wordCount > 0) wc = Math.max(0.2, Math.min(0.9, wordCount / BLOG_QUALITY_CONFIG.wordIdealMax));

	const imagesScore = hasImage ? 1.0 : 0.7;
	const tagsScore = tagsCount >= 3 && tagsCount <= 8 ? 1.0 : 0.6;

	// Weighted sum (configurable)
	const w = BLOG_QUALITY_CONFIG.weights;
	const total = 
		wc * w.wordCount +
		headingsScore * w.headings +
		linksScore * w.links +
		imagesScore * w.images +
		tagsScore * w.tags;

	return { wordCount, headingsScore, linksScore, imagesScore, tagsScore, total } as any;
}


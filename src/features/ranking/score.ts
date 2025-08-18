// Simple ranking utilities for blogs and apps
// Factors: premium/featured, recency (time decay), engagement (views/likes), content quality

type AnyDoc = Record<string, any>;

function stripHtmlToText(html: string): string {
	if (!html) return "";
	const div = globalThis?.document?.createElement ? document.createElement('div') : null;
	if (div) {
		div.innerHTML = html;
		return (div.textContent || div.innerText || '').trim();
	}
	// fallback for server
	return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function computeTimeDecay(createdAt: Date | string | undefined, halfLifeHours: number): number {
	if (!createdAt) return 0.5; // neutral if unknown
	const created = new Date(createdAt).getTime();
	const ageHours = Math.max(0, (Date.now() - created) / 36e5);
	// Exponential decay: value halves every halfLifeHours
	return Math.pow(2, -ageHours / halfLifeHours);
}

function computeEngagementScore(views?: number, likes?: number): number {
	const v = Math.max(0, views || 0);
	const l = Math.max(0, likes || 0);
	// Log scaling for views; direct small weight for likes
	return Math.log10(v + 10) * 1.0 + l * 0.5;
}

function clamp(min: number, val: number, max: number): number {
	return Math.max(min, Math.min(max, val));
}

export function computeBlogScore(blog: AnyDoc): number {
	const text = stripHtmlToText(blog.content || '');
	const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
	const withinIdealLength = words >= 900 && words <= 2000 ? 1 : 0;
	// Quality factor based on distance from ideal range
	let quality = 0.5;
	if (withinIdealLength) quality = 1.0;
	else if (words > 0) {
		const ratio = words < 900 ? words / 900 : clamp(0, (2000 - words) / 2000, 1);
		quality = clamp(0.2, ratio, 0.8);
	}

	const hasImage = Boolean(blog.imageUrl);
	const tagsCount = Array.isArray(blog.tags) ? blog.tags.length : 0;
	const goodTags = tagsCount >= 3 && tagsCount <= 8 ? 1 : 0.6;

	const recency = computeTimeDecay(blog.createdAt || blog.updatedAt, 24 * 7); // half-life 7 days
	const engagement = computeEngagementScore(blog.views, blog.likes);

	// Weighted sum; scale factors intentionally modest
	let score = 0;
	score += recency * 3.0;
	score += engagement * 1.2;
	score += quality * 2.0;
	score += hasImage ? 0.5 : 0;
	score += goodTags ? 0.3 : 0;

	// Founder stories are informational but not necessarily top-ranked by default
	if (blog.isFounderStory) score += 0.1;

	return score;
}

export function computeAppScore(app: AnyDoc): number {
	const text = stripHtmlToText(app.fullDescription || app.description || '');
	const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
	let quality = 0.5;
	if (words >= 200 && words <= 4000) quality = 1.0; // looser bounds for apps
	else if (words > 0) {
		const ratio = words < 200 ? words / 200 : clamp(0, (4000 - words) / 4000, 1);
		quality = clamp(0.2, ratio, 1.0);
	}

	const recency = computeTimeDecay(app.createdAt || app.updatedAt, 24 * 14); // 14-day half-life
	const engagement = computeEngagementScore(app.views, app.likes);
	const featuresCount = Array.isArray(app.features) ? app.features.length : 0;
	const hasGallery = Array.isArray(app.gallery) && app.gallery.length > 0;

	let score = 0;
	score += recency * 3.0;
	score += engagement * 1.2;
	score += quality * 1.5;
	score += featuresCount >= 3 ? 0.5 : 0;
	score += hasGallery ? 0.3 : 0;

	// Premium boost but bounded so time/quality can still overtake over time
	if (app.isPremium) score += 2.0;

	return score;
}

export function sortByScore<T extends AnyDoc>(items: T[], scorer: (t: T) => number): T[] {
	return [...items]
		.map(item => ({ item, score: scorer(item) }))
		.sort((a, b) => b.score - a.score)
		.map(x => x.item);
}


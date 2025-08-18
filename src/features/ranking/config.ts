// Centralized, overridable ranking/quality configuration
// Single source of truth: use public NEXT_PUBLIC_* envs for both server and client.
// This avoids API calls and keeps behavior consistent across environments.

function pickPublicEnv(key: string): string | undefined {
	return process.env[`NEXT_PUBLIC_${key}` as keyof NodeJS.ProcessEnv];
}

function num(val: string | undefined, fallback: number): number {
	const n = Number(val);
	return Number.isFinite(n) ? n : fallback;
}

export const BLOG_QUALITY_CONFIG = {
	wordIdealMin: num(pickPublicEnv('BLOG_WORD_IDEAL_MIN'), 900),
	wordIdealMax: num(pickPublicEnv('BLOG_WORD_IDEAL_MAX'), 2000),
	maxLinks: num(pickPublicEnv('BLOG_MAX_LINKS'), 10),
	minProceedThreshold: num(pickPublicEnv('BLOG_MIN_QUALITY_TO_PROCEED'), 0.65),
	weights: {
		wordCount: num(pickPublicEnv('BLOG_Q_W_WORDS'), 0.4),
		headings: num(pickPublicEnv('BLOG_Q_W_HEADINGS'), 0.25),
		links: num(pickPublicEnv('BLOG_Q_W_LINKS'), 0.15),
		images: num(pickPublicEnv('BLOG_Q_W_IMAGES'), 0.1),
		tags: num(pickPublicEnv('BLOG_Q_W_TAGS'), 0.1),
	},
	featureThreshold: num(pickPublicEnv('BLOG_QUALITY_FEATURE_THRESHOLD'), 0.82), // 0..1
};

export const RANKING_HALFLIFE = {
	blogHours: num(pickPublicEnv('RANK_BLOG_HALFLIFE_HOURS'), 24 * 7), // 7 days
	appHours: num(pickPublicEnv('RANK_APP_HALFLIFE_HOURS'), 24 * 14), // 14 days
};


// Cache policy definitions: TTLs and key namespaces

export type CacheTTLSeconds = number;

export const CachePolicy = {
	// Page data TTLs
	page: {
		blogsIndex: 60 * 10, // 10 minutes
		blogsCategory: 60 * 30, // 30 minutes
		blogsTag: 60 * 30, // 30 minutes
		blogPost: 60 * 60, // 1 hour
		launchIndex: 60 * 5, // 5 minutes (more frequent changes)
		launchCategory: 60 * 10, // 10 minutes
		appDetail: 60 * 10, // 10 minutes (non-payment fields)
	},
	// API layer TTLs (short to prevent staleness in dashboard views)
	api: {
		userBlogsList: 60, // 1 minute
		userAppsList: 60, // 1 minute
		userAppDetail: 60, // 1 minute
		userBlogDetail: 60, // 1 minute
	},
	// Keys
	keys: {
		blogsIndex: 'blog:index:v2',
		blogsCategory: (slug: string) => `blog:category:v2:${slug}`,
		blogsTag: (slug: string) => `blog:tag:v2:${slug}`,
		blogPost: (slug: string | undefined) => `blog:post:v2:${slug ?? 'unknown'}`,
		launchIndex: 'launch:index:v2',
		launchCategory: (slug: string) => `launch:category:v2:${slug}`,
		appDetail: (slugOrId: string) => `app:v2:${slugOrId}`,
		apiUserBlogsList: (userId: string, q: string) => `api:userblogs:list:v1:${userId}:${q}`,
		apiUserAppsList: (userId: string, q: string) => `api:userapps:list:v1:${userId}:${q}`,
		apiUserAppDetail: (userId: string, id: string) => `api:userapps:detail:v1:${userId}:${id}`,
		apiUserBlogDetail: (userId: string, slug: string) => `api:userblogs:detail:v1:${userId}:${slug}`,
	},
} as const;


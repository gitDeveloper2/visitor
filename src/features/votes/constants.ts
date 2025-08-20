export const BASE_VOTE_URL = (process.env.NEXT_PUBLIC_VOTES_URL || '').trim();

// Normalize: remove trailing slashes; empty string means "use local"
export const VOTE_BASE = BASE_VOTE_URL.replace(/\/+$/g, '');

export const isExternalVoteApi = VOTE_BASE.length > 0;

export const buildVoteUrl = (path: string) => {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return isExternalVoteApi ? `${VOTE_BASE}${normalizedPath}` : normalizedPath;
};

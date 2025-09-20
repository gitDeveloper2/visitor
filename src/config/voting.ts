// Voting API configuration - use the same URL as VoteProvider
export const VOTING_API_URL = process.env.NEXT_PUBLIC_VOTES_URL || 'https://voting-ebon-seven.vercel.app';

export const VOTING_ENDPOINTS = {
  VOTE: (toolId: string, token: string) => 
    `${VOTING_API_URL}/api/vote?toolId=${toolId}&token=${encodeURIComponent(token)}`,
  VOTE_STATUS: (toolId: string, token: string) =>
    `${VOTING_API_URL}/api/vote?toolId=${toolId}&token=${encodeURIComponent(token)}`,
};

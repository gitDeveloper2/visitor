// Voting API configuration
export const VOTING_API_URL = process.env.NEXT_PUBLIC_VOTING_API_URL || 'http://localhost:3001';

export const VOTING_ENDPOINTS = {
  VOTE: (toolId: string, token: string) => 
    `${VOTING_API_URL}/api/vote?toolId=${toolId}&token=${encodeURIComponent(token)}`,
  VOTE_STATUS: (toolId: string, token: string) =>
    `${VOTING_API_URL}/api/vote?toolId=${toolId}&token=${encodeURIComponent(token)}`,
};

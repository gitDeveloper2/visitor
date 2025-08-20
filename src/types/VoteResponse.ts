export type VoteResponse = {
  success: boolean;
  votes?: number;
  alreadyVoted?: boolean;
  error?: string;
};
export interface IVoteResponse {
  success: boolean;
  votes?: number;
  alreadyVoted?: boolean;
  error?: string;
}
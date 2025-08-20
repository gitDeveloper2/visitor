export interface ISocialAccount {
    type: string; // e.g. 'github', 'twitter', 'linkedin', 'facebook'
    username?: string; // or user handle if preferred
    url?: string;      // full URL if you prefer
  }
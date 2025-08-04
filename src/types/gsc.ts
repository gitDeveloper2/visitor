// types/types.ts

export interface GscData {
    url: string;
    query: string;
    clicks: number;
    impressions: number;
    ctr: number; // Click-through rate
    avgPosition: number;
    date?: string; 
  }
  
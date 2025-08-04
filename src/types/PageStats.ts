// export interface PageStats {
//     slug: string;
//     url: string;
//     totalWords: number;
//     totalSentences: number;
//     fleschReadingEase: number;
//     fleschKincaidGrade: number;
//     daleChallScore: number;
//     passiveCount: number;
//     overallScore: number;
//     updatedAt?: Date; // Optional, set when the stats are updated
//   }
  export interface PageStats {
    slug: string;  // Slug at the top level
    stats: {
        totalWords: number;
        totalSentences: number;
        fleschReadingEase: number;
        fleschKincaidGrade: number;
        daleChallScore: number;
        passiveCount: number;
        overallScore: number;
        url: string;  // URL inside the stats object
        slug: string; // Slug inside the stats object
    };
    updatedAt?: Date;  // Timestamp of when the stats were last updated
}

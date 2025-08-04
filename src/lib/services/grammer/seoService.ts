import { PageStats } from "../../../types/PageStats";
import { analyzePage } from "./contentAnalysisService";
import { updatePageStats } from "./pageStatsService";
import { calculateOverallScore } from "./scoreHelper";

export const recalculatePageStats = async (slug: string, htmlContent: string): Promise<void> => {
  const analysis = await analyzePage(htmlContent);
  // const { readabilityStats, grammarStats } = analysis;

  const overallScore = calculateOverallScore({
    fleschReadingEase: analysis.fleschReadingEase,
    fleschKincaidGrade: analysis.fleschKincaidGrade,
    daleChallScore: analysis.daleChallScore,
    passiveCount: analysis.passiveCount,
  });

  const stats: PageStats = {
    slug,
    stats:{
      url: `https://basicutils.com/${slug}`,
    totalWords: analysis.totalWords,
    totalSentences: analysis.totalSentences,
    fleschReadingEase: analysis.fleschReadingEase,
    fleschKincaidGrade: analysis.fleschKincaidGrade,
    daleChallScore: analysis.daleChallScore,
    passiveCount: analysis.passiveCount,
    overallScore,
    slug
    }
  };

  await updatePageStats(slug, stats);
};

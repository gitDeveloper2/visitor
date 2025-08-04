import { calculateOverallScore } from "./scoreHelper";
import { analyzeGrammar,analyzeReadability } from "./textAnalysis";



export const analyzePage = async (htmlContent: string) => {
  const readabilityStats = analyzeReadability(htmlContent);
  const grammarStats = analyzeGrammar(htmlContent);
  const overallScore=calculateOverallScore({
    daleChallScore:readabilityStats.daleChallScore,
    fleschKincaidGrade:readabilityStats.fleschKincaidGrade,
    fleschReadingEase:readabilityStats.fleschReadingEase,
    passiveCount:grammarStats.passiveCount});
    overallScore
  return {
    ...readabilityStats,
    ...grammarStats,
    overallScore
  };
};

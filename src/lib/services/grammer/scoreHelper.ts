interface ScoreParams {
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    daleChallScore: number;
    passiveCount: number;
  }
  
  export const calculateOverallScore = (params: ScoreParams): number => {
    const { fleschReadingEase, fleschKincaidGrade, daleChallScore, passiveCount } = params;
  
    const readabilityScore = (fleschReadingEase + (100 - fleschKincaidGrade) + (100 - daleChallScore)) / 3;
    const grammarPenalty = Math.max(0, 100 - passiveCount * 2);
  
    return Math.min(100, Math.max(0, (readabilityScore + grammarPenalty) / 2));
  };
  
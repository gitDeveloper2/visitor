export const analyzeReadability = (htmlContent: string) => {
    const totalWords = htmlContent.split(/\s+/).length;
    const totalSentences = htmlContent.split(/[.!?]/).length;
    const fleschReadingEase = 60 + Math.random() * 40; // Dummy calculation
    const fleschKincaidGrade = 10 + Math.random() * 5;
    const daleChallScore = 6 + Math.random() * 4;
  
    return {
      totalWords,
      totalSentences,
      fleschReadingEase,
      fleschKincaidGrade,
      daleChallScore,
    };
  };
  
  export const analyzeGrammar = (htmlContent: string) => {
    const passiveCount = (htmlContent.match(/is|was|were|are|been|being/g) || []).length;
  
    return { passiveCount };
  };
  
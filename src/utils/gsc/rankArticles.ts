import { insightsConfig } from "../../lib/config/gscConfig";
import { GscData } from "../../types/gsc";

 // Function to rank articles based on various insights
export const rankArticles = (data: GscData[], insights: any) => {
    const articleScores: Record<string, number> = {};
  
    // Combine results from all insights and calculate an importance score
    insightsConfig.forEach(config => {
      const articles = insights[config.title];
      articles.forEach((article: any) => {
        const url = article.url;
        if (!articleScores[url]) {
          articleScores[url] = 0;
        }
  
        // Prioritize articles to focus on based on the insights
        switch (config.title) {
          case 'High Impressions, Low Clicks': 
            // These pages have visibility but are underperforming in clicks, need optimization
            articleScores[url] += 20;
            break;
          case 'High-Ranking, Low-Click Pages': 
            // These pages are ranking well but not getting enough clicks, potential for CTR improvement
            articleScores[url] += 15;
            break;
          case 'Pages with Declining CTR': 
            // Declining CTR could mean something’s wrong, needs attention to improve
            articleScores[url] += 12;
            break;
          case 'High CTR, Low Rank Pages': 
            // Pages with high CTR but low rank need improvement in rank to leverage their CTR
            articleScores[url] += 10;
            break;
          case 'High Search Potential Pages': 
            // Pages with high search potential but low CTR or rank need improvement
            articleScores[url] += 8;
            break;
          case 'Low Impressions, Low Rank Pages': 
            // Pages with low rank and impressions need optimization for search visibility
            articleScores[url] += 6;
            break;
          case 'Articles with Significant CTR Growth': 
            // Positive CTR growth is a good signal, needs attention to maintain momentum
            articleScores[url] += 5;
            break;
          case 'Pages with Consistently High Impressions': 
            // Pages with steady impressions need a push to increase CTR
            articleScores[url] += 4;
            break;
          case 'Articles with Strong Click Growth': 
            // Articles with growing clicks might need some more optimization to keep the momentum
            articleScores[url] += 3;
            break;
          default:
            break;
        }
      });
    });
  
    // Sort articles by score in descending order
    const sortedArticles = Object.entries(articleScores)
      .map(([url, score]) => ({ url, score }))
      .sort((a, b) => b.score - a.score);
  
    // Return the top 10 articles to focus on
    return sortedArticles.slice(0, 10);
  };
  
// lib/gscConfig.ts
import {
  getHighRankLowClickPages,
  getHighCtrLowRankPages,
  getHighImpressionsLowClicksPages,
  getPagesWithDecliningCtr,
  getHighSearchPotentialPages,
  getLowImpressionsLowRankPages,
  getArticlesWithSignificantCtrGrowth,
  getPagesWithConsistentlyHighImpressions,
  getArticlesWithStrongClickGrowth
} from "../../utils/gsc/gscHelpers";

export const insightsConfig = [
  {
    title: "High-Ranking, Low-Click Pages",
    helperFunction: getHighRankLowClickPages,
  },
  {
    title: "High CTR, Low Rank Pages",
    helperFunction: getHighCtrLowRankPages,
  },
  {
    title: "High Impressions, Low Clicks",
    helperFunction: getHighImpressionsLowClicksPages,
  },
  {
    title: "Pages with Declining CTR",
    helperFunction: getPagesWithDecliningCtr,
  },
  {
    title: "High Search Potential Pages",
    helperFunction: getHighSearchPotentialPages,
  },
  {
    title: "Low Impressions, Low Rank Pages",
    helperFunction: getLowImpressionsLowRankPages,
  },
  {
    title: "Articles with Significant CTR Growth",
    helperFunction: getArticlesWithSignificantCtrGrowth,
  },
  {
    title: "Pages with Consistently High Impressions",
    helperFunction: getPagesWithConsistentlyHighImpressions,
  },
  {
    title: "Articles with Strong Click Growth",
    helperFunction: getArticlesWithStrongClickGrowth,
  },
];

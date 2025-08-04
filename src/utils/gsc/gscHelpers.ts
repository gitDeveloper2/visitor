// lib/gscHelpers.ts
import { GscData } from '../../types/gsc';

export function getHighRankLowClickPages(data: GscData[], clickThreshold = 10, rankThreshold = 10) {
  return data.filter(page => page.avgPosition <= rankThreshold && page.clicks < clickThreshold);
}

export function getHighCtrLowRankPages(data: GscData[], ctrThreshold = 0.05, positionThreshold = 10) {
  return data.filter(page => page.ctr >= ctrThreshold && page.avgPosition > positionThreshold);
}

export function getCtrTrends(data: GscData[], pageUrl: string) {
  return data
    .filter(page => page.url === pageUrl)
    .map(entry => ({ date: entry.date, ctr: (entry.clicks / entry.impressions) }));
}

export function getHighImpressionsLowClicksPages(data: GscData[], impressionsThreshold = 1000, clickThreshold = 10) {
  return data.filter(page => page.impressions >= impressionsThreshold && page.clicks < clickThreshold);
}
export function getHighRankLowCtrPages(data: GscData[], ctrThreshold = 0.01, rankThreshold = 10) {
  return data.filter(page => page.avgPosition <= rankThreshold && page.ctr < ctrThreshold);
}
export function getArticlesWithSignificantCtrGrowth(data: GscData[], growthThreshold = 0.05) {
  const articlesWithGrowth = data.filter((page, index, arr) => {
    if (index === 0) return false;
    const prev = arr[index - 1];
    const growth = (page.clicks / page.impressions) - (prev.clicks / prev.impressions);
    return growth >= growthThreshold;
  });

  return articlesWithGrowth;
}
export function getHighSearchPotentialPages(data: GscData[], impressionsThreshold = 1000, ctrThreshold = 0.02, rankThreshold = 20) {
  return data.filter(page => page.impressions >= impressionsThreshold && page.ctr < ctrThreshold && page.avgPosition > rankThreshold);
}
export function getLowImpressionsLowRankPages(data: GscData[], impressionsThreshold = 500, rankThreshold = 20) {
  return data.filter(page => page.impressions < impressionsThreshold && page.avgPosition > rankThreshold);
}
export function getPagesWithDecliningCtr(data: GscData[], declineThreshold = -0.02) {
  const pagesWithDecliningCtr = data.filter((page, index, arr) => {
    if (index === 0) return false;
    const prev = arr[index - 1];
    const ctrChange = (page.clicks / page.impressions) - (prev.clicks / prev.impressions);
    return ctrChange <= declineThreshold;
  });

  return pagesWithDecliningCtr;
}
export function getPagesWithConsistentlyHighImpressions(data: GscData[], impressionsThreshold = 1000) {
  return data.filter(page => page.impressions >= impressionsThreshold);
}
export function getArticlesWithStrongClickGrowth(data: GscData[], clickGrowthThreshold = 10) {
  const articlesWithStrongClickGrowth = data.filter((page, index, arr) => {
    if (index === 0) return false;
    const prev = arr[index - 1];
    const clickGrowth = page.clicks - prev.clicks;
    return clickGrowth >= clickGrowthThreshold;
  });

  return articlesWithStrongClickGrowth;
}

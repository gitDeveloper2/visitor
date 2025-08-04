// hooks/useGscInsights.ts
import { useEffect, useState } from 'react';
import { insightsConfig } from '../lib/config/gscConfig';
import { GscData } from '../types/gsc';

type Insights = Record<string, GscData[]>; // Define gscInsights as a record of arrays of GscData

export function useGscInsights() {
  const [gscInsights, setGscInsights] = useState<Insights>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/gsc');
        const result = await response.json();

        // Assuming the result structure is { data: GscData[] }
        const data: GscData[] = result.data;

        const insights = insightsConfig.reduce((acc, insight) => {
          acc[insight.title] = insight.helperFunction(data);
          return acc;
        }, {} as Insights);

        setGscInsights(insights);
      } catch (error) {
        console.error('Failed to fetch GSC data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { gscInsights, loading };
}

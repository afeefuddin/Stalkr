import { useState, useMemo } from 'react';
import api from '~/lib/api';
import usePersistedQuery from '~/lib/react-query/use-persisted-query';

type Timeframe = 'intraday' | 'daily' | 'weekly' | 'monthly';

const timeframeMap = {
  intraday: { func: 'TIME_SERIES_INTRADAY', params: { interval: '60min' } },
  daily: { func: 'TIME_SERIES_DAILY', params: {} },
  weekly: { func: 'TIME_SERIES_WEEKLY', params: {} },
  monthly: { func: 'TIME_SERIES_MONTHLY', params: {} },
} as const;

export function useStockInfo(ticker: string) {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');

  // Fetch company overview
  const overviewQuery = usePersistedQuery({
    queryKey: ['company-overview', ticker],
    queryFn: async () => (await api('OVERVIEW', { symbol: ticker })).data ?? null,
    retry: 10,
  });

  // Fetch time series
  const tsSpec = timeframeMap[timeframe];
  const tsQuery = usePersistedQuery({
    queryKey: ['timeseries', ticker, timeframe],
    queryFn: async () => (await api(tsSpec.func as any, { symbol: ticker, ...tsSpec.params })).data ?? null,
  });

  // Transform time series to chart-friendly arrays
  const chartData = useMemo(() => {
    const series = tsQuery.data;
    if (!series || typeof series !== 'object') return { points: undefined, labels: undefined, priceChange: 0, percentChange: 0, currentPrice: 0 };

    const candidateKey = Object.keys(series).find(k => k.toLowerCase().includes('time') || k.toLowerCase().includes('series'));
    const rawSeries = candidateKey ? (series as any)[candidateKey] : series;
    if (!rawSeries || typeof rawSeries !== 'object') return { points: undefined, labels: undefined, priceChange: 0, percentChange: 0, currentPrice: 0 };

    const entries = Object.entries(rawSeries).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
    const sliced = entries.slice(Math.max(0, entries.length - 60));

    const points = sliced.map(([t, v]) => ({ value: Number.parseFloat((v as any)['4. close'] ?? (v as any).close ?? 0) }));
    const labels = sliced.map(([t]) => {
      const d = new Date(t);
      if (timeframe === 'intraday') return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      if (timeframe === 'daily') return `${d.getMonth() + 1}/${d.getDate()}`;
      if (timeframe === 'weekly') return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (timeframe === 'monthly') return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const currentPrice = points[points.length - 1]?.value ?? 0;
    const previousPrice = points[0]?.value ?? 0;
    const priceChange = currentPrice - previousPrice;
    const percentChange = previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;

    return { points, labels, currentPrice, priceChange, percentChange };
  }, [tsQuery.data, timeframe]);

  return {
    timeframe,
    setTimeframe,
    overviewQuery,
    tsQuery,
    ...chartData,
  };
}

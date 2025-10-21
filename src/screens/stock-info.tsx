import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, Modal } from 'react-native';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';
import { useRoute } from '@react-navigation/native';
import Skeleton, {
  SkeletonCard,
  SkeletonTitle,
} from '~/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import api from '~/lib/api';
import GraphData from '~/components/graph-data';

type RouteParams = { ticker?: string };

const timeframeMap = {
  intraday: { func: 'TIME_SERIES_INTRADAY', params: { interval: '60min' } },
  daily: { func: 'TIME_SERIES_DAILY', params: {} },
  weekly: { func: 'TIME_SERIES_WEEKLY', params: {} },
  monthly: { func: 'TIME_SERIES_MONTHLY', params: {} },
} as const;

export default function StockInfoScreen() {
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;
  const ticker = params.ticker ?? 'AAPL';
  const [timeframe, setTimeframe] =
    useState<keyof typeof timeframeMap>('daily');

  // Fetch company overview
  const overviewQuery = useQuery({
    queryKey: ['company-overview', ticker],
    queryFn: async () => {
      const { data, error } = await api('OVERVIEW', { symbol: ticker });
      return data ?? null;
    },
  });

  const tsSpec = timeframeMap[timeframe];
  const tsQuery = useQuery({
    queryKey: ['timeseries', ticker, timeframe],
    queryFn: async () => {
      const { data, error } = await api(tsSpec.func as any, {
        symbol: ticker,
        ...tsSpec.params,
      });
      return data ?? null;
    },
  });

  // Transform time series to chart-friendly arrays
  const { points, labels, priceChange, percentChange, currentPrice } =
    useMemo(() => {
      const series = tsQuery.data;
      if (!series || typeof series !== 'object')
        return {
          points: undefined,
          labels: undefined,
          priceChange: 0,
          percentChange: 0,
          currentPrice: 0,
        };

      const candidateKey = Object.keys(series).find(
        k =>
          k.toLowerCase().includes('time') ||
          k.toLowerCase().includes('series'),
      );
      const rawSeries = candidateKey ? (series as any)[candidateKey] : series;

      if (!rawSeries || typeof rawSeries !== 'object')
        return {
          points: undefined,
          labels: undefined,
          priceChange: 0,
          percentChange: 0,
          currentPrice: 0,
        };

      const entries = Object.entries(rawSeries);
      entries.sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
      );

      const maxPoints = 60;
      const sliced = entries.slice(Math.max(0, entries.length - maxPoints));

      const pts = sliced.map(([t, v]) => ({
        value: Number.parseFloat(
          (v as any)['4. close'] ?? (v as any).close ?? 0,
        ),
      }));

      const labs = sliced.map(([t]) => {
        const d = new Date(t);
        if (timeframe === 'intraday') {
          return `${String(d.getHours()).padStart(2, '0')}:${String(
            d.getMinutes(),
          ).padStart(2, '0')}`;
        }
        if (timeframe === 'daily') {
          return `${d.getMonth() + 1}/${d.getDate()}`;
        }
        if (timeframe === 'weekly') {
          return d.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });
        }
        if (timeframe === 'monthly') {
          return d.toLocaleDateString(undefined, {
            month: 'short',
            year: '2-digit',
          });
        }
        return `${d.getMonth() + 1}/${d.getDate()}`;
      });

      // Calculate price change
      const current = pts[pts.length - 1]?.value ?? 0;
      const previous = pts[0]?.value ?? 0;
      const change = current - previous;
      const pctChange = previous !== 0 ? (change / previous) * 100 : 0;

      return {
        points: pts,
        labels: labs,
        priceChange: change,
        percentChange: pctChange,
        currentPrice: current,
      };
    }, [tsQuery.data, timeframe]);

  const isPositive = priceChange >= 0;

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.backgroundDark }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <View style={{ gap: 16 }}>
          {/* Header with Price */}
          <View style={{ gap: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text variant="xl" weight="700" style={{ fontSize: 28 }}>
                  {ticker}
                </Text>
                {overviewQuery.data && (
                  <Text style={{ color: Colors.muted, fontSize: 14 }}>
                    {(overviewQuery.data as any).Name}
                  </Text>
                )}
              </View>
            </View>
            {currentPrice > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  gap: 12,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}
                >
                  ${currentPrice.toFixed(2)}
                </Text>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <Text
                    style={{
                      color: isPositive ? '#10b981' : '#ef4444',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    {isPositive ? '+' : ''}
                    {priceChange.toFixed(2)}
                  </Text>
                  <Text
                    style={{
                      color: isPositive ? '#10b981' : '#ef4444',
                      fontSize: 14,
                    }}
                  >
                    ({isPositive ? '+' : ''}
                    {percentChange.toFixed(2)}%)
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Chart Card */}
          <View
            style={{
              backgroundColor: Colors.secondary,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {/* Timeframe Selector */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  padding: 4,
                }}
              >
                {(['intraday', 'daily', 'weekly', 'monthly'] as const).map(
                  tf => (
                    <Pressable
                      key={tf}
                      onPress={() => setTimeframe(tf)}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 6,
                        backgroundColor:
                          timeframe === tf ? Colors.primary : 'transparent',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color:
                            timeframe === tf
                              ? Colors.backgroundDark
                              : Colors.muted,
                          fontWeight: timeframe === tf ? '700' : '500',
                          fontSize: 12,
                        }}
                      >
                        {tf === 'intraday'
                          ? '1D'
                          : tf === 'daily'
                          ? '1W'
                          : tf === 'weekly'
                          ? '1M'
                          : '3M'}
                      </Text>
                    </Pressable>
                  ),
                )}
              </View>
            </View>

            {/* Chart */}
            <View style={{ padding: 8, paddingBottom: 16 }}>
              {tsQuery.isLoading ? (
                <SkeletonCard style={{ height: 320 }} />
              ) : (
                <GraphData
                  points={points}
                  xAxisData={labels}
                  timeframe={timeframe}
                  color={Colors.primary}
                />
              )}
            </View>
          </View>

          {/* Company Info Card */}
          {overviewQuery.data ? (
            <View
              style={{
                backgroundColor: Colors.secondary,
                padding: 20,
                borderRadius: 16,
                gap: 16,
              }}
            >
              <View>
                <Text weight="700" style={{ fontSize: 18, marginBottom: 6 }}>
                  Company Overview
                </Text>
                <Text style={{ color: Colors.muted, fontSize: 14 }}>
                  {(overviewQuery.data as any).Sector ?? ''} •{' '}
                  {(overviewQuery.data as any).Industry ?? ''}
                </Text>
              </View>

              {/* Key Metrics Grid */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginHorizontal: -8,
                }}
              >
                {[
                  [
                    'Market Cap',
                    (overviewQuery.data as any).MarketCapitalization,
                  ],
                  ['P/E Ratio', (overviewQuery.data as any).PERatio],
                  ['EPS', (overviewQuery.data as any).EPS],
                  ['Dividend', (overviewQuery.data as any).DividendPerShare],
                  ['Yield', (overviewQuery.data as any).DividendYield],
                  ['Beta', (overviewQuery.data as any).Beta],
                  ['52W Low', (overviewQuery.data as any)['52WeekLow']],
                  ['52W High', (overviewQuery.data as any)['52WeekHigh']],
                  ['50 DMA', (overviewQuery.data as any)['50DayMovingAverage']],
                  [
                    '200 DMA',
                    (overviewQuery.data as any)['200DayMovingAverage'],
                  ],
                  [
                    'Target Price',
                    (overviewQuery.data as any).AnalystTargetPrice,
                  ],
                  ['Country', (overviewQuery.data as any).Country],
                ].map((pair, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: '50%',
                      paddingHorizontal: 8,
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        padding: 12,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.muted,
                          fontSize: 11,
                          marginBottom: 4,
                        }}
                      >
                        {pair[0]}
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '700',
                          fontSize: 14,
                        }}
                      >
                        {pair[1] ?? '—'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Description */}
              {(overviewQuery.data as any).Description && (
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    padding: 16,
                    borderRadius: 12,
                    marginTop: 8,
                  }}
                >
                  <Text weight="700" style={{ fontSize: 16, marginBottom: 8 }}>
                    About
                  </Text>
                  <Text
                    style={{
                      color: Colors.muted,
                      lineHeight: 20,
                      fontSize: 13,
                    }}
                  >
                    {(overviewQuery.data as any).Description}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: Colors.secondary,
                padding: 20,
                borderRadius: 16,
              }}
            >
              <SkeletonTitle />
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                <SkeletonCard style={{ flex: 1, height: 100 }} />
                <SkeletonCard style={{ flex: 1, height: 100 }} />
              </View>
              <Skeleton style={{ height: 12, marginTop: 16, width: '100%' }} />
              <Skeleton style={{ height: 12, marginTop: 8, width: '100%' }} />
              <Skeleton style={{ height: 12, marginTop: 8, width: '80%' }} />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

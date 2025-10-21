import React from 'react';
import { ScrollView, View } from 'react-native';
import Colors from '~/theme/colors';
import Skeleton, {
  SkeletonCard,
  SkeletonTitle,
} from '~/components/ui/skeleton';
import { RouteProp, useRoute } from '@react-navigation/native';

import { StockHeader } from '~/components/stock-info/stock-header';
import { StockChartCard } from '~/components/stock-info/stock-chart-card';
import { CompanyOverviewCard } from '~/components/stock-info/company-overview-card';
import { useStockInfo } from '~/hooks/use-stock-info';

export default function StockInfoScreen() {
  const route = useRoute<RouteProp<{ params: { ticker: string } }, 'params'>>();
  const { ticker } = route.params;

  const {
    timeframe,
    setTimeframe,
    overviewQuery,
    tsQuery,
    points,
    labels,
    currentPrice,
    priceChange,
    percentChange,
  } = useStockInfo(ticker);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.backgroundDark }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <View style={{ gap: 16 }}>
        <StockHeader
          ticker={ticker}
          companyName={overviewQuery.data?.Name}
          currentPrice={currentPrice}
          priceChange={priceChange}
          percentChange={percentChange}
        />

        <StockChartCard
          timeframe={timeframe}
          onSelectTimeframe={setTimeframe}
          points={points}
          labels={labels}
          loading={tsQuery.isLoading}
        />

        {overviewQuery.data ? (
          <CompanyOverviewCard overview={overviewQuery.data} />
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
  );
}

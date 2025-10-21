import React from 'react';
import { View } from 'react-native';
import Colors from '~/theme/colors';
import GraphData from '~/components/graph-data';
import { SkeletonCard } from '~/components/ui/skeleton';
import { TimeframeSelector } from './time-frame-selector';

interface Props {
  timeframe: string;
  onSelectTimeframe: (tf: any) => void;
  points?: { value: number }[];
  labels?: string[];
  loading?: boolean;
}

export const StockChartCard: React.FC<Props> = ({
  timeframe,
  onSelectTimeframe,
  points,
  labels,
  loading,
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.secondary,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <TimeframeSelector
          timeframe={timeframe as any}
          onSelect={onSelectTimeframe}
        />
      </View>

      <View style={{ padding: 8, paddingBottom: 16 }}>
        {loading ? (
          <SkeletonCard style={{ height: 320 }} />
        ) : (
          <GraphData
            points={points}
            xAxisData={labels}
            timeframe={timeframe as 'intraday' | 'daily' | 'weekly' | 'monthly'}
            color={Colors.primary}
          />
        )}
      </View>
    </View>
  );
};

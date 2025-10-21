import React from 'react';
import { View, Pressable } from 'react-native';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';

type Timeframe = 'intraday' | 'daily' | 'weekly' | 'monthly';

interface Props {
  timeframe: Timeframe;
  onSelect: (tf: Timeframe) => void;
}

export const TimeframeSelector: React.FC<Props> = ({ timeframe, onSelect }) => {
  const labels: Record<Timeframe, string> = {
    intraday: '1D',
    daily: '1W',
    weekly: '1M',
    monthly: '3M',
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: 4,
      }}
    >
      {(['intraday', 'daily', 'weekly', 'monthly'] as Timeframe[]).map(tf => (
        <Pressable
          key={tf}
          onPress={() => onSelect(tf)}
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 6,
            alignItems: 'center',
            backgroundColor: timeframe === tf ? Colors.primary : 'transparent',
          }}
        >
          <Text
            style={{
              color: timeframe === tf ? Colors.backgroundDark : Colors.muted,
              fontWeight: timeframe === tf ? '700' : '500',
              fontSize: 12,
            }}
          >
            {labels[tf]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

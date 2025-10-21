import React from 'react';
import { View } from 'react-native';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';

interface Props {
  ticker: string;
  companyName?: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
}

export const StockHeader: React.FC<Props> = ({
  ticker,
  companyName,
  currentPrice,
  priceChange,
  percentChange,
}) => {
  const isPositive = priceChange >= 0;

  return (
    <View style={{ gap: 8 }}>
      <View>
        <Text variant="xl" weight="700" style={{ fontSize: 28 }}>
          {ticker}
        </Text>
        {companyName && <Text style={{ color: Colors.muted, fontSize: 14 }}>{companyName}</Text>}
      </View>

      {currentPrice > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>
            ${currentPrice.toFixed(2)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: isPositive ? '#10b981' : '#ef4444', fontSize: 16, fontWeight: '600' }}>
              {isPositive ? '+' : ''}
              {priceChange.toFixed(2)}
            </Text>
            <Text style={{ color: isPositive ? '#10b981' : '#ef4444', fontSize: 14 }}>
              ({isPositive ? '+' : ''}
              {percentChange.toFixed(2)}%)
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

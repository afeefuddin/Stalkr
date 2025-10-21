import { useMemo } from 'react';
import { SmallAvatar } from '../ui/avatar';
import { Pressable, View } from 'react-native';
import Skeleton from '../ui/skeleton';
import z from 'zod';
import { gain_loser_Schema } from '~/lib/schema';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';
import { useNavigation } from '@react-navigation/native';

export function ItemCard({
  data,
}: {
  data?: z.infer<typeof gain_loser_Schema>;
}) {
  const navigation = useNavigation<any>();
  const calculations = useMemo(() => {
    if (!data) return null;

    const isNegative = data.change_percentage.startsWith('-');
    const formattedPrice = Number.parseFloat(data.price).toFixed(2);
    const formattedAmount = Number.parseFloat(data.change_amount).toFixed(2);
    const formattedPercentage = Number.parseFloat(
      data.change_percentage,
    ).toFixed(2);
    const color = isNegative ? 'red' : 'green';
    const sign = isNegative ? '' : '+';

    return {
      isNegative,
      formattedPrice,
      formattedAmount,
      formattedPercentage,
      color,
      sign,
    };
  }, [data]);

  if (!data || !calculations) {
    return (
      <View style={{ flex: 1 }}>
        <Skeleton style={{ height: 160, borderRadius: 8 }} />
      </View>
    );
  }

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => navigation.push('StockInfo', { ticker: data.ticker })}
    >
      <View
        style={{
          backgroundColor: Colors.secondary,
          padding: 12,
          borderRadius: 12,
          height: 160,
        }}
      >
        <View style={{ justifyContent: 'space-between', height: '100%' }}>
          <View style={{ gap: 4 }}>
            <SmallAvatar name={data.ticker} />
            <Text>{data.ticker}</Text>
          </View>
          <View>
            <Text variant="lg" style={{ fontWeight: 'bold' }}>
              ${calculations.formattedPrice}
            </Text>
            <Text
              variant="sm"
              style={{
                color: calculations.color,
              }}
            >
              {calculations.sign}
              {calculations.formattedAmount} ({calculations.sign}
              {calculations.formattedPercentage}%)
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

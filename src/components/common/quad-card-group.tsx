import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';
import { z } from 'zod';
import { gain_loser_Schema } from '~/lib/schema';
import Skeleton from '../ui/skeleton';
import { useNavigation } from '@react-navigation/native';
import { ItemCard } from './item-card';


export default function QuadCardGroup({
  title,
  data,
  route,
}: {
  title: string;
  data?: z.infer<typeof gain_loser_Schema>[] | null;
  route?: string;
}) {
  const navigation = useNavigation<any>();
  const getCardData = (index: number) => {
    if (!data || data.length === 0) {
      return undefined;
    }
    if (index < data.length) {
      return data[index];
    }
    return null;
  };

  const renderCard = (index: number) => {
    const cardData = getCardData(index);

    if (cardData === null) {
      return <View style={{ flex: 1 }} />;
    }

    return <ItemCard data={cardData} />;
  };

  console.log(route)

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text variant="lg">{title}</Text>
        <Pressable
          onPress={() => {
            navigation.push('ViewAll', { path: route });
          }}
        >
          <Text variant="sm" style={{ color: Colors.primary }}>
            View all
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {renderCard(0)}
          {renderCard(1)}
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {renderCard(2)}
          {renderCard(3)}
        </View>
      </View>
    </View>
  );
}

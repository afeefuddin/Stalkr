import Feather from '@react-native-vector-icons/feather';
import { FlatList, View } from 'react-native';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import api from '~/lib/api';
import { ItemCard } from '~/components/item-card';

const displayMap = {
  top_gainers: 'Top Gainers',
  top_losers: 'Top Losers',
  most_actively_traded: 'Most Actively Traded',
};

type RouteParams = {
  path: keyof typeof displayMap;
};

export default function ViewAll() {
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;
  const { path } = params;


  const { data } = useQuery({
    queryKey: ['gainers-losers'],
    queryFn: async () => {
      const { data, error } = await api('TOP_GAINERS_LOSERS');

      console.log(error);
      return data ?? null;
    },
  });

  if (!data || !path) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.backgroundDark,
        }}
      >
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Feather name="archive" style={{ color: Colors.primary }} size={24} />
          <Text variant="lg">{displayMap[path]}</Text>
          <Text>Nothing to show here </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundDark }}>
      <View style={{ padding: 16 }}>
        <FlatList
          contentContainerStyle={{ gap: 12 }}
          data={data?.[path] ?? []}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => <ItemCard data={item} />}
          keyExtractor={(item, index) => item.ticker + index}
        />
      </View>
    </View>
  );
}

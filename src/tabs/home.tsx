import { ScrollView, View } from 'react-native';
import Colors from '~/theme/colors';

import QuadCardGroup from '~/components/quad-card-group';
import { useQuery } from '@tanstack/react-query';
import api from '~/lib/api';

export default function HomeTab() {
  const { data } = useQuery({
    queryKey: ['gainers-losers'],
    queryFn: async () => {
      const { data, error } = await api('TOP_GAINERS_LOSERS');

      console.log(error);
      return data ?? null;
    },
  });
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundDark }}>
      <ScrollView
        contentContainerStyle={{
          zIndex: 20,
        }}
      >
        <View
          style={{
            padding: 16,
            backgroundColor: Colors.backgroundDark,
            zIndex: 20,
            gap: 12,
          }}
        >
          <QuadCardGroup
            title="Top Gainers"
            data={data?.top_gainers}
            route="top_gainers"
          />
          <QuadCardGroup
            title="Top Losers"
            data={data?.top_losers}
            route="top_losers"
          />
          <QuadCardGroup
            title="Most Traded"
            data={data?.most_actively_traded}
            route="most_actively_traded"
          />
        </View>
      </ScrollView>
    </View>
  );
}

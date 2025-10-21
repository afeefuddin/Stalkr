import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';
import { getWatchlists } from '~/lib/storage';
import { SkeletonCard } from '~/components/ui/skeleton';
import useDbQuery from '~/lib/react-query/use-db-query';

export default function WatchListTab() {
  const navigation = useNavigation<any>();

  const watchlistsQuery = useDbQuery({
    queryKey: ['watchlists'],
    queryFn: getWatchlists,
  });

  if (watchlistsQuery.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.backgroundDark,
          padding: 16,
        }}
      >
        <SkeletonCard style={{ height: 80, marginBottom: 12 }} />
        <SkeletonCard style={{ height: 80, marginBottom: 12 }} />
        <SkeletonCard style={{ height: 80 }} />
      </View>
    );
  }

  const watchlists = watchlistsQuery.data ?? [];

  if (watchlists.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.backgroundDark,
          padding: 16,
        }}
      >
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Feather name="archive" style={{ color: Colors.primary }} size={48} />
          <Text weight="600" style={{ fontSize: 18 }}>
            No watchlist created yet!
          </Text>
          <Text
            style={{
              color: Colors.muted,
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            Start by adding stocks to your watchlist from the stock details page
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors.backgroundDark,
      }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={{ gap: 12 }}>
        {watchlists.map(watchlist => (
          <Pressable
            key={watchlist.name}
            onPress={() =>
              navigation.navigate('WatchlistDetail', {
                watchlistName: watchlist.name,
              })
            }
            style={({ pressed }) => ({
              backgroundColor: Colors.secondary,
              padding: 20,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View style={{ flex: 1 }}>
              <Text weight="700" style={{ fontSize: 18, marginBottom: 6 }}>
                {watchlist.name}
              </Text>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Feather name="trending-up" size={14} color={Colors.primary} />
                <Text style={{ color: Colors.muted, fontSize: 14 }}>
                  {watchlist.tickers.length}{' '}
                  {watchlist.tickers.length === 1 ? 'stock' : 'stocks'}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color={Colors.muted} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

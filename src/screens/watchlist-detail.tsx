import React from 'react';
import { View, Pressable, ScrollView, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';
import { getWatchlists, removeTicker, deleteWatchlist } from '~/lib/storage';
import { SkeletonCard } from '~/components/ui/skeleton';
import Avatar from '~/components/ui/avatar';
import useDbQuery from '~/lib/react-query/use-db-query';

export default function WatchlistDetailScreen() {
  const queryClient = useQueryClient();
  const route =
    useRoute<RouteProp<{ params: { watchlistName: string } }, 'params'>>();
  const navigation = useNavigation<any>();
  const { watchlistName } = route.params;

  const watchlistQuery = useDbQuery({
    queryKey: ['watchlist-detail', watchlistName],
    queryFn: async () => {
      const watchlists = await getWatchlists();
      return watchlists.find(w => w.name === watchlistName);
    },
  });

  console.log(watchlistQuery.isRefetching);

  const removeTickerMutation = useMutation({
    mutationFn: ({ ticker }: { ticker: string }) =>
      removeTicker(watchlistName, ticker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist-detail'] });
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
    },
  });

  const handleRemoveTicker = (ticker: string) => {
    Alert.alert('Remove Stock', `Remove ${ticker} from this watchlist?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeTickerMutation.mutate({ ticker }),
      },
    ]);
  };

  if (watchlistQuery.isLoading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.backgroundDark, padding: 16 }}
      >
        <SkeletonCard style={{ height: 100, marginBottom: 12 }} />
        <SkeletonCard style={{ height: 100, marginBottom: 12 }} />
        <SkeletonCard style={{ height: 100 }} />
      </View>
    );
  }

  if (!watchlistQuery.data) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.backgroundDark,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <Text style={{ color: Colors.muted }}>Watchlist not found</Text>
      </View>
    );
  }

  const watchlist = watchlistQuery.data;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundDark }}>
      {/* Header */}
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.1)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: Colors.muted, marginTop: 4 }}>
            {watchlist.tickers.length} stocks
          </Text>
        </View>
      </View>

      {/* Stocks List */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {watchlist.tickers.length === 0 ? (
          <View
            style={{
              padding: 48,
              alignItems: 'center',
              backgroundColor: Colors.secondary,
              borderRadius: 16,
            }}
          >
            <Feather name="inbox" size={48} color={Colors.muted} />
            <Text
              style={{
                color: Colors.muted,
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              No stocks in this watchlist yet
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {watchlist.tickers.map(ticker => (
              <Pressable
                key={ticker}
                onPress={() => navigation.navigate('StockInfo', { ticker })}
                style={({ pressed }) => ({
                  backgroundColor: Colors.secondary,
                  padding: 16,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    flex: 1,
                  }}
                >
                  <Avatar name={ticker} size={48} />
                  <View style={{ flex: 1 }}>
                    <Text weight="700" style={{ fontSize: 18 }}>
                      {ticker}
                    </Text>
                    <Text
                      style={{
                        color: Colors.muted,
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      Tap to view details
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={e => {
                    e.stopPropagation();
                    handleRemoveTicker(ticker);
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <Feather name="x" size={18} color="#ef4444" />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

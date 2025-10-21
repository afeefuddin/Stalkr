import React, { useState } from 'react';
import { View, TextInput, Pressable, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';
import {
  getWatchlists,
  createWatchlist,
  addTicker,
  removeTicker,
  getWatchlistsWithTicker,
} from '~/lib/storage';

type WatchlistSheetProps = {
  ticker: string;
  onClose: () => void;
};

export default function WatchlistSheet({
  ticker,
  onClose,
}: WatchlistSheetProps) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState('');

  // Queries
  const watchlistsQuery = useQuery({
    queryKey: ['watchlists'],
    queryFn: getWatchlists,
  });

  const tickerWatchlistsQuery = useQuery({
    queryKey: ['ticker-watchlists', ticker],
    queryFn: async () => {
      const data = await getWatchlistsWithTicker(ticker);
      setSelected(new Set(data));
      return data;
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      setNewName('');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const current = await getWatchlistsWithTicker(ticker);
      const currentSet = new Set(current);

      const toAdd = Array.from(selected).filter(name => !currentSet.has(name));
      const toRemove = current.filter(name => !selected.has(name));

      await Promise.all([
        ...toAdd.map(name => addTicker(name, ticker)),
        ...toRemove.map(name => removeTicker(name, ticker)),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      queryClient.invalidateQueries({ queryKey: ['ticker-watchlists'] });
      onClose();
    },
  });

  const toggleWatchlist = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const isLoading =
    watchlistsQuery.isLoading || tickerWatchlistsQuery.isLoading;
  const watchlists = watchlistsQuery.data ?? [];

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.backgroundDark,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: Colors.muted }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundDark }}>
      {/* Header */}
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <Text variant="xl" weight="700">
          Add to Watchlist
        </Text>
        <Text style={{ color: Colors.muted, marginTop: 4 }}>{ticker}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Create New Watchlist */}
        <View style={{ marginBottom: 24 }}>
          <Text weight="600" style={{ marginBottom: 12 }}>
            Create New Watchlist
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter watchlist name"
              placeholderTextColor={Colors.muted}
              editable={!createMutation.isPending}
              style={{
                flex: 1,
                backgroundColor: Colors.secondary,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                color: 'white',
                fontSize: 16,
              }}
              onSubmitEditing={() => createMutation.mutate(newName)}
            />
            <Pressable
              onPress={() => createMutation.mutate(newName)}
              disabled={!newName.trim() || createMutation.isPending}
              style={{
                backgroundColor:
                  !newName.trim() || createMutation.isPending
                    ? Colors.muted
                    : Colors.primary,
                borderRadius: 8,
                paddingHorizontal: 20,
                justifyContent: 'center',
              }}
            >
              <Text weight="600" style={{ color: Colors.backgroundDark }}>
                {createMutation.isPending ? '...' : 'Add'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Existing Watchlists */}
        <View>
          <Text weight="600" style={{ marginBottom: 12 }}>
            Your Watchlists
          </Text>
          {watchlists.length === 0 ? (
            <View
              style={{
                padding: 32,
                alignItems: 'center',
                backgroundColor: Colors.secondary,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: Colors.muted, textAlign: 'center' }}>
                No watchlists yet. Create one above!
              </Text>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {watchlists.map(watchlist => {
                const isSelected = selected.has(watchlist.name);
                return (
                  <Pressable
                    key={watchlist.name}
                    onPress={() => toggleWatchlist(watchlist.name)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isSelected
                        ? 'rgba(11, 165, 164, 0.15)'
                        : Colors.secondary,
                      padding: 16,
                      borderRadius: 12,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? Colors.primary : 'transparent',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text weight="600">{watchlist.name}</Text>
                      <Text
                        style={{
                          color: Colors.muted,
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {watchlist.tickers.length} stocks
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: isSelected ? Colors.primary : Colors.muted,
                        backgroundColor: isSelected
                          ? Colors.primary
                          : 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {isSelected && (
                        <Text
                          style={{
                            color: Colors.backgroundDark,
                            fontSize: 16,
                            fontWeight: 'bold',
                          }}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View
        style={{
          padding: 20,
          gap: 12,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <Pressable
          onPress={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          style={{
            backgroundColor: saveMutation.isPending
              ? Colors.muted
              : Colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text
            weight="700"
            style={{ color: Colors.backgroundDark, fontSize: 16 }}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          disabled={saveMutation.isPending}
          style={{
            backgroundColor: Colors.secondary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text weight="600" style={{ color: Colors.muted }}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

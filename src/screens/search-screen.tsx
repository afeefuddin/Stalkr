import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';
import api from '~/lib/api';
import usePersistedQuery from '~/lib/react-query/use-persisted-query';
import { queryClient } from '~/lib/react-query/queryClient';

export default function SearchScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const initialQuery = route.params?.q ?? '';

  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<TextInput | null>(null);
  // Check if cached data exists first
  const cachedResults = queryClient.getQueryData(['symbol', query]);

  const {
    data: results = cachedResults || [],
    isFetching: loading,
    refetch,
  } = usePersistedQuery({
    queryKey: ['symbol', query],
    queryFn: async () => {
      // Only fetch if no cached data exists
      if (cachedResults) return cachedResults;

      const trimmed = query.trim();
      if (!trimmed) return [];
      const { data } = await api('SYMBOL_SEARCH', { keywords: trimmed });

      if (Array.isArray((data as any)?.bestMatches)) {
        return (data as any).bestMatches;
      } else if (Array.isArray(data)) {
        return data;
      }
      return [];
    },
    enabled: !!query.trim(),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search symbol or company"
          placeholderTextColor={Colors.muted as any}
          returnKeyType="search"
          // Prevent refetch if cached data exists
          onSubmitEditing={() => {
            if (!cachedResults) {
              refetch();
            }
          }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: '#fff',
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 8,
            width: '100%',
          }}
        />
      ),
      headerStyle: { backgroundColor: Colors.backgroundDark },
    });
  }, [navigation, query, refetch, cachedResults]);

  const renderItem = ({ item }: { item: any }) => {
    const symbol = item['1. symbol'] ?? item.symbol;
    const name = item['2. name'] ?? item.name;
    return (
      <Pressable
        onPress={() => {
          if (!symbol) return;
          navigation.navigate('StockInfo', { ticker: symbol });
        }}
        style={{
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.03)',
        }}
      >
        <Text weight="600">{symbol}</Text>
        {name ? (
          <Text style={{ color: Colors.muted, marginTop: 4 }}>{name}</Text>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: Colors.backgroundDark, padding: 12 }}
    >
      {loading && (!results || results.length === 0) ? (
        <ActivityIndicator color={Colors.primary} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(i, idx) => i['1. symbol'] ?? i.symbol ?? String(idx)}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View style={{ padding: 16 }}>
              <Text style={{ color: Colors.muted }}>
                No results. Type a symbol or company and press search.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

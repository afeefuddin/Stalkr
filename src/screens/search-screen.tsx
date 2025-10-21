import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
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

export default function SearchScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const initialQuery = route.params?.q ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<TextInput | null>(null);

  const performSearch = useCallback(async (q: string) => {
    const trimmed = (q ?? '').trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await api('SYMBOL_SEARCH', { keywords: trimmed });
      let matches: any[] = [];
      if (data) {
        if (Array.isArray((data as any).bestMatches)) {
          matches = (data as any).bestMatches;
        } else if (Array.isArray(data)) {
          matches = data as any[];
        }
      }
      setResults(matches);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
          onSubmitEditing={() => performSearch(query)}
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
  }, [navigation, query, performSearch]);

  const renderItem = ({ item }: { item: any }) => {
    const symbol = item['1. symbol'] ?? item.symbol ?? item['symbol'];
    const name = item['2. name'] ?? item.name ?? item['name'];
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
      {loading && results.length === 0 ? (
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

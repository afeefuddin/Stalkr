// ~/navigation/screen-options.tsx
import React from 'react';
import Colors from '~/theme/colors';
import AddToWatchlistButton from '~/components/header/add-to-watchlist-button';
import DeleteWatchlistButton from '~/components/header/delete-watchlist-button';

export const stockInfoOptions = ({ route }: any) => {
  const { ticker } = route.params ?? {};
  return {
    headerShown: true,
    title: 'Stock Info',
    headerStyle: { backgroundColor: Colors.backgroundDark },
    headerTintColor: '#fff',
    headerRight: () => <AddToWatchlistButton ticker={ticker} />,
  };
};

export const viewAllOptions = ({ route }: any) => {
  const { path } = route.params ?? {};
  const titleMap: Record<string, string> = {
    top_gainers: 'Top Gainers',
    top_losers: 'Top Losers',
    most_actively_traded: 'Most Actively Traded',
  };
  return {
    headerShown: true,
    title: titleMap[path ?? ''] ?? 'View All',
    headerStyle: { backgroundColor: Colors.backgroundDark },
    headerTintColor: '#fff',
  };
};

export const watchlistDetailOptions = ({ route }: any) => {
  const { watchlistName } = route.params ?? {};
  return {
    headerShown: true,
    title: watchlistName,
    headerStyle: { backgroundColor: Colors.backgroundDark },
    headerTintColor: '#fff',
    headerRight: () => <DeleteWatchlistButton name={watchlistName} />,
  };
};

export const searchOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: Colors.backgroundDark },
  headerTintColor: '#fff',
};

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigator from '~/navigation/main-navigator';
import { queryClient } from '~/lib/react-query/queryClient';
import { enableQueryPersistent } from '~/lib/react-query/persistentQueryClient';

enableQueryPersistent();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <MainNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

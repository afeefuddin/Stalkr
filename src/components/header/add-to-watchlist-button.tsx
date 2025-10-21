import { Modal, Pressable } from 'react-native';
import WatchlistSheet from '../watchlist-sheet';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isInWatchlist } from '~/lib/storage';
import Colors from '~/theme/colors';
import Text from '../ui/text';
import useDbQuery from '~/lib/react-query/use-db-query';

export default function AddToWatchlistButton({ ticker }: { ticker: string }) {
  const [showWatchlistSheet, setShowWatchlistSheet] = useState(false);

  const isInWatchlistQuery = useDbQuery({
    queryKey: ['is-in-watchlist', ticker],
    queryFn: () => isInWatchlist(ticker),
  });

  return (
    <>
      <Pressable
        onPress={() => setShowWatchlistSheet(true)}
        style={{
          backgroundColor: isInWatchlistQuery.data
            ? Colors.primary
            : Colors.secondary,
          padding: 8,
          borderRadius: 12,
          borderWidth: 2,
        }}
      >
        <Text style={{ fontSize: 20 }}>
          {isInWatchlistQuery.data ? '★' : '☆'}
        </Text>
      </Pressable>

      <Modal
        visible={showWatchlistSheet}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWatchlistSheet(false)}
      >
        <WatchlistSheet
          ticker={ticker}
          onClose={() => {
            setShowWatchlistSheet(false);
            isInWatchlistQuery.refetch();
          }}
        />
      </Modal>
    </>
  );
}

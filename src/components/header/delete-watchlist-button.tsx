import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Pressable } from 'react-native';
import { deleteWatchlist } from '~/lib/storage';

export default function DeleteWatchlistButton({ name }: { name: string }) {
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();
  const deleteWatchlistMutation = useMutation({
    mutationFn: () => deleteWatchlist(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      navigation.goBack();
    },
  });

  const handleDeleteWatchlist = () => {
    Alert.alert(
      'Delete Watchlist',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWatchlistMutation.mutate(),
        },
      ],
    );
  };

  return (
    <Pressable
      onPress={handleDeleteWatchlist}
      style={{
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      }}
    >
      <Feather name="trash-2" size={20} color="#ef4444" />
    </Pressable>
  );
}

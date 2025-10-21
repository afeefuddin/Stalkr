// ~/navigation/tab-config.tsx
import React from 'react';
import { Image, View } from 'react-native';
import Feather, { FeatherIconName } from '@react-native-vector-icons/feather';
import Colors from '~/theme/colors';
import Text from '~/components/ui/text';

export const getTabIcon = (routeName: string, focused: boolean) => {
  const iconsMap: Record<string, FeatherIconName> = {
    Home: 'home',
    WatchList: 'watch',
  };
  return (
    <Feather
      name={iconsMap[routeName] ?? 'circle'}
      size={20}
      color={focused ? Colors.primary : Colors.muted}
    />
  );
};

export const renderTabHeader = (routeName: string) => (
  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
    <Image
      source={require('~/assets/logo.png')}
      style={{ width: 36, height: 36, resizeMode: 'contain', borderRadius: 8 }}
    />
    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
      {routeName}
    </Text>
  </View>
);

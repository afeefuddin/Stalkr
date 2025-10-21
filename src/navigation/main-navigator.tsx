import React, { memo } from 'react';
import { Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather';
import Colors from '~/theme/colors';
import HomeTab from '~/tabs/home';
import WatchListTab from '~/tabs/watchlist';

import StockInfoScreen from '~/screens/stock-info';
import ViewAllScreen from '~/screens/view-all';
import WatchlistDetailScreen from '~/screens/watchlist-detail';
import SearchScreen from '~/screens/search-screen';

import {
  stockInfoOptions,
  viewAllOptions,
  watchlistDetailOptions,
  searchOptions,
} from './screen-options';
import { getTabIcon, renderTabHeader } from './tab-config';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => renderTabHeader(route.name),
        headerStyle: {
          backgroundColor: Colors.backgroundDark,
          borderBottomWidth: 0,
        },
        headerTintColor: '#fff',
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
        tabBarStyle: {
          backgroundColor: Colors.secondaryBackgroundDark,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Search')}
              style={{ marginRight: 16 }}
            >
              <Feather name="search" size={20} color="#fff" />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen name="WatchList" component={WatchListTab} />
    </Tab.Navigator>
  );
}

const MainNavigator = memo(() => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="StockInfo"
        component={StockInfoScreen}
        options={stockInfoOptions}
      />
      <Stack.Screen
        name="ViewAll"
        component={ViewAllScreen}
        options={viewAllOptions}
      />
      <Stack.Screen
        name="WatchlistDetail"
        component={WatchlistDetailScreen}
        options={watchlistDetailOptions}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={searchOptions}
      />
    </Stack.Navigator>
  </NavigationContainer>
));
export default MainNavigator;

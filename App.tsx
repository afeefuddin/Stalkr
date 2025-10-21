import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Feather, FeatherIconName } from '@react-native-vector-icons/feather';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Colors from '~/theme/colors';
import HomeTab from '~/tabs/home';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import WatchListTab from '~/tabs/watchlist';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StockInfoScreen from '~/screens/stock-info';
import ViewAllScreen from '~/screens/view-all';
import WatchlistDetailScreen from '~/screens/watchlist-detail';
import DeleteWatchlistButton from '~/components/header/delete-watchlist-button';
import AddToWatchlistButton from '~/components/header/add-to-watchlist-button';
import SearchScreen from '~/screens/search-screen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const navigation = useNavigation<any>();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => (
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('./src/assets/logo.png')}
              style={{
                width: 36,
                height: 36,
                resizeMode: 'contain',
                borderRadius: 8,
              }}
            />
            <Text
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              {route.name}
            </Text>
          </View>
        ),
        headerStyle: {
          backgroundColor: Colors.backgroundDark,
          borderBottomWidth: 0,
        },
        headerTintColor: '#ffffff',
        tabBarIcon: ({ focused, color, size }) => {
          let iconsName: FeatherIconName = 'home';
          if (route.name === 'Home') {
            iconsName = 'home';
          } else if (route.name === 'WatchList') {
            iconsName = 'watch';
          }
          return (
            <Feather
              name={iconsName}
              size={20}
              style={{
                color: focused ? '#6200ee' : 'transparent',
              }}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: Colors.secondaryBackgroundDark,
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          headerRight: () => {
            return (
              <Pressable
                onPress={() => navigation.navigate('Search')}
                style={{ marginRight: 16 }}
              >
                <Feather
                  name="search"
                  size={20}
                  style={{
                    color: '#ffffff',
                  }}
                />
              </Pressable>
            );
          },
        }}
      />
      <Tab.Screen name="WatchList" component={WatchListTab} />
    </Tab.Navigator>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen
              name="StockInfo"
              component={StockInfoScreen}
              options={({ route }) => {
                const params = (route.params ?? {}) as { ticker: string };
                const { ticker } = params;

                return {
                  headerShown: true,
                  title: 'Stock Info',
                  headerStyle: { backgroundColor: Colors.backgroundDark },
                  headerTintColor: '#fff',
                  headerRight: () => <AddToWatchlistButton ticker={ticker} />,
                };
              }}
            />
            <Stack.Screen
              name="ViewAll"
              component={ViewAllScreen}
              options={({ route }) => {
                // Derive a friendly title from params or path
                const params: any = route.params ?? {};
                const { path } = params;
                const titleMap: Record<string, string> = {
                  top_gainers: 'Top Gainers',
                  top_losers: 'Top Losers',
                  most_actively_traded: 'Most Actively Traded',
                };
                const title = titleMap[path];

                return {
                  headerShown: true,
                  title,
                  headerStyle: { backgroundColor: Colors.backgroundDark },
                  headerTintColor: '#fff',
                };
              }}
            />
            <Stack.Screen
              name="WatchlistDetail"
              component={WatchlistDetailScreen}
              options={({ route }) => {
                const params = route.params as { watchlistName: string };
                const { watchlistName } = params;

                return {
                  headerShown: true,
                  title: watchlistName,
                  headerStyle: { backgroundColor: Colors.backgroundDark },
                  headerTintColor: '#fff',
                  headerRight: () => (
                    <DeleteWatchlistButton name={watchlistName} />
                  ),
                };
              }}
            />

            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={({ route }) => {
                return {
                  headerShown: true,
                  headerStyle: { backgroundColor: Colors.backgroundDark },
                  headerTintColor: '#fff',
                };
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

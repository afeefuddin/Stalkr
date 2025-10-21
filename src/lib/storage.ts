import AsyncStorage from '@react-native-async-storage/async-storage';

const NAMES_KEY = '@watchlist_names';
const watchlistKey = (name: string) => `@watchlist:${name}`;

export type Watchlist = {
  name: string;
  tickers: string[];
};

async function getNames(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(NAMES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

async function saveNames(names: string[]): Promise<void> {
  await AsyncStorage.setItem(NAMES_KEY, JSON.stringify(names));
}

// Get tickers for a specific watchlist
async function getTickers(name: string): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(watchlistKey(name));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save tickers for a specific watchlist
async function saveTickers(name: string, tickers: string[]): Promise<void> {
  await AsyncStorage.setItem(watchlistKey(name), JSON.stringify(tickers));
}

// Get all watchlists with their tickers
export async function getWatchlists(): Promise<Watchlist[]> {
  const names = await getNames();
  const watchlists = await Promise.all(
    names.map(async name => ({
      name,
      tickers: await getTickers(name),
    })),
  );
  return watchlists;
}

// Create a new watchlist
export async function createWatchlist(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;

  const names = await getNames();
  if (names.includes(trimmed)) return;

  await Promise.all([saveNames([...names, trimmed]), saveTickers(trimmed, [])]);
}

// Delete a watchlist
export async function deleteWatchlist(name: string): Promise<void> {
  const names = await getNames();
  await Promise.all([
    saveNames(names.filter(n => n !== name)),
    AsyncStorage.removeItem(watchlistKey(name)),
  ]);
}

// Add ticker to watchlist
export async function addTicker(
  watchlistName: string,
  ticker: string,
): Promise<void> {
  const clean = ticker.trim().toUpperCase();
  if (!clean) return;

  const tickers = await getTickers(watchlistName);
  if (tickers.includes(clean)) return;

  await saveTickers(watchlistName, [...tickers, clean]);
}

// Remove ticker from watchlist
export async function removeTicker(
  watchlistName: string,
  ticker: string,
): Promise<void> {
  const clean = ticker.trim().toUpperCase();
  const tickers = await getTickers(watchlistName);
  await saveTickers(
    watchlistName,
    tickers.filter(t => t !== clean),
  );
}

// Check if ticker is in any watchlist
export async function isInWatchlist(ticker: string): Promise<boolean> {
  const clean = ticker.trim().toUpperCase();
  const names = await getNames();

  for (const name of names) {
    const tickers = await getTickers(name);
    if (tickers.includes(clean)) return true;
  }

  return false;
}

// Get watchlists containing a ticker
export async function getWatchlistsWithTicker(
  ticker: string,
): Promise<string[]> {
  const clean = ticker.trim().toUpperCase();
  const names = await getNames();
  const results: string[] = [];

  for (const name of names) {
    const tickers = await getTickers(name);
    if (tickers.includes(clean)) {
      results.push(name);
    }
  }

  return results;
}
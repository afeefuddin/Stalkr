# Stalkr

A powerful React Native mobile application for tracking and monitoring stock market information. Built with TypeScript and powered by AlphaVantage API, Stalkr provides real-time stock data, customizable watchlists, and comprehensive market insights.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
# Stalkr

A React Native stock-tracking app (TypeScript). Stalkr fetches data from AlphaVantage and provides search, stock detail pages with responsive charts, and named watchlists stored locally.

---

## Table of contents
- About
- Features
- Tech stack
- Getting started
- Environment variables
- Important files
- Watchlists
- API & caching
- UI components
- Development notes
- Troubleshooting & tips

## About

Stalkr helps you search stock symbols, view company overviews and charts, and organize tickers into named watchlists that persist locally.

## Features

- Symbol/company search (AlphaVantage SYMBOL_SEARCH)
- Stock detail: company overview + timeframe selector (intraday/daily/weekly/monthly)
- Responsive line chart with pointer and sampled x-axis labels
- Multiple named watchlists; add/remove tickers per watchlist
- Persistent storage using AsyncStorage
- Lightweight skeleton loading states for better UX

## Tech stack

- React Native (v0.82)
- TypeScript
- React Navigation (stack + bottom tabs)
- @tanstack/react-query for data fetching
- AlphaVantage API for financial data
- AsyncStorage for local persistence
- react-native-gifted-charts for charts
- @gorhom/bottom-sheet for watchlist sheet UI

## Getting started

Prerequisites:
- Node >= 20
- Yarn
- Xcode (macOS) / Android Studio

Install dependencies:

```bash
cd /path/to/Stalkr
yarn install
```

iOS (macOS):

```bash
cd ios && pod install && cd ..
yarn ios
```

Android:

```bash
yarn android
```

Run the TypeScript check:

```bash
yarn tsc --noEmit
```

## Environment variables

Create a `.env` at the project root and set:

```
ALPHAVANTAGE_API_KEY=your_api_key_here
```

## What this app does (user-facing)

Stalkr is a mobile app to help you discover and follow stocks. It focuses on three core user flows:

- Search: Quickly find a stock by symbol or company name.
- Inspect: View a company overview, recent price, and an interactive chart across different timeframes (intraday/daily/weekly/monthly).
- Track: Create named watchlists and add/remove tickers so you can organize and monitor groups of stocks.

## Screens

This section lists the main screens in the app and what you can do on each.

- Home
	- Overview: The default landing tab. Shows a summary of key information, curated cards (e.g., gainers/losers), and a small chart.
	- Actions: Tap a card or chart to navigate to `Stock Info` for a deeper view.

- Watchlist
	- Overview: Lists your named watchlists. Tap a watchlist to open the `Watchlist Detail` screen.
	- Actions: Create or select a watchlist to view/add/remove tickers.

- Stock Info
	- Overview: The main detail page for a single ticker. Shows company name, sector/industry, current derived price (from timeseries), price change, and a chart.
	- Chart: Switch timeframe (intraday/daily/weekly/monthly). The chart supports pointer interaction, sampled x-axis labels, and dynamic spacing.
	- Watchlist: Use the header action to open the "Add to Watchlist" sheet and add the current ticker to any list.

- Search
	- Overview: A header text input allows searching symbols and companies. Results appear in a list as you submit a query.
	- Actions: Tap a result to navigate to `Stock Info`.

- ViewAll
	- Overview: Generic listing screen used for things like top gainers, top losers, and most actively traded lists.
	- Actions: Tap an item to navigate to its detail page.

- Watchlist Detail
	- Overview: Shows the tickers contained in the selected watchlist.
	- Actions: Remove tickers, open a ticker's `Stock Info`, or delete the watchlist (header action).

- Add to Watchlist (Bottom Sheet)
	- Overview: A modal/sheet that lists your watchlists and lets you toggle which lists the current ticker belongs to.
	- Actions: Create a new watchlist, toggle membership for the current ticker, and save changes.

Typical user scenario
1. Open the app and search for a company in the header search field.
2. Tap a search result to open the Stock Info page.
3. On the Stock Info screen, use the timeframe selector to switch between intraday, daily, weekly, and monthly charts. The chart supports a pointer and appropriately-formatted x-axis labels.
4. Tap the "Add to Watchlist" control to add the current ticker to one or multiple named watchlists, or create a new watchlist.
5. Return to the Watchlist tab to see grouped tickers and open detail pages from there.

Who this is for
- Retail investors and traders who want a compact mobile view of quotes and company info.
- Developers who want an example of integrating AlphaVantage, local persistence, and charting in React Native.

Privacy & data
- The app stores watchlists locally on the device (AsyncStorage). No watchlist data is sent to any external server by default.
- Market data is pulled from AlphaVantage; be mindful of API rate limits and consider using your own API key.

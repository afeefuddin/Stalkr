import * as z from 'zod';

export const gain_loser_Schema = z.object({
  ticker: z.string(),
  price: z.string(),
  change_amount: z.string(),
  change_percentage: z.string(),
  volume: z.string(),
});

export const apiResponseSchema = z.object({
  TOP_GAINERS_LOSERS: z.object({
    top_gainers: z.array(gain_loser_Schema),
    top_losers: z.array(gain_loser_Schema),
    most_actively_traded: z.array(gain_loser_Schema),
  }),
  SYMBOL_SEARCH: z.object({
    bestMatches: z.array(z.record(z.string(), z.string())),
  }),
  OVERVIEW: z.record(z.string(), z.string()),
  TIME_SERIES_INTRADAY: z.object({
    'Meta Data': z.record(z.string(), z.string()),
    'Time Series (5min)': z.record(
      z.string(),
      z.record(z.string(), z.string()),
    ),
  }),
  TIME_SERIES_DAILY: z.object({
    'Meta Data': z.record(z.string(), z.string()),
    'Time Series (Daily)': z.record(
      z.string(),
      z.record(z.string(), z.string()),
    ),
  }),
  TIME_SERIES_WEEKLY: z.object({
    'Meta Data': z.record(z.string(), z.string()),
    'Time Series (Weekly)': z.record(
      z.string(),
      z.record(z.string(), z.string()),
    ),
  }),
  TIME_SERIES_MONTHLY: z.object({
    'Meta Data': z.record(z.string(), z.string()),
    'Time Series (Monthly)': z.record(
      z.string(),
      z.record(z.string(), z.string()),
    ),
  }),
});

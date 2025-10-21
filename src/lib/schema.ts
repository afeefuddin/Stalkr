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
  TIME_SERIES_INTRADAY: z.record(z.string(), z.unknown()),
  TIME_SERIES_DAILY: z.record(z.string(), z.unknown()),
  TIME_SERIES_WEEKLY: z.record(z.string(), z.unknown()),
  TIME_SERIES_MONTHLY: z.record(z.string(), z.unknown()),
});

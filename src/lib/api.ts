import Config from 'react-native-config';
import * as z from 'zod';
import { apiResponseSchema } from './schema';
import { getCache, setCache } from './storage';

const randomApiKey = () => {
  const keysArray = Config.ALPHAVANTAGE_API_KEY
    ? Config.ALPHAVANTAGE_API_KEY.split(',')
    : [];
  const randomIndex = Math.floor(Math.random() * keysArray.length);
  return keysArray[randomIndex] || '';
};

type ApiResponseType<T extends keyof z.infer<typeof apiResponseSchema>> =
  z.infer<(typeof apiResponseSchema.shape)[T]>;

export default async function api<
  T extends keyof z.infer<typeof apiResponseSchema>,
>(
  func: T,
  params: Record<string, string | number> = {},
): Promise<{
  data: ApiResponseType<T> | null;
  error?: string;
  fromCache?: boolean;
}> {
  const baseUrl = 'https://www.alphavantage.co/query';
  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  const cacheKey = sortedParams ? `${func}:${sortedParams}` : String(func);

  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    try {
      const parsedCached = apiResponseSchema.shape[func].parse(
        cachedData,
      ) as ApiResponseType<T>;
      return { data: parsedCached, fromCache: true };
    } catch (err) {
      console.warn(
        `Cached data for ${func} failed schema validation, refetching.`,
      );
    }
  }

  if (!Config.ALPHAVANTAGE_API_KEY) {
    return { error: 'API key is not configured', data: null };
  }

  const urlParams = new URLSearchParams({
    function: String(func),
    apikey: randomApiKey(),
  });
  Object.entries(params).forEach(([k, v]) => urlParams.append(k, String(v)));

  try {
    const response = await fetch(`${baseUrl}?${urlParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
        data: null,
      };
    }

    const data = await response.json();

    try {
      const parsedData = apiResponseSchema.shape[func].parse(
        data,
      ) as ApiResponseType<T>;

      try {
        await setCache(cacheKey, parsedData as Record<string, unknown>);
      } catch (cacheErr) {
        console.warn(`Failed to set cache for ${cacheKey}:`, cacheErr);
      }

      return { data: parsedData };
    } catch (parseErr) {
      console.warn(`API response for ${func} failed schema parse:`, parseErr);
      return {
        error:
          parseErr instanceof Error
            ? parseErr.message
            : 'Schema validation failed',
        data: null,
      };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: null,
    };
  }
}

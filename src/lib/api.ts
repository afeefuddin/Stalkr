import Config from 'react-native-config';
import * as z from 'zod';
import { apiResponseSchema } from './schema';

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
  fromCache?: boolean;
}> {
  const baseUrl = 'https://www.alphavantage.co/query';
  if (!Config.ALPHAVANTAGE_API_KEY) {
    throw new Error('API key is not configured');
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

    console.log("we calling the api again")

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data['Information']) {
      console.log(data['Information']);
      throw new Error(data['Information'] as string);
    }

    const parsedData = apiResponseSchema.shape[func].parse(
      data,
    ) as ApiResponseType<T>;

    return { data: parsedData };
  } catch (error) {
    throw error;
  }
}

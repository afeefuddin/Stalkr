import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

export default function usePersistedQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(props: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>) {
  return useQuery({
    ...props,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 3,
  });
}

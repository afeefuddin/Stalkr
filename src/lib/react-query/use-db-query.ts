import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

export default function useDbQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(props: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>) {
  return useQuery({
    ...props,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    retry: 3,
  });
}

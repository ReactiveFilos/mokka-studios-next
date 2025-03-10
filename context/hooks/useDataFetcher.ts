import { useCallback, useState } from "react";

/**
 * useDataFetcher is a custom hook that fetches data from an API
 * Provides loading, error, and data states, exposing also setters to allow for more control / flexibility
 * @param fetcher A function that fetches data from an API
 * @returns An object with data, error, loading, and a function to fetch data
 * Variants of the hook are: useDataFetcherParams, useDataFetcherSingle 
 */

type FetcherFunction<T> = () => Promise<{ data: T | [], error: string | null }>;

export const useDataFetcher = <T extends { length?: number }>(fetcher: FetcherFunction<T>) => {
  const [data, setData] = useState<T | []>([]);
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setData([]);
    setIsEmpty(null);
    setError(null);
    setLoading(true);

    const { data, error } = await fetcher();

    if (error) {
      setData([]);
      setIsEmpty(true);
      setError(error);
      setLoading(false);
    } else if (data && data.length > 0) {
      setData(data);
      setIsEmpty(false);
      setError(null);
      setLoading(false);
    } else {
      setData([]);
      setIsEmpty(true);
      setError(null);
      setLoading(false);
    }
  }, [fetcher]);

  return {
    data,
    setData,
    isEmpty,
    setIsEmpty,
    error,
    loading,
    setLoading,
    fetchData
  };
};
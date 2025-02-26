import { useCallback, useState } from "react";

type FetcherFunction<T> = () => Promise<{ data: T | [], error: string | null }>;

export const useDataFetcher = <T extends { length?: number }>(fetcher: FetcherFunction<T>) => {
  const [data, setData] = useState<T | []>([]);
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setData([]);
    setIsEmpty(false);
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
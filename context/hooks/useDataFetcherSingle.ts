import { useCallback, useState } from "react";

type FetcherFunction<T> = () => Promise<{ data: T | null, error: string | null }>;

export const useDataFetcherSingle = <T>(fetcher: FetcherFunction<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setData(null);
    setIsEmpty(null);
    setError(null);
    setLoading(true);

    const { data, error } = await fetcher();

    if (error) {
      setData(null);
      setIsEmpty(true);
      setError(error);
      setLoading(false);
    } else if (data && data !== null && data !== undefined) {
      setData(data);
      setIsEmpty(false);
      setError(null);
      setLoading(false);
    } else {
      setData(null);
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
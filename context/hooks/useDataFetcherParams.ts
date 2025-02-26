import { useCallback, useState } from "react";

type FetcherFunction<T, P> = (params?: P) => Promise<{ data: T | [], error: string | null }>;

export const useDataFetcherParams = <T extends { length?: number }, P = void>(
  fetcher: FetcherFunction<T, P>,
  initialParams?: P
) => {
  const [data, setData] = useState<T | []>([]);
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [params, setParams] = useState<P>(initialParams);

  const fetchData = useCallback(async (newParams?: P) => {
    setData([]);
    setIsEmpty(false);
    setError(null);
    setLoading(true);

    const { data, error } = await fetcher(newParams || params);

    if (error) {
      setData([]);
      setIsEmpty(false);
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
    setParams,
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
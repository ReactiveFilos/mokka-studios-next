import { useCallback } from "react";

import { useDataFetcher } from "@/context/hooks/useDataFetcher";
import { Customer } from "@/context/types/customer.type";

import axiosInstance from "@/lib/axiosInstance";

export const useCustomers = () => {

  async function getCustomers(): Promise<{ data: Customer[] | null, error: string | null }> {
    try {
      const res = await axiosInstance.get("/api/customers");
      if (res.status === 200 && res.data) {
        return { data: res.data, error: null };
      }
      return { data: null, error: "Failed to fetch customers" };
    } catch (error) {
      return { data: null, error: "Failed to fetch customers" };
    }
  }

  const fetcher = useCallback(getCustomers, []);
  const {
    data, setData, isEmpty, setIsEmpty, error, loading, fetchData
  } = useDataFetcher<Customer[]>(fetcher);

  return {
    customers: data,
    setCustomers: setData,
    isEmptyCustomers: isEmpty,
    setIsEmptyCustomers: setIsEmpty,
    errorCustomers: error,
    loadingCustomers: loading,
    getCustomers: fetchData,
  };
};
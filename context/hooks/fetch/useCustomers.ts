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

  const updateCustomer = async (customer: Customer) => {
    try {
      const res = await axiosInstance.put(`/api/customers/${customer.id}`, customer);
      if (res.status === 200 && res.data) {
        setData(data.map((c) => c.id === customer.id ? customer : c));
      }
    } catch (error) {
      throw new Error("Failed to update customer");
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      const res = await axiosInstance.delete(`/api/customers/${id}`);
      if (res.status === 200) {
        setData(data.filter((c) => c.id !== id));
      }
    } catch (error) {
      throw new Error("Failed to delete customer");
    }
  };

  return {
    customers: data,
    setCustomers: setData,
    isEmptyCustomers: isEmpty,
    setIsEmptyCustomers: setIsEmpty,
    errorCustomers: error,
    loadingCustomers: loading,
    getCustomers: fetchData,
    updateCustomer,
    deleteCustomer
  };
};
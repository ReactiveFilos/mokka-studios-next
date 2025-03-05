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
    data, setData, isEmpty, error, loading, fetchData
  } = useDataFetcher<Customer[]>(fetcher);

  async function updateCustomer(customer: Customer): Promise<{ success: boolean, message: string }> {
    try {
      // Find if customer is local (demo purposes, as DummyJSON wouldn't support it)
      if (customer.isLocal) {
        setData(prevCustomers =>
          prevCustomers
            ? prevCustomers.map(c => c.id === customer.id ? customer : c)
            : prevCustomers
        );
        return { success: true, message: "Customer updated successfully" };
      }
      // Otherwise make API call
      const res = await axiosInstance.put(`/api/customers/${customer.id}`, customer);
      if (res.status === 200 && res.data) {
        const updatedCustomer = res.data;

        setData(prevCustomers =>
          prevCustomers
            ? prevCustomers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
            : prevCustomers
        );
        return { success: true, message: "Customer updated successfully" };
      } else {
        return { success: false, message: "Failed to update customer" };
      }
    } catch (error) {
      return { success: false, message: "Failed to update customer" };
    }
  };

  async function deleteCustomer(customer: Customer): Promise<{ success: boolean, message: string }> {
    try {
      // Find if customer is local (demo purposes, as DummyJSON wouldn't support it)
      if (customer.isLocal) {
        setData(prevCustomers => prevCustomers?.filter(c => c.id !== customer.id));
        return { success: true, message: "Customer deleted successfully" };
      }
      // Otherwise make API call
      const res = await axiosInstance.delete(`/api/customers/${customer.id}`);
      if (res.status === 200 && res.data) {
        setData(prevCustomers => prevCustomers?.filter(c => c.id !== res.data.id));
        return { success: true, message: "Customer deleted successfully" };
      } else {
        return { success: false, message: "Failed to delete customer" };
      }
    } catch (error) {
      return { success: false, message: "Failed to delete customer" };
    }
  };

  async function createCustomer(customer: Omit<Customer, "id">, id: number): Promise<{ success: boolean, message: string }> {
    try {
      const res = await axiosInstance.post("/api/customers", customer);
      if (res.status === 201 && res.data) {
        // Mark as locally created customer 
        const newCustomer = { ...res.data, id, isLocal: true };
        setData(prevCustomers => prevCustomers ? [...prevCustomers, newCustomer] : [newCustomer]);
        return { success: true, message: "Customer added successfully" };
      } else {
        return { success: false, message: "Failed to add customer" };
      }
    } catch (error) {
      return { success: false, message: "Failed to add customer" };
    }
  };

  return {
    customers: data,
    isEmptyCustomers: isEmpty,
    errorCustomers: error,
    loadingCustomers: loading,
    getCustomers: fetchData,
    updateCustomer,
    deleteCustomer,
    createCustomer
  };
};
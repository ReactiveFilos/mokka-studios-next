import { useCallback } from "react";

import { useDataFetcher } from "@/context/hooks/useDataFetcher";
import { Category } from "@/context/types/category.type";

import axiosInstance from "@/lib/axiosInstance";

export const useCategories = () => {

  async function getCategories(): Promise<{ data: Category[] | null, error: string | null }> {
    try {
      const res = await axiosInstance.get("/api/categories");
      if (res.status === 200 && res.data) {
        return { data: res.data, error: null };
      }
      return { data: null, error: "Failed to fetch categories" };
    } catch (error) {
      return { data: null, error: "Failed to fetch categories" };
    }
  }

  const fetcher = useCallback(getCategories, []);
  const {
    data, setData, isEmpty, error, loading, fetchData
  } = useDataFetcher<Category[]>(fetcher);

  async function updateCategory(category: Category): Promise<{ success: boolean, message: string }> {
    // DummyJSON doesn't support updating categories
    setData(prevCategories =>
      prevCategories
        ? prevCategories.map(c => c.id === category.id ? category : c)
        : prevCategories
    );
    return { success: true, message: "Category updated successfully" };
  };

  async function deleteCategory(category: Category): Promise<{ success: boolean, message: string }> {
    // DummyJSON doesn't support deleting categories
    setData(prevCategories => prevCategories?.filter(c => c.id !== category.id));
    return { success: true, message: "Category deleted successfully" };
  };

  async function createCategory(category: Omit<Category, "id">, id: number): Promise<{ success: boolean, message: string }> {
    // DummyJSON doesn't support creating categories
    const newCategory = { ...category, id };
    setData(prevCategories => prevCategories ? [...prevCategories, newCategory] : [newCategory]);
    return { success: true, message: "Category added successfully" };
  };

  return {
    categories: data,
    isEmptyCategories: isEmpty,
    errorCategories: error,
    loadingCategories: loading,
    getCategories: fetchData,
    updateCategory,
    deleteCategory,
    createCategory
  };
};
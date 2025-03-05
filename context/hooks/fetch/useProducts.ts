import { useCallback } from "react";

import { useDataFetcher } from "@/context/hooks/useDataFetcher";
import { Category } from "@/context/types/category.type";
import { Product } from "@/context/types/product.type";

import axiosInstance from "@/lib/axiosInstance";

export const useProducts = () => {

  async function getProducts(): Promise<{ data: Product[] | null, error: string | null }> {
    try {
      const res = await axiosInstance.get("/api/products");
      if (res.status === 200 && res.data) {
        return { data: res.data, error: null };
      }
      return { data: null, error: "Failed to fetch products" };
    } catch (error) {
      return { data: null, error: "Failed to fetch products" };
    }
  }

  const fetcher = useCallback(getProducts, []);
  const {
    data, setData, isEmpty, error, loading, fetchData
  } = useDataFetcher<Product[]>(fetcher);

  async function updateProduct(categoryId: Category["id"], product: Product): Promise<{ success: boolean, message: string }> {
    try {
      // Find if product is local (demo purposes, as DummyJSON wouldn't support it)
      if (product.isLocal) {
        setData(prevProducts =>
          prevProducts
            ? prevProducts.map(c => c.id === product.id ? product : c)
            : prevProducts
        );
        return { success: true, message: "Product updated successfully" };
      }
      // Otherwise make API call
      const res = await axiosInstance.put(`/api/products/${product.id}`, { ...product, categoryId });
      if (res.status === 200 && res.data) {
        const updatedProduct = res.data;

        setData(prevProducts =>
          prevProducts
            ? prevProducts.map(c => c.id === updatedProduct.id ? updatedProduct : c)
            : prevProducts
        );
        return { success: true, message: "Product updated successfully" };
      } else {
        return { success: false, message: "Failed to update product" };
      }
    } catch (error) {
      return { success: false, message: "Failed to update product" };
    }
  };

  async function deleteProduct(product: Product): Promise<{ success: boolean, message: string }> {
    try {
      // Find if product is local (demo purposes, as DummyJSON wouldn't support it)
      if (product.isLocal) {
        setData(prevProducts => prevProducts?.filter(c => c.id !== product.id));
        return { success: true, message: "Product deleted successfully" };
      }
      // Otherwise make API call
      const res = await axiosInstance.delete(`/api/products/${product.id}`);
      if (res.status === 200 && res.data) {
        setData(prevProducts => prevProducts?.filter(c => c.id !== res.data.id));
        return { success: true, message: "Product deleted successfully" };
      } else {
        return { success: false, message: "Failed to delete product" };
      }
    } catch (error) {
      return { success: false, message: "Failed to delete product" };
    }
  };

  async function createProduct(categoryId: Category["id"], product: Omit<Product, "id">, id: number): Promise<{ success: boolean, message: string }> {
    try {
      const res = await axiosInstance.post("/api/products", { ...product, categoryId });
      if (res.status === 201 && res.data) {
        // Mark as locally created product 
        const newProduct = { ...res.data, id, isLocal: true };
        setData(prevProducts => prevProducts ? [...prevProducts, newProduct] : [newProduct]);
        return { success: true, message: "Product added successfully" };
      } else {
        return { success: false, message: "Failed to add product" };
      }
    } catch (error) {
      return { success: false, message: "Failed to add product" };
    }
  };

  return {
    products: data,
    isEmptyProducts: isEmpty,
    errorProducts: error,
    loadingProducts: loading,
    getProducts: fetchData,
    updateProduct,
    deleteProduct,
    createProduct
  };
};
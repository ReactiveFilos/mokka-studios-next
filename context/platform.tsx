import { createContext, useContext, useMemo } from "react";

import { useCategories } from "@/context/hooks/fetch/useCategories";
import { useCustomers } from "@/context/hooks/fetch/useCustomers";
import { useProducts } from "@/context/hooks/fetch/useProducts";
import { Category } from "@/context/types/category.type";
import { Customer } from "@/context/types/customer.type";
import { Product } from "@/context/types/product.type";

type CustomersContextProps = {
  customers: Customer[] | null;
  isEmptyCustomers: boolean;
  errorCustomers: string | null;
  loadingCustomers: boolean;
  getCustomers: () => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<{ success: boolean, message: string }>;
  deleteCustomer: (customer: Customer) => Promise<{ success: boolean, message: string }>;
  createCustomer: (customer: Omit<Customer, "id">, id: number) => Promise<{ success: boolean, message: string }>;
};

const CustomersContext = createContext({} as CustomersContextProps) as React.Context<CustomersContextProps>;

export const CustomersProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    customers,
    isEmptyCustomers,
    errorCustomers,
    loadingCustomers,
    getCustomers,
    updateCustomer,
    deleteCustomer,
    createCustomer
  } = useCustomers();

  const contextValues: CustomersContextProps = useMemo(() => ({
    customers,
    isEmptyCustomers,
    errorCustomers,
    loadingCustomers,
    getCustomers,
    updateCustomer,
    deleteCustomer,
    createCustomer
  }), [
    customers,
    isEmptyCustomers,
    errorCustomers,
    loadingCustomers
  ]);
  return <CustomersContext.Provider value={contextValues}>{children}</CustomersContext.Provider>;
};

export const useCustomersContext = () => useContext(CustomersContext);

type ProductsContextProps = {
  products: Product[] | null;
  isEmptyProducts: boolean;
  errorProducts: string | null;
  loadingProducts: boolean;
  getProducts: () => Promise<void>;
  updateProduct: (categoryId: Category["id"], product: Product) => Promise<{ success: boolean, message: string }>;
  deleteProduct: (product: Product) => Promise<{ success: boolean, message: string }>;
  createProduct: (categoryId: Category["id"], product: Omit<Product, "id">, id: number) => Promise<{ success: boolean, message: string }>;

  categories: Category[] | null;
  isEmptyCategories: boolean;
  errorCategories: string | null;
  loadingCategories: boolean;
  getCategories: () => Promise<void>;
  updateCategory: (category: Category) => Promise<{ success: boolean, message: string }>;
  deleteCategory: (category: Category) => Promise<{ success: boolean, message: string }>;
  createCategory: (category: Omit<Category, "id">, id: number) => Promise<{ success: boolean, message: string }>;
};

const ProductsContext = createContext({} as ProductsContextProps) as React.Context<ProductsContextProps>;

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    products,
    isEmptyProducts,
    errorProducts,
    loadingProducts,
    getProducts,
    updateProduct,
    deleteProduct,
    createProduct
  } = useProducts();

  const {
    categories,
    isEmptyCategories,
    errorCategories,
    loadingCategories,
    getCategories,
    updateCategory,
    deleteCategory,
    createCategory
  } = useCategories();

  const contextValues: ProductsContextProps = useMemo(() => ({
    products,
    isEmptyProducts,
    errorProducts,
    loadingProducts,
    getProducts,
    updateProduct,
    deleteProduct,
    createProduct,

    categories,
    isEmptyCategories,
    errorCategories,
    loadingCategories,
    getCategories,
    updateCategory,
    deleteCategory,
    createCategory
  }), [
    products,
    isEmptyProducts,
    errorProducts,
    loadingProducts,

    categories,
    isEmptyCategories,
    errorCategories,
    loadingCategories,
  ]);

  return <ProductsContext.Provider value={contextValues}>{children}</ProductsContext.Provider>;
};

export const useProductsContext = () => useContext(ProductsContext);
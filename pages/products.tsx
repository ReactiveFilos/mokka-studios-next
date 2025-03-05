import { useCallback, useEffect, useMemo } from "react";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { usePlatform } from "@/context/platform";
import { useNextToast } from "@/context/toast";
import { Product } from "@/context/types/product.type";

import AppDiv from "@/components/app/AppDiv";
import AppText from "@/components/app/AppText";
import { TruncatedTextWithHover } from "@/components/elements/TruncatedTextWithHover";
import { DataTable } from "@/components/table/data-table";
import { createStandardColumns } from "@/components/table/data-table-columns-factory";
import { Badge } from "@/components/ui/badge";

import { CircleDollarSign, FileText, ShoppingBag, Tag } from "lucide-react";

export default function Products() {
  const { successToast, errorToast } = useNextToast();

  const {
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
    loadingCategories,
    getCategories
  } = usePlatform();

  useEffect(() => {
    if (loadingProducts) getProducts();
  }, [loadingProducts, getProducts]);

  useEffect(() => {
    if (loadingCategories) getCategories();
  }, [loadingCategories]);

  const handleEdit = useCallback(async (product: Product) => {
    const { success, message } = await updateProduct(product.categoryId, product);
    if (success) {
      successToast({ id: "ProductUpdate", message });
    } else {
      errorToast({ id: "ProductUpdate", message });
    }
  }, [updateProduct]);

  const handleDelete = useCallback(async (product: Product) => {
    const { success, message } = await deleteProduct(product);
    if (success) {
      successToast({ id: "ProductDelete", message });
    } else {
      errorToast({ id: "ProductDelete", message });
    }
  }, [deleteProduct]);

  const handleCreateProduct = useCallback(async (product: Omit<Product, "id">) => {
    /**
     * Find the highest ID in the products array and increment by 1
     * DEMO PURPOSES ONLY, DummyJSON can't give us what we need
     */
    const newProductId = products && products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const { success, message } = await createProduct(product.categoryId, product, newProductId);
    if (success) {
      successToast({ id: "ProductCreate", message });
    } else {
      errorToast({ id: "ProductCreate", message });
    }
  }, [createProduct, products]);

  const getCategoryNameById = useCallback((categoryId: number) => {
    const category = isEmptyCategories === false && categories.find(c => c.id === categoryId);
    return category ? category.name : "Unknown";
  }, [categories, isEmptyCategories]);

  const columns = useMemo(() => createStandardColumns<Product>(
    [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "title", header: "Title" },
      {
        accessorKey: "description",
        header: "Description",
        cell: info => <TruncatedTextWithHover text={info.getValue()} maxLength={80} />,
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        cell: info => getCategoryNameById(info.getValue())
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: info => `${info.getValue()?.toLocaleString("it-IT", {
          style: "currency",
          currency: "EUR",
        })}`,
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: info => {
          const tags = info.getValue() as string[];
          return (
            <div className="flex flex-wrap gap-1">
              {tags && tags.map(tag => (
                <Badge key={tag} variant="secondary" className="mr-1">
                  {tag}
                </Badge>
              ))}
            </div>
          );
        },
        meta: { disableSorting: true },
      },
    ],
    {
      entityType: "product",
      includeActions: true,
      actions: {
        onEdit: handleEdit,
        onDelete: handleDelete
      },
    }
  ), [handleEdit, handleDelete, getCategoryNameById]);

  const filterableFields = [
    { value: "title", label: "Title", icon: ShoppingBag },
    { value: "description", label: "Description", icon: FileText },
    { value: "price", label: "Price", icon: CircleDollarSign },
    { value: "tags", label: "Tags", icon: Tag },
  ];

  const memoizedProducts = useMemo(() => {
    console.log("products", products);

    if (isEmptyProducts) return <AppText size="mid" weight="bold" color="secondary">No products found</AppText>;
    if (errorProducts) return <AppText size="mid" weight="bold" color="secondary">{errorProducts}</AppText>;

    return products && (
      <DataTable
        data={products}
        columns={columns}
        isLoading={loadingProducts}
        filterableFields={filterableFields}
        entityType="product"
        tableActions={{
          onAdd: handleCreateProduct,
          addButtonLabel: "Add Product"
        }}
      />
    );
  }, [products, isEmptyProducts, errorProducts, loadingProducts, columns, handleCreateProduct]);

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      {memoizedProducts}
    </AppDiv>
  );
}

Products.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);
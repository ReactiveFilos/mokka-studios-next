import { useCallback, useEffect, useMemo } from "react";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { usePlatform } from "@/context/platform";
import { useNextToast } from "@/context/toast";
import { Category } from "@/context/types/category.type";

import AppDiv from "@/components/app/AppDiv";
import AppText from "@/components/app/AppText";
import { DataTable } from "@/components/table/data-table";
import { createStandardColumns } from "@/components/table/data-table-columns-factory";

import { File, Tag } from "lucide-react";

export default function Categories() {
  const { successToast, errorToast } = useNextToast();

  const {
    categories,
    isEmptyCategories,
    errorCategories,
    loadingCategories,
    getCategories,
    updateCategory,
    deleteCategory,
    createCategory,
    products,
    isEmptyProducts
  } = usePlatform();

  useEffect(() => {
    if (loadingCategories) getCategories();
  }, [loadingCategories, getCategories]);

  const handleEdit = useCallback(async (category: Category) => {
    const { success, message } = await updateCategory(category);
    if (success) {
      successToast({ id: "CategoryUpdate", message });
    } else {
      errorToast({ id: "CategoryUpdate", message });
    }
  }, [updateCategory]);

  const handleDelete = useCallback(async (category: Category) => {
    // Check if any products use this category
    if (products && isEmptyProducts === false && products.some(product => product.categoryId === category.id)) {
      errorToast({ id: "CategoryDelete", message: "Category is in use by products. Remove or reassign first." });
      return;
    }

    const { success, message } = await deleteCategory(category);
    if (success) {
      successToast({ id: "CategoryDelete", message });
    } else {
      errorToast({ id: "CategoryDelete", message });
    }
  }, [deleteCategory, products]);

  const handleCreateCategory = useCallback(async (category: Omit<Category, "id">) => {
    /**
     * Find the highest ID in the categories array and increment by 1
     * DEMO PURPOSES ONLY, DummyJSON can't give us what we need
     */
    const newCategoryId = categories && categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const { success, message } = await createCategory(category, newCategoryId);
    if (success) {
      successToast({ id: "CategoryCreate", message });
    } else {
      errorToast({ id: "CategoryCreate", message });
    }
  }, [createCategory, categories]);

  const columns = useMemo(() => createStandardColumns<Category>(
    [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "slug", header: "Identifier" }, // "Identifier" instead of "Slug"
    ],
    {
      entityType: "category",
      includeActions: true,
      actions: {
        onEdit: handleEdit,
        onDelete: handleDelete
      },
    }
  ), [handleEdit, handleDelete]);

  const filterableFields = [
    { value: "name", label: "Name", icon: Tag },
    { value: "slug", label: "Identifier", icon: File },
  ];

  const memoizedCategories = useMemo(() => {
    if (isEmptyCategories) return <AppText size="mid" weight="bold" color="secondary">No categories found</AppText>;
    if (errorCategories) return <AppText size="mid" weight="bold" color="secondary">{errorCategories}</AppText>;

    return categories && (
      <DataTable
        data={categories}
        columns={columns}
        isLoading={loadingCategories}
        filterableFields={filterableFields}
        entityType="category"
        tableActions={{
          onAdd: handleCreateCategory,
          addButtonLabel: "Add Category"
        }}
      />
    );
  }, [categories, isEmptyCategories, errorCategories, loadingCategories, columns, handleCreateCategory]);

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      {memoizedCategories}
    </AppDiv>
  );
}

Categories.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);
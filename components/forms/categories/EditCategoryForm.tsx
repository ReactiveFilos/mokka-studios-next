import { Category } from "@/context/types/category.type";

import BaseCategoryForm, { CategoryFormValues } from "@/components/forms/categories/BaseCategoryForm";

interface EditCategoryFormProps {
  category: Category;
  onSubmit: (data: Category) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export default function EditCategoryForm({ category, onSubmit, onCancel, className = "" }: EditCategoryFormProps) {
  const defaultValues: CategoryFormValues = {
    name: category.name,
    slug: category.slug,
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    const updatedCategory: Category = {
      ...category,
      name: values.name,
      slug: values.slug,
    };

    await onSubmit(updatedCategory);
  };

  return (
    <BaseCategoryForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      mode="edit"
      className={className}
    />
  );
}
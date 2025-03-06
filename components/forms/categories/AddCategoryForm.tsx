import { Category } from "@/context/types/category.type";

import BaseCategoryForm, { CategoryFormValues } from "@/components/forms/categories/BaseCategoryForm";

interface AddCategoryFormProps {
  onSubmit: (data: Omit<Category, "id">) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export default function AddCategoryForm({ onSubmit, onCancel, className = "" }: AddCategoryFormProps) {
  const defaultValues: CategoryFormValues = {
    name: "",
    slug: "",
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    const categoryData: Omit<Category, "id"> = {
      name: values.name,
      slug: values.slug,
    };

    await onSubmit(categoryData);
  };

  return (
    <BaseCategoryForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      mode="add"
      className={className}
    />
  );
}
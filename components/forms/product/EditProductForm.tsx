import { Product } from "@/context/types/product.type";

import BaseProductForm, { ProductFormValues } from "@/components/forms/product/BaseProductForm";

interface EditProductFormProps {
  product: Product;
  onSubmit: (data: Product) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export default function EditProductForm({ product, onSubmit, onCancel, className = "" }: EditProductFormProps) {
  // Convert array of tags to comma-separated string for the form
  const defaultValues: ProductFormValues = {
    title: product.title,
    description: product.description,
    categoryId: product.categoryId,
    price: product.price || undefined,
    image: product.image || "",
    tags: product.tags ? product.tags.join(", ") : "",
  };

  const handleSubmit = async (values: ProductFormValues) => {
    const updatedProduct: Product = {
      ...product,
      title: values.title,
      description: values.description,
      categoryId: values.categoryId,
      price: values.price ?? 0,
      image: values.image || "",
      tags: values.tags ? values.tags.split(",").map(tag => tag.trim().toLocaleLowerCase()).filter(Boolean) : [],
    };

    await onSubmit(updatedProduct);
  };

  return (
    <BaseProductForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      mode="edit"
      className={className}
    />
  );
}
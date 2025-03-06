import { Product } from "@/context/types/product.type";

import BaseProductForm, { ProductFormValues } from "@/components/forms/product/BaseProductForm";

interface AddProductFormProps {
  onSubmit: (data: Omit<Product, "id">) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export default function AddProductForm({ onSubmit, onCancel, className = "" }: AddProductFormProps) {
  const defaultValues: ProductFormValues = {
    title: "",
    description: "",
    categoryId: 0,
    price: 0,
    image: "",
    tags: "",
  };

  const handleSubmit = async (values: ProductFormValues) => {
    // Transform form data to Product format, processing tags from comma-separated string
    const productData: Omit<Product, "id"> = {
      title: values.title,
      description: values.description,
      categoryId: values.categoryId,
      price: values.price,
      image: values.image || "",
      tags: values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
    };

    await onSubmit(productData);
  };

  return (
    <BaseProductForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      mode="add"
      className={className}
    />
  );
}
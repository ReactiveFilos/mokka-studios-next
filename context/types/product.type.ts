import { Category, getCategoryIdBySlug } from "@/context/types/category.type";

export type Product = {
  id: number;
  title: string;
  description: string;
  categoryId: number; // not in DummyJSON
  price: number;
  image: string; // thumbnail in DummyJSON
  tags: string[];
  isLocal?: boolean;
};

/**
 * Maps DummyJSON product data to our Product type
 */
export function mapToProductWithCategoryId(categoryId: string, product: any): Product {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    categoryId: Number(categoryId),
    price: product.price,
    image: product.image,
    tags: product.tags
  };
}

function mapToProductWithCategory(categories: Category[], product: any): Product {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    categoryId: getCategoryIdBySlug(categories, product.category),
    price: product.price,
    image: product.thumbnail,
    tags: product.tags
  };
}

/**
 * Maps an array of DummyJSON products to our Product type
 */
export function mapToProductsWithCategories(categories: Category[], products: any[]): Product[] {
  return products.map(product => mapToProductWithCategory(categories, product));
}


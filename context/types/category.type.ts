export type Category = {
  id: number;
  slug: string;
  name: string;
}

/**
 * Maps DummyJSON category data to our Category type
 */
function mapToCategory(index: number, category: any): Category {
  return {
    id: index + 1,
    slug: category.slug,
    name: category.name
  };
}

/**
 * Maps an array of DummyJSON categories to our Category type
 */
export function mapToCategories(categories: any[]): Category[] {
  return categories.map((category, index) => mapToCategory(index, category));
}

export function getCategoryIdBySlug(categories: Category[], slug: string): number {
  const category = categories.find(c => c.slug === slug);
  return category ? category.id : -1;
}

/**
 * Data for DummyJSON products categories
[
  {
    "slug": "beauty",
    "name": "Beauty",
    "url": "https://dummyjson.com/products/category/beauty"
  },
  {
    "slug": "fragrances",
    "name": "Fragrances",
    "url": "https://dummyjson.com/products/category/fragrances"
  },
  {
    "slug": "furniture",
    "name": "Furniture",
    "url": "https://dummyjson.com/products/category/furniture"
  },
  {...},
  {...},
  {...}
  // more items
]
*/
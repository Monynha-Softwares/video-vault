import type { Category } from '@/entities/category/category.types';

export type CategoryFlyweight = Readonly<Category>;

const categoryCache = new Map<string, CategoryFlyweight>();

function createFlyweight(category: Category): CategoryFlyweight {
  return Object.freeze({ ...category });
}

export function preloadCategories(categories: Category[]): CategoryFlyweight[] {
  return categories.map((category) => {
    const existing = categoryCache.get(category.id);
    if (existing) {
      return existing;
    }
    const flyweight = createFlyweight(category);
    categoryCache.set(category.id, flyweight);
    return flyweight;
  });
}

export function getCategoryById(categoryId: string | null | undefined): CategoryFlyweight | undefined {
  if (!categoryId) {
    return undefined;
  }
  return categoryCache.get(categoryId);
}

export function resetCategoryFlyweights() {
  categoryCache.clear();
}

import { describe, expect, it, beforeEach } from 'vitest';
import { getCategoryById, preloadCategories, resetCategoryFlyweights } from './CategoryFlyweight';

const categoryA = {
  id: 'cat-a',
  name: 'Frontend',
  slug: 'frontend',
  icon: 'BookOpen',
  color: '#111111',
  created_at: new Date().toISOString(),
};

const categoryB = {
  id: 'cat-b',
  name: 'Backend',
  slug: 'backend',
  icon: 'Globe',
  color: '#222222',
  created_at: new Date().toISOString(),
};

describe('CategoryFlyweight', () => {
  beforeEach(() => {
    resetCategoryFlyweights();
  });

  it('returns the same instance for the same key', () => {
    const [first] = preloadCategories([categoryA]);
    const second = getCategoryById(categoryA.id);

    expect(first).toBe(second);
  });

  it('returns different instances for different keys', () => {
    const [first, second] = preloadCategories([categoryA, categoryB]);

    expect(first).not.toBe(second);
  });

  it('freezes category flyweights', () => {
    const [first] = preloadCategories([categoryA]);

    expect(Object.isFrozen(first)).toBe(true);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryCard } from './CategoryCard';

const getIconMock = vi.fn(() => () => <svg data-testid="category-icon" />);

vi.mock('@/flyweights/IconFactory', () => ({
  getIcon: (name: string) => getIconMock(name),
}));

describe('CategoryCard flyweight usage', () => {
  it('requests the icon from the IconFactory', () => {
    render(
      <CategoryCard
        category={{
          id: 'cat-1',
          name: 'Frontend',
          slug: 'frontend',
          icon: 'BookOpen',
          color: '#000000',
          created_at: new Date().toISOString(),
        }}
        videoCount={3}
      />,
    );

    expect(getIconMock).toHaveBeenCalledWith('BookOpen');
    expect(screen.getByTestId('category-icon')).toBeInTheDocument();
  });
});

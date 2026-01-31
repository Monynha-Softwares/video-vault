import { describe, expect, it, beforeEach } from 'vitest';
import { getIcon, resetIconFactoryCache } from './IconFactory';

describe('IconFactory', () => {
  beforeEach(() => {
    resetIconFactoryCache();
  });

  it('returns the same instance for the same key', () => {
    const first = getIcon('Play');
    const second = getIcon('Play');

    expect(first).toBe(second);
  });

  it('returns different instances for different keys', () => {
    const play = getIcon('Play');
    const search = getIcon('Search');

    expect(play).not.toBe(search);
  });

  it('returns immutable icon instances', () => {
    const icon = getIcon('Play');

    expect(Object.isFrozen(icon)).toBe(true);
  });
});

import { describe, expect, it, beforeEach } from 'vitest';
import { getStyle, resetStyleFlyweights } from './StyleFlyweight';

describe('StyleFlyweight', () => {
  beforeEach(() => {
    resetStyleFlyweights();
  });

  it('returns the same instance for the same key', () => {
    const first = getStyle('navLink');
    const second = getStyle('navLink');

    expect(first).toBe(second);
  });

  it('returns different instances for different keys', () => {
    const navLink = getStyle('navLink');
    const sectionTitle = getStyle('sectionTitle');

    expect(navLink).not.toBe(sectionTitle);
  });

  it('returns immutable style flyweights', () => {
    const style = getStyle('navLink');

    expect(Object.isFrozen(style)).toBe(true);
  });
});

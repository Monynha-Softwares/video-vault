import { describe, expect, it, beforeEach } from 'vitest';
import { getLanguage, resetLanguageFlyweights } from './LanguageFlyweight';

describe('LanguageFlyweight', () => {
  beforeEach(() => {
    resetLanguageFlyweights();
  });

  it('returns the same instance for the same key', () => {
    const first = getLanguage('en');
    const second = getLanguage('en');

    expect(first).toBe(second);
  });

  it('returns different instances for different keys', () => {
    const english = getLanguage('en');
    const portuguese = getLanguage('pt');

    expect(english).not.toBe(portuguese);
  });

  it('returns immutable language flyweights', () => {
    const language = getLanguage('en');

    expect(Object.isFrozen(language)).toBe(true);
  });
});

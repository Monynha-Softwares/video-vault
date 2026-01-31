import { describe, expect, it, beforeEach } from 'vitest';
import { getRole, resetRoleFlyweights } from './RoleFlyweight';

describe('RoleFlyweight', () => {
  beforeEach(() => {
    resetRoleFlyweights();
  });

  it('returns the same instance for the same key', () => {
    const first = getRole('editor');
    const second = getRole('editor');

    expect(first).toBe(second);
  });

  it('returns different instances for different keys', () => {
    const editor = getRole('editor');
    const viewer = getRole('viewer');

    expect(editor).not.toBe(viewer);
  });

  it('returns immutable role flyweights', () => {
    const role = getRole('editor');

    expect(Object.isFrozen(role)).toBe(true);
  });
});

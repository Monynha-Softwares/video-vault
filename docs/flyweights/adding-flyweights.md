# How to Add a New Flyweight

Follow this checklist to keep the architecture consistent and AI-friendly.

## 1) Create a new flyweight module

Add a file under `src/flyweights/`:

```ts
// src/flyweights/MyFlyweight.ts
export type MyFlyweight = Readonly<{ id: string; ... }>;

const registry = Object.freeze({
  key: Object.freeze({ id: 'key', ... }),
});

const cache = new Map<string, MyFlyweight>();

export function getMyFlyweight(key: keyof typeof registry): MyFlyweight {
  const cached = cache.get(key);
  if (cached) return cached;

  const resolved = registry[key];
  cache.set(key, resolved);
  return resolved;
}
```

## 2) Expose a factory API

All usage should flow through a **factory function**, not direct imports of raw data.

Examples:
- `getIcon(name)`
- `getLanguage(code)`
- `getRole(roleId)`
- `getStyle(styleId)`

## 3) Freeze shared objects

Use `Object.freeze` on registry items and/or returned values. This makes immutability explicit and testable.

## 4) Add tests

Each flyweight must have unit tests:
- Same key returns same instance
- Different keys return different instances
- Objects are immutable (`Object.isFrozen`)

Place tests in `src/flyweights/*.test.ts`.

## 5) Update docs (if needed)

If the flyweight is a new category of shared data, document it in the README and the flyweight docs.

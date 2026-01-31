# Why Global Mutable State Is Forbidden

Global mutable state makes large codebases unpredictable, especially for long-term maintenance and AI-driven refactors.

## Problems it creates

- **Hidden coupling** between unrelated features
- **Non-deterministic UI** (state changes from anywhere)
- **Debugging chaos** due to action-at-a-distance
- **Unreliable tests** and brittle mocks

## What to do instead

- Use **flyweights** for immutable, shared objects.
- Use **React state** (`useState`, `useReducer`) for local UI state.
- Use **TanStack Query** for server state.

## The Flyweight Rule

Global caches are allowed **only** when:

1. The data is immutable
2. It is centrally owned by a factory module
3. It is frozen and cached explicitly

If any of these conditions are false, the data is **not** a flyweight and must not be global.

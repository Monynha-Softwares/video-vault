# Intrinsic vs. Extrinsic State (Flyweight Primer)

Flyweights exist to **share immutable, intrinsic state** across the application. Everything that changes per user, per video, or per UI interaction must stay **extrinsic** (passed at runtime).

## Intrinsic (shared, cached, immutable)

Use flyweights for:

- Icons (lucide-react)
- Category metadata (name, color, icon)
- Language definitions (codes + display labels)
- Collaborator roles (owner/editor/viewer)
- Base Tailwind class tokens (repeatable class strings)

These values are **single-source-of-truth**, stored under `src/flyweights/`, frozen, and cached.

## Extrinsic (contextual, passed at runtime)

Never store these in a flyweight:

- Video title, description, duration, views
- Component variants (compact vs default)
- Hover/selection state
- Per-user flags or permissions
- Dynamic labels and counters

Extrinsic state stays in components, hooks, or query results.

## Rule of Thumb

If it never changes and appears in multiple places, it’s a flyweight.  
If it changes per render, user, or route, it stays outside.

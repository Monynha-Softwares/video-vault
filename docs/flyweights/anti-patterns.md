# Flyweight Anti-Patterns (Avoid These)

## ❌ Direct icon imports in components
**Bad**
```ts
import { ArrowLeft } from 'lucide-react';
```

**Good**
```ts
import { getIcon } from '@/flyweights/IconFactory';
const ArrowLeftIcon = getIcon('ArrowLeft');
```

---

## ❌ Duplicating immutable definitions
Hardcoding language codes, roles, or class strings in multiple files defeats the purpose of flyweights.

**Use the flyweights instead:**
- `getLanguage('pt')`
- `getRole('editor')`
- `getStyle('navLink')`

---

## ❌ Mutating flyweight objects
Flyweights are immutable. If you find yourself changing their properties, the data is probably **extrinsic**, not intrinsic.

---

## ❌ Embedding business logic in flyweights
Flyweights are infrastructure helpers. Any conditional or domain logic belongs in features, hooks, or components.

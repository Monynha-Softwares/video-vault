export type StyleFlyweight = Readonly<{
  id: string;
  className: string;
}>;

const styleRegistry = Object.freeze({
  navLink: Object.freeze({
    id: 'navLink',
    className: 'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
  }),
  sectionTitle: Object.freeze({
    id: 'sectionTitle',
    className: 'text-2xl md:text-3xl font-bold',
  }),
  sectionDescription: Object.freeze({
    id: 'sectionDescription',
    className: 'text-muted-foreground mt-1',
  }),
  mutedText: Object.freeze({
    id: 'mutedText',
    className: 'text-sm text-muted-foreground',
  }),
  mutedIcon: Object.freeze({
    id: 'mutedIcon',
    className: 'text-muted-foreground',
  }),
});

export type StyleId = keyof typeof styleRegistry;

const styleCache = new Map<string, StyleFlyweight>();

export function getStyle(styleId: StyleId): StyleFlyweight {
  const cached = styleCache.get(styleId);
  if (cached) {
    return cached;
  }
  const resolved = styleRegistry[styleId];
  styleCache.set(styleId, resolved);
  return resolved;
}

export function resetStyleFlyweights() {
  styleCache.clear();
}

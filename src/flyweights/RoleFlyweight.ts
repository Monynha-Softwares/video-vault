const roleRegistry = Object.freeze({
  owner: Object.freeze({ id: 'owner', label: 'Owner' }),
  editor: Object.freeze({ id: 'editor', label: 'Editor' }),
  viewer: Object.freeze({ id: 'viewer', label: 'Viewer' }),
});

export type RoleId = keyof typeof roleRegistry;

export type RoleFlyweight = Readonly<{
  id: RoleId;
  label: string;
}>;

const roleCache = new Map<string, RoleFlyweight>();

export function getRole(roleId: RoleId): RoleFlyweight {
  const cached = roleCache.get(roleId);
  if (cached) {
    return cached;
  }
  const resolved = roleRegistry[roleId];
  roleCache.set(roleId, resolved);
  return resolved;
}

export function resetRoleFlyweights() {
  roleCache.clear();
}

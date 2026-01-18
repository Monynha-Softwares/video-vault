export const userSocialAccountKeys = {
  all: ['userSocialAccounts'] as const,
  lists: () => [...userSocialAccountKeys.all, 'list'] as const,
  list: (userId: string) => [...userSocialAccountKeys.lists(), userId] as const,
  details: () => [...userSocialAccountKeys.all, 'detail'] as const,
  detail: (id: string) => [...userSocialAccountKeys.details(), id] as const,
};
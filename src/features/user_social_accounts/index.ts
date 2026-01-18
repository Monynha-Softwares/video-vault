export type { UserSocialAccount, UserSocialAccountInsert, UserSocialAccountUpdate } from '@/entities/user_social_account/user_social_account.types';
export {
  useUserSocialAccounts,
  useCreateUserSocialAccount,
  useUpdateUserSocialAccount,
  useDeleteUserSocialAccount,
} from './queries/useUserSocialAccounts';
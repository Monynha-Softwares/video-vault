import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  submissions_count: number;
  created_at: string; // This serves as the join_date
  updated_at: string;
}

// Hook to fetch a profile by user ID
export function useProfileById(userId: string | undefined) {
  return useQuery<Profile, Error>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });
}

// Hook to fetch a profile by username (slug)
export function useProfileByUsername(username: string | undefined) {
  return useQuery<Profile, Error>({
    queryKey: ['profileByUsername', username],
    queryFn: async () => {
      if (!username) throw new Error('Username is required');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!username,
  });
}

// Hook to update an authenticated user's profile
export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, Partial<Omit<Profile, 'id' | 'created_at' | 'submissions_count'>>>({
    mutationFn: async (updatedProfileData) => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedProfileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (updatedProfile) => {
      toast.success('Perfil atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['profileByUsername', updatedProfile.username] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar perfil', { description: error.message });
    },
  });
}
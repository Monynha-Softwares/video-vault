import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlaylistCollaborator } from './types';

export function usePlaylistCollaborators(playlistId: string | undefined) {
  return useQuery<PlaylistCollaborator[], Error>({
    queryKey: ['playlist-collaborators', playlistId],
    queryFn: async () => {
      if (!playlistId) return [];

      const { data, error } = await supabase
        .from('playlist_collaborators')
        .select(`
          *,
          profile:profiles!playlist_collaborators_user_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('playlist_id', playlistId);

      if (error) throw error;

      return (data || []).map((c: any) => ({
        ...c,
        profile: c.profile,
      })) as PlaylistCollaborator[];
    },
    enabled: !!playlistId,
  });
}

export function useAddCollaborator() {
  const queryClient = useQueryClient();

  return useMutation<PlaylistCollaborator, Error, { playlistId: string; userId: string; role?: 'editor' | 'viewer' }>({
    mutationFn: async ({ playlistId, userId, role = 'editor' }) => {
      const { data, error } = await supabase
        .from('playlist_collaborators')
        .insert({
          playlist_id: playlistId,
          user_id: userId,
          role,
        })
        .select()
        .single();

      if (error) throw error;
      return data as PlaylistCollaborator;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-collaborators', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Collaborator added!');
    },
    onError: (error) => {
      toast.error('Failed to add collaborator', { description: error.message });
    },
  });
}

export function useUpdateCollaboratorRole() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { playlistId: string; userId: string; role: 'editor' | 'viewer' }>({
    mutationFn: async ({ playlistId, userId, role }) => {
      const { error } = await supabase
        .from('playlist_collaborators')
        .update({ role })
        .eq('playlist_id', playlistId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-collaborators', variables.playlistId] });
      toast.success('Collaborator role updated!');
    },
    onError: (error) => {
      toast.error('Failed to update collaborator role', { description: error.message });
    },
  });
}

export function useRemoveCollaborator() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { playlistId: string; userId: string }>({
    mutationFn: async ({ playlistId, userId }) => {
      const { error } = await supabase
        .from('playlist_collaborators')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-collaborators', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Collaborator removed!');
    },
    onError: (error) => {
      toast.error('Failed to remove collaborator', { description: error.message });
    },
  });
}
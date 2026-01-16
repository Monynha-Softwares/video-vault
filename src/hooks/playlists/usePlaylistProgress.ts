import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { PlaylistProgress } from './types';

export function usePlaylistProgress(playlistId: string | undefined) {
  const { user } = useAuth();

  return useQuery<PlaylistProgress[], Error>({
    queryKey: ['playlist-progress', playlistId, user?.id],
    queryFn: async () => {
      if (!playlistId || !user?.id) return [];

      const { data, error } = await supabase
        .from('playlist_progress')
        .select('*')
        .eq('playlist_id', playlistId)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as PlaylistProgress[];
    },
    enabled: !!playlistId && !!user?.id,
  });
}

export function useMarkVideoWatched() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<PlaylistProgress, Error, { playlistId: string; videoId: string; watched: boolean; lastPositionSeconds?: number }>({
    mutationFn: async ({ playlistId, videoId, watched, lastPositionSeconds = 0 }) => {
      if (!user?.id) throw new Error('Must be logged in to track progress');

      const { data, error } = await supabase
        .from('playlist_progress')
        .upsert({
          playlist_id: playlistId,
          user_id: user.id,
          video_id: videoId,
          watched,
          watched_at: watched ? new Date().toISOString() : null,
          last_position_seconds: lastPositionSeconds,
        }, {
          onConflict: 'playlist_id,user_id,video_id',
        })
        .select()
        .single();

      if (error) throw error;
      return data as PlaylistProgress;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-progress', variables.playlistId, user?.id] });
      toast.success(variables.watched ? 'Video marked as watched!' : 'Video marked as unwatched!');
    },
    onError: (error) => {
      toast.error('Failed to update video progress', { description: error.message });
    },
  });
}
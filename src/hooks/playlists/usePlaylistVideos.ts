import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { PlaylistVideo } from './types';

export function usePlaylistVideos(playlistId: string | undefined) {
  return useQuery<PlaylistVideo[], Error>({
    queryKey: ['playlist-videos', playlistId],
    queryFn: async () => {
      if (!playlistId) return [];

      const { data, error } = await supabase
        .from('playlist_videos')
        .select(`
          *,
          video:videos!playlist_videos_video_id_fkey(id, title, youtube_id, thumbnail_url, channel_name, duration_seconds)
        `)
        .eq('playlist_id', playlistId)
        .order('position', { ascending: true });

      if (error) throw error;

      return (data || []).map((pv: PlaylistVideo) => ({
        ...pv,
        video: pv.video,
      })) as PlaylistVideo[];
    },
    enabled: !!playlistId,
  });
}

export function useAddVideoToPlaylist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<PlaylistVideo, Error, { playlistId: string; videoId: string; notes?: string }>({
    mutationFn: async ({ playlistId, videoId, notes }) => {
      // Get the max position
      const { data: existingVideos } = await supabase
        .from('playlist_videos')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = existingVideos && existingVideos.length > 0 ? existingVideos[0].position + 1 : 0;

      const { data, error } = await supabase
        .from('playlist_videos')
        .insert({
          playlist_id: playlistId,
          video_id: videoId,
          position: nextPosition,
          added_by: user?.id || null,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as PlaylistVideo;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-videos', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] }); // To update video_count
      queryClient.invalidateQueries({ queryKey: ['playlists'] }); // To update video_count in list
      toast.success('Video added to playlist!');
    },
    onError: (error) => {
      toast.error('Failed to add video to playlist', { description: error.message });
    },
  });
}

export function useRemoveVideoFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { playlistId: string; videoId: string }>({
    mutationFn: async ({ playlistId, videoId }) => {
      const { error } = await supabase
        .from('playlist_videos')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('video_id', videoId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-videos', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] }); // To update video_count
      queryClient.invalidateQueries({ queryKey: ['playlists'] }); // To update video_count in list
      toast.success('Video removed from playlist!');
    },
    onError: (error) => {
      toast.error('Failed to remove video from playlist', { description: error.message });
    },
  });
}

export function useReorderPlaylistVideos() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { playlistId: string; orderedVideoIds: string[] }>({
    mutationFn: async ({ playlistId, orderedVideoIds }) => {
      const updates = orderedVideoIds.map((videoId, index) =>
        supabase
          .from('playlist_videos')
          .update({ position: index })
          .eq('playlist_id', playlistId)
          .eq('video_id', videoId)
      );

      const results = await Promise.all(updates);

      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(errors.map(e => e.error?.message).join(', '));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-videos', variables.playlistId] });
      toast.success('Playlist reordered successfully!');
    },
    onError: (error) => {
      toast.error('Failed to reorder playlist', { description: error.message });
    },
  });
}
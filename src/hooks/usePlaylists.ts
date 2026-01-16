import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// ==================== TYPE DEFINITIONS ====================

export interface Playlist {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  author_id: string;
  thumbnail_url: string | null;
  course_code: string | null;
  unit_code: string | null;
  language: string;
  is_public: boolean;
  is_ordered: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  video_count?: number;
}

export interface PlaylistVideo {
  id: string;
  playlist_id: string;
  video_id: string;
  position: number;
  added_by: string | null;
  notes: string | null;
  created_at: string;
  // Joined video data
  video?: {
    id: string;
    title: string;
    youtube_id: string;
    thumbnail_url: string;
    channel_name: string;
    duration_seconds: number | null;
  } | null;
}

export interface PlaylistCollaborator {
  id: string;
  playlist_id: string;
  user_id: string;
  role: 'editor' | 'viewer';
  invited_at: string;
  // Joined profile data
  profile?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface PlaylistProgress {
  id: string;
  playlist_id: string;
  user_id: string;
  video_id: string;
  watched: boolean;
  watched_at: string | null;
  last_position_seconds: number;
  created_at: string;
  updated_at: string;
}

// ==================== PLAYLIST HOOKS ====================

interface UsePlaylistsOptions {
  authorId?: string;
  isPublic?: boolean;
  searchQuery?: string;
  enabled?: boolean;
  filter?: 'all' | 'my' | 'collaborating';
}

export function usePlaylists(options: UsePlaylistsOptions = {}) {
  const { user } = useAuth();
  const { authorId, isPublic, searchQuery, enabled = true, filter = 'all' } = options;

  return useQuery({
    queryKey: ['playlists', { authorId, isPublic, searchQuery, filter, userId: user?.id }],
    queryFn: async () => {
      let query = supabase
        .from('playlists')
        .select(`
          *,
          author:profiles!playlists_author_id_fkey(id, username, display_name, avatar_url),
          playlist_videos(count)
        `)
        .order('created_at', { ascending: false });

      if (authorId) {
        query = query.eq('author_id', authorId);
      }

      if (isPublic !== undefined) {
        query = query.eq('is_public', isPublic);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Filter by ownership or collaboration
      if (filter === 'my' && user?.id) {
        query = query.eq('author_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      // For collaborating filter, we need to check collaborators table
      let result = (data || []).map((playlist: any) => ({
        ...playlist,
        author: playlist.author,
        video_count: playlist.playlist_videos?.[0]?.count || 0,
      })) as Playlist[];

      // If filtering by collaborating, fetch collaborator playlists
      if (filter === 'collaborating' && user?.id) {
        const { data: collabData } = await supabase
          .from('playlist_collaborators')
          .select('playlist_id')
          .eq('user_id', user.id);

        const collabPlaylistIds = (collabData || []).map(c => c.playlist_id);
        result = result.filter(p => collabPlaylistIds.includes(p.id));
      }

      return result;
    },
    enabled,
  });
}

export function usePlaylistById(id: string | undefined) {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      if (!id) throw new Error('Playlist ID is required');

      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          author:profiles!playlists_author_id_fkey(id, username, display_name, avatar_url),
          playlist_videos(count)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        author: data.author,
        video_count: (data as any).playlist_videos?.[0]?.count || 0,
      } as Playlist;
    },
    enabled: !!id,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (playlist: Omit<Playlist, 'id' | 'author_id' | 'created_at' | 'updated_at' | 'author' | 'video_count'>) => {
      if (!user) throw new Error('Must be logged in to create a playlist');

      const { data, error } = await supabase
        .from('playlists')
        .insert({
          ...playlist,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Playlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlist: Partial<Omit<Playlist, 'author_id' | 'created_at' | 'author' | 'video_count'>> & { id: string }) => {
      const { data, error } = await supabase
        .from('playlists')
        .update({
          name: playlist.name,
          slug: playlist.slug,
          description: playlist.description,
          thumbnail_url: playlist.thumbnail_url,
          course_code: playlist.course_code,
          unit_code: playlist.unit_code,
          language: playlist.language,
          is_public: playlist.is_public,
          is_ordered: playlist.is_ordered,
        })
        .eq('id', playlist.id)
        .select()
        .single();

      if (error) throw error;
      return data as Playlist;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      queryClient.invalidateQueries({ queryKey: ['playlist', data.id] });
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlistId: string) => {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

// ==================== PLAYLIST VIDEOS HOOKS ====================

export function usePlaylistVideos(playlistId: string | undefined) {
  return useQuery({
    queryKey: ['playlist-videos', playlistId],
    queryFn: async () => {
      if (!playlistId) throw new Error('Playlist ID is required');

      const { data, error } = await supabase
        .from('playlist_videos')
        .select(`
          *,
          video:videos!playlist_videos_video_id_fkey(id, title, youtube_id, thumbnail_url, channel_name, duration_seconds)
        `)
        .eq('playlist_id', playlistId)
        .order('position', { ascending: true });

      if (error) throw error;

      return (data || []).map((pv: any) => ({
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

  return useMutation({
    mutationFn: async ({ playlistId, videoId, notes }: { playlistId: string; videoId: string; notes?: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

export function useRemoveVideoFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, videoId }: { playlistId: string; videoId: string }) => {
      const { error } = await supabase
        .from('playlist_videos')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('video_id', videoId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-videos', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

export function useReorderPlaylistVideos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, orderedVideoIds }: { playlistId: string; orderedVideoIds: string[] }) => {
      // Update positions for all videos
      const updates = orderedVideoIds.map((videoId, index) =>
        supabase
          .from('playlist_videos')
          .update({ position: index })
          .eq('playlist_id', playlistId)
          .eq('video_id', videoId)
      );

      await Promise.all(updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-videos', variables.playlistId] });
    },
  });
}

// ==================== COLLABORATOR HOOKS ====================

export function usePlaylistCollaborators(playlistId: string | undefined) {
  return useQuery({
    queryKey: ['playlist-collaborators', playlistId],
    queryFn: async () => {
      if (!playlistId) throw new Error('Playlist ID is required');

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

  return useMutation({
    mutationFn: async ({ playlistId, userId, role = 'editor' }: { playlistId: string; userId: string; role?: 'editor' | 'viewer' }) => {
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
    },
  });
}

export function useUpdateCollaboratorRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, userId, role }: { playlistId: string; userId: string; role: 'editor' | 'viewer' }) => {
      const { error } = await supabase
        .from('playlist_collaborators')
        .update({ role })
        .eq('playlist_id', playlistId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-collaborators', variables.playlistId] });
    },
  });
}

export function useRemoveCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, userId }: { playlistId: string; userId: string }) => {
      const { error } = await supabase
        .from('playlist_collaborators')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist-collaborators', variables.playlistId] });
    },
  });
}

// ==================== PROGRESS HOOKS ====================

export function usePlaylistProgress(playlistId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
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

  return useMutation({
    mutationFn: async ({ playlistId, videoId, watched }: { playlistId: string; videoId: string; watched: boolean }) => {
      if (!user?.id) throw new Error('Must be logged in to track progress');

      // Upsert the progress record
      const { data, error } = await supabase
        .from('playlist_progress')
        .upsert({
          playlist_id: playlistId,
          user_id: user.id,
          video_id: videoId,
          watched,
          watched_at: watched ? new Date().toISOString() : null,
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
    },
  });
}

// ==================== UTILITY HOOKS ====================

export function useCanEditPlaylist(playlist: Playlist | undefined) {
  const { user } = useAuth();
  const { data: collaborators } = usePlaylistCollaborators(playlist?.id);

  if (!user || !playlist) return false;

  // Author can always edit
  if (playlist.author_id === user.id) return true;

  // Check if user is an editor collaborator
  return collaborators?.some(c => c.user_id === user.id && c.role === 'editor') || false;
}

export function useIsPlaylistAuthor(playlist: Playlist | undefined) {
  const { user } = useAuth();
  if (!user || !playlist) return false;
  return playlist.author_id === user.id;
}

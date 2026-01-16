import { useAuth } from '@/hooks/useAuth';
import { usePlaylistCollaborators } from './usePlaylistCollaborators';
import { Playlist } from './types';

export function useCanEditPlaylist(playlist: Playlist | undefined) {
  const { user } = useAuth();
  const { data: collaborators } = usePlaylistCollaborators(playlist?.id);

  if (!user || !playlist) return false;

  if (playlist.author_id === user.id) return true;

  return collaborators?.some(c => c.user_id === user.id && c.role === 'editor') || false;
}

export function useIsPlaylistAuthor(playlist: Playlist | undefined) {
  const { user } = useAuth();
  if (!user || !playlist) return false;
  return playlist.author_id === user.id;
}
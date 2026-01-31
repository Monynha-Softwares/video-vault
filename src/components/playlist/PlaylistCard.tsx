import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Playlist, usePlaylistProgress, usePlaylistVideos } from '@/features/playlists';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/features/auth/useAuth';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading states
import { getIcon } from '@/flyweights/IconFactory';
import { getLanguage } from '@/flyweights/LanguageFlyweight';

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
}

export function PlaylistCard({ playlist, index = 0 }: PlaylistCardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const ListVideoIcon = getIcon('ListVideo');
  const BookOpenIcon = getIcon('BookOpen');
  const CodeIcon = getIcon('Code');
  const GlobeIcon = getIcon('Globe');
  const LockIcon = getIcon('Lock');
  const GraduationIcon = getIcon('GraduationCap');
  const language = getLanguage(playlist.language ?? '');
  
  // Only fetch videos and progress for authenticated users or public playlists
  const shouldFetchData = user || playlist.is_public;
  const { data: videos, isLoading: videosLoading } = usePlaylistVideos(shouldFetchData ? playlist.id : undefined);
  const { data: progress, isLoading: progressLoading } = usePlaylistProgress(user ? playlist.id : undefined);

  // Calculate progress percentage
  // Use videos length if available, otherwise fall back to playlist video_count
  const totalVideos = videos?.length ?? playlist.video_count ?? 0;
  const watchedVideos = progress?.filter(p => p.watched).length ?? 0;
  const progressPercent = totalVideos > 0 ? (watchedVideos / totalVideos) * 100 : 0;

  // Get thumbnail from first video if no custom thumbnail
  const thumbnailUrl = playlist.thumbnail_url || videos?.[0]?.video?.thumbnail_url;

  return (
    <Link
      to={`/playlists/${playlist.id}`}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 card-hover animate-fade-up flex flex-col"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Thumbnail / Header */}
      <div className="relative h-32 bg-muted/50 overflow-hidden">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg'; // Fallback to placeholder
              target.onerror = null;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ListVideoIcon className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            playlist.is_ordered 
              ? 'bg-primary/90 text-primary-foreground' 
              : 'bg-secondary/90 text-secondary-foreground'
          }`}>
            {playlist.is_ordered ? (
              <>
                <GraduationIcon className="w-3 h-3" />
                {t('playlists.learningPath')}
              </>
            ) : (
              <>
                <ListVideoIcon className="w-3 h-3" />
                {t('playlists.collection')}
              </>
            )}
          </span>
        </div>

        {/* Visibility badge */}
        {!playlist.is_public && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/90 text-yellow-950">
              <LockIcon className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1 mb-1">
          {playlist.name}
        </h2>
        
        <p className="text-sm text-muted-foreground mb-2">
          {t('playlists.videoCount', { count: playlist.video_count || 0 })}
          {playlist.author?.username && ` • ${playlist.author.username}`}
        </p>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-1">
          {playlist.description || t('playlists.noDescription')}
        </p>

        {/* Progress bar for logged-in users */}
        {user && (videosLoading || progressLoading) ? (
          <div className="mb-3 space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        ) : user && totalVideos > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{t('playlists.progress')}</span>
              <span>{watchedVideos}/{totalVideos}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Metadata tags */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-auto">
          {playlist.course_code && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50">
              <BookOpenIcon className="w-3 h-3" /> {playlist.course_code}
            </span>
          )}
          {playlist.unit_code && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50">
              <CodeIcon className="w-3 h-3" /> {playlist.unit_code}
            </span>
          )}
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 uppercase">
            <GlobeIcon className="w-3 h-3" /> {language.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

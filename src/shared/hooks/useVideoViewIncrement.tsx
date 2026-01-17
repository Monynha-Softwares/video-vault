import { useState } from 'react';
import { incrementVideoViewCount } from '@/entities/video/video.api';

/**
 * Custom hook to handle video view count increment with optimistic UI
 * @param initialViewCount - Initial view count for the video
 * @param animationDuration - Duration in ms for the +1 animation (default: 700ms)
 * @returns Object containing viewCount, showPlus indicator, and handleViewIncrement function
 */
export function useVideoViewIncrement(initialViewCount: number, animationDuration: number = 700) {
  const [viewCount, setViewCount] = useState<number>(initialViewCount);
  const [showPlus, setShowPlus] = useState(false);

  const handleViewIncrement = async (videoId: string) => {
    // Optimistic UI: increment local counter and show +1 animation
    setViewCount((v) => v + 1);
    setShowPlus(true);
    setTimeout(() => setShowPlus(false), animationDuration);

    try {
      // Fire-and-forget: increment on the server (atomic in DB function)
      await incrementVideoViewCount(videoId);
    } catch (e) {
      // Ignore errors - view count is not critical for UX
      console.debug('increment view failed', e);
    }
  };

  return { viewCount, showPlus, handleViewIncrement };
}

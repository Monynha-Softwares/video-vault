import { describe, expect, it } from 'vitest';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail, getYouTubeWatchUrl } from './youtube';

describe('youtube helpers', () => {
  it('extracts YouTube IDs from supported URLs', () => {
    // Existing formats
    expect(extractYouTubeId('https://www.youtube.com/watch?v=abc123DEF45')).toBe('abc123DEF45');
    expect(extractYouTubeId('https://youtu.be/abc123DEF45')).toBe('abc123DEF45');
    expect(extractYouTubeId('https://www.youtube.com/embed/abc123DEF45')).toBe('abc123DEF45');
    expect(extractYouTubeId('https://www.youtube.com/v/abc123DEF45')).toBe('abc123DEF45');
    expect(extractYouTubeId('https://www.youtube.com/shorts/abc123DEF45')).toBe('abc123DEF45');
    expect(extractYouTubeId('abc123DEF45')).toBe('abc123DEF45');

    // New formats
    expect(extractYouTubeId('https://www.youtube.com/live/abc123DEF45')).toBe('abc123DEF45');
    expect(extractYouTubeId('https://www.youtube.com/watch/abc123DEF45')).toBe('abc123DEF45');
  });

  it('returns null for invalid YouTube URLs', () => {
    expect(extractYouTubeId('https://example.com/watch?v=abc123DEF45')).toBeNull();
    expect(extractYouTubeId('not-a-url')).toBeNull();
    expect(extractYouTubeId('https://www.youtube.com/invalid/abc123DEF45')).toBeNull();
    expect(extractYouTubeId('https://www.youtube.com/watch?v=short')).toBeNull(); // Too short ID
  });

  it('builds embed and thumbnail URLs', () => {
    const videoId = 'abc123DEF45';
    expect(getYouTubeEmbedUrl(videoId)).toBe('https://www.youtube.com/embed/abc123DEF45');
    expect(getYouTubeThumbnail(videoId, 'high')).toBe(
      'https://img.youtube.com/vi/abc123DEF45/hqdefault.jpg',
    );
    expect(getYouTubeWatchUrl(videoId)).toBe('https://www.youtube.com/watch?v=abc123DEF45');
  });
});
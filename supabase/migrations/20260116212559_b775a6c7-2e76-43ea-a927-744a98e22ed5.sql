-- =============================================
-- PLAYLIST FEATURE REBUILD: Complete Schema
-- =============================================

-- Step 1: Drop existing tables (cascade to remove dependencies)
DROP TABLE IF EXISTS playlist_videos CASCADE;
DROP TABLE IF EXISTS playlist_collaborators CASCADE;
DROP TABLE IF EXISTS playlist_progress CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;

-- Step 2: Create playlists table with proper FK to profiles
CREATE TABLE public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  thumbnail_url TEXT,
  course_code TEXT,
  unit_code TEXT,
  language TEXT NOT NULL DEFAULT 'pt',
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_ordered BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT playlists_slug_unique UNIQUE (slug)
);

-- Step 3: Create playlist_videos table with proper FKs
CREATE TABLE public.playlist_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT playlist_videos_unique UNIQUE (playlist_id, video_id)
);

-- Step 4: Create playlist_collaborators table for collaborative editing
CREATE TABLE public.playlist_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'viewer')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT playlist_collaborators_unique UNIQUE (playlist_id, user_id)
);

-- Step 5: Create playlist_progress table for progress tracking
CREATE TABLE public.playlist_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  watched BOOLEAN NOT NULL DEFAULT false,
  watched_at TIMESTAMP WITH TIME ZONE,
  last_position_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT playlist_progress_unique UNIQUE (playlist_id, user_id, video_id)
);

-- Step 6: Create indexes for performance
CREATE INDEX idx_playlists_author_id ON public.playlists(author_id);
CREATE INDEX idx_playlists_is_public ON public.playlists(is_public);
CREATE INDEX idx_playlist_videos_playlist_id ON public.playlist_videos(playlist_id);
CREATE INDEX idx_playlist_videos_video_id ON public.playlist_videos(video_id);
CREATE INDEX idx_playlist_videos_position ON public.playlist_videos(playlist_id, position);
CREATE INDEX idx_playlist_collaborators_playlist_id ON public.playlist_collaborators(playlist_id);
CREATE INDEX idx_playlist_collaborators_user_id ON public.playlist_collaborators(user_id);
CREATE INDEX idx_playlist_progress_playlist_user ON public.playlist_progress(playlist_id, user_id);
CREATE INDEX idx_playlist_progress_user_id ON public.playlist_progress(user_id);

-- Step 7: Enable RLS on all tables
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_progress ENABLE ROW LEVEL SECURITY;

-- Step 8: RLS Policies for playlists
-- SELECT: Public playlists OR user is author OR user is collaborator
CREATE POLICY "View public playlists or own or collaborating"
ON public.playlists FOR SELECT
USING (
  is_public = true 
  OR author_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.playlist_collaborators 
    WHERE playlist_id = playlists.id AND user_id = auth.uid()
  )
);

-- INSERT: Authenticated users can create playlists (author_id must match their uid)
CREATE POLICY "Authenticated users can create playlists"
ON public.playlists FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- UPDATE: Only author can update
CREATE POLICY "Authors can update their playlists"
ON public.playlists FOR UPDATE
USING (auth.uid() = author_id);

-- DELETE: Only author can delete
CREATE POLICY "Authors can delete their playlists"
ON public.playlists FOR DELETE
USING (auth.uid() = author_id);

-- Step 9: RLS Policies for playlist_videos
-- SELECT: Same visibility as parent playlist
CREATE POLICY "View videos in accessible playlists"
ON public.playlist_videos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.playlists p
    WHERE p.id = playlist_videos.playlist_id
    AND (
      p.is_public = true 
      OR p.author_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.playlist_collaborators pc
        WHERE pc.playlist_id = p.id AND pc.user_id = auth.uid()
      )
    )
  )
);

-- INSERT: Author or editor collaborator
CREATE POLICY "Authors and editors can add videos"
ON public.playlist_videos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.playlists p
    WHERE p.id = playlist_videos.playlist_id
    AND (
      p.author_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.playlist_collaborators pc
        WHERE pc.playlist_id = p.id 
        AND pc.user_id = auth.uid() 
        AND pc.role = 'editor'
      )
    )
  )
);

-- UPDATE: Author or editor collaborator
CREATE POLICY "Authors and editors can update videos"
ON public.playlist_videos FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.playlists p
    WHERE p.id = playlist_videos.playlist_id
    AND (
      p.author_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.playlist_collaborators pc
        WHERE pc.playlist_id = p.id 
        AND pc.user_id = auth.uid() 
        AND pc.role = 'editor'
      )
    )
  )
);

-- DELETE: Author or editor collaborator
CREATE POLICY "Authors and editors can remove videos"
ON public.playlist_videos FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.playlists p
    WHERE p.id = playlist_videos.playlist_id
    AND (
      p.author_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.playlist_collaborators pc
        WHERE pc.playlist_id = p.id 
        AND pc.user_id = auth.uid() 
        AND pc.role = 'editor'
      )
    )
  )
);

-- Step 10: RLS Policies for playlist_collaborators
-- SELECT: Visible to author and all collaborators
CREATE POLICY "View collaborators of accessible playlists"
ON public.playlist_collaborators FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.playlists p
    WHERE p.id = playlist_collaborators.playlist_id
    AND (
      p.author_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.playlist_collaborators pc2
        WHERE pc2.playlist_id = p.id AND pc2.user_id = auth.uid()
      )
    )
  )
);

-- INSERT/UPDATE/DELETE: Only playlist author
CREATE POLICY "Authors can manage collaborators"
ON public.playlist_collaborators FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.playlists p
    WHERE p.id = playlist_collaborators.playlist_id
    AND p.author_id = auth.uid()
  )
);

CREATE POLICY "Authors can update collaborators"
ON public.playlist_collaborators FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.playlists p
    WHERE p.id = playlist_collaborators.playlist_id
    AND p.author_id = auth.uid()
  )
);

CREATE POLICY "Authors can remove collaborators"
ON public.playlist_collaborators FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.playlists p
    WHERE p.id = playlist_collaborators.playlist_id
    AND p.author_id = auth.uid()
  )
);

-- Step 11: RLS Policies for playlist_progress
-- Users can only manage their own progress
CREATE POLICY "Users can view their own progress"
ON public.playlist_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can track their own progress"
ON public.playlist_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.playlist_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
ON public.playlist_progress FOR DELETE
USING (auth.uid() = user_id);

-- Step 12: Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 13: Apply updated_at triggers
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlist_progress_updated_at
  BEFORE UPDATE ON public.playlist_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
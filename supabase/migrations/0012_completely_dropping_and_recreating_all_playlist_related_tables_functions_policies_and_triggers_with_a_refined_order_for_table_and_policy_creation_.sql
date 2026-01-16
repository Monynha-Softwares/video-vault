-- Step 1: Drop existing playlist-related tables in reverse dependency order,
-- using CASCADE to remove dependent objects like policies and triggers.
DROP TABLE IF EXISTS public.playlist_progress CASCADE;
DROP TABLE IF EXISTS public.playlist_videos CASCADE;
DROP TABLE IF EXISTS public.playlist_collaborators CASCADE;
DROP TABLE IF EXISTS public.playlists CASCADE;

-- Step 2: Recreate the generic update_updated_at_column function.
-- This function is used by playlist tables and needs to be correctly defined.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Step 3: Create all playlist tables first.

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thumbnail_url TEXT,
  course_code TEXT,
  unit_code TEXT,
  language TEXT NOT NULL DEFAULT 'pt',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  is_ordered BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlist_collaborators table
CREATE TABLE public.playlist_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor', -- 'editor' or 'viewer'
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (playlist_id, user_id) -- Ensure a user can only be a collaborator once per playlist
);

-- Create playlist_videos table
CREATE TABLE public.playlist_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (playlist_id, video_id) -- Ensure a video can only be in a playlist once
);

-- Create playlist_progress table
CREATE TABLE public.playlist_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  watched BOOLEAN NOT NULL DEFAULT FALSE,
  watched_at TIMESTAMP WITH TIME ZONE,
  last_position_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (playlist_id, user_id, video_id) -- Ensure unique progress per user per video in a playlist
);

-- Step 4: Enable RLS for all playlist tables.
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_progress ENABLE ROW LEVEL SECURITY;

-- Step 5: Apply all RLS policies.

-- Policies for playlists
CREATE POLICY "View public playlists or own or collaborating" ON public.playlists
FOR SELECT USING (
  (is_public = TRUE) OR (author_id = auth.uid()) OR (EXISTS (
    SELECT 1
    FROM public.playlist_collaborators
    WHERE (playlist_collaborators.playlist_id = playlists.id AND playlist_collaborators.user_id = auth.uid())
  ))
);
CREATE POLICY "Authenticated users can create playlists" ON public.playlists
FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their playlists" ON public.playlists
FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their playlists" ON public.playlists
FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Policies for playlist_collaborators
CREATE POLICY "View collaborators of accessible playlists" ON public.playlist_collaborators
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE (p.id = playlist_collaborators.playlist_id AND (p.author_id = auth.uid() OR EXISTS (
      SELECT 1
      FROM public.playlist_collaborators pc2
      WHERE (pc2.playlist_id = p.id AND pc2.user_id = auth.uid())
    )))
  )
);
CREATE POLICY "Authors can manage collaborators" ON public.playlist_collaborators
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE (p.id = playlist_collaborators.playlist_id AND p.author_id = auth.uid())
  )
);
CREATE POLICY "Authors can update collaborators" ON public.playlist_collaborators
FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE (p.id = playlist_collaborators.playlist_id AND p.author_id = auth.uid())
  )
);
CREATE POLICY "Authors can remove collaborators" ON public.playlist_collaborators
FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE (p.id = playlist_collaborators.playlist_id AND p.author_id = auth.uid())
  )
);

-- Policies for playlist_videos
CREATE POLICY "View videos in accessible playlists" ON public.playlist_videos
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE (p.id = playlist_videos.playlist_id AND (p.is_public = TRUE OR p.author_id = auth.uid() OR EXISTS (
      SELECT 1
      FROM public.playlist_collaborators pc
      WHERE (pc.playlist_id = p.id AND pc.user_id = auth.uid())
    )))
  )
);
CREATE POLICY "Authors and editors can add videos" ON public.playlist_videos
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE (p.id = playlist_videos.playlist_id AND (p.author_id = auth.uid() OR EXISTS (
      SELECT 1
      FROM public.playlist_collaborators pc
      WHERE (pc.playlist_id = p.id AND pc.user_id = auth.uid() AND pc.role = 'editor')
    )))
  )
);
CREATE POLICY "Authors and editors can update videos" ON public.playlist_videos
FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE (p.id = playlist_videos.playlist_id AND (p.author_id = auth.uid() OR EXISTS (
      SELECT 1
      FROM public.playlist_collaborators pc
      WHERE (pc.playlist_id = p.id AND pc.user_id = auth.uid() AND pc.role = 'editor')
    )))
  )
);
CREATE POLICY "Authors and editors can remove videos" ON public.playlist_videos
FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE (p.id = playlist_videos.playlist_id AND (p.author_id = auth.uid() OR EXISTS (
      SELECT 1
      FROM public.playlist_collaborators pc
      WHERE (pc.playlist_id = p.id AND pc.user_id = auth.uid() AND pc.role = 'editor')
    )))
  )
);

-- Policies for playlist_progress
CREATE POLICY "Users can view their own progress" ON public.playlist_progress
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can track their own progress" ON public.playlist_progress
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.playlist_progress
FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own progress" ON public.playlist_progress
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Step 6: Recreate triggers for playlist tables
CREATE TRIGGER update_playlists_updated_at
BEFORE UPDATE ON public.playlists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlist_progress_updated_at
BEFORE UPDATE ON public.playlist_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
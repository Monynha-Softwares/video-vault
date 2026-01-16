-- Enable RLS for playlists
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for playlists
CREATE POLICY "View public playlists or own or collaborating" ON public.playlists
FOR SELECT USING (
  is_public = TRUE OR
  author_id = auth.uid() OR
  EXISTS (
    SELECT 1
    FROM public.playlist_collaborators
    WHERE playlist_collaborators.playlist_id = playlists.id AND playlist_collaborators.user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can create playlists" ON public.playlists
FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their playlists" ON public.playlists
FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their playlists" ON public.playlists
FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Enable RLS for playlist_collaborators
ALTER TABLE public.playlist_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for playlist_collaborators
CREATE POLICY "View collaborators of accessible playlists" ON public.playlist_collaborators
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = playlist_collaborators.playlist_id AND (
      p.author_id = auth.uid() OR
      EXISTS (
        SELECT 1
        FROM public.playlist_collaborators pc2
        WHERE pc2.playlist_id = p.id AND pc2.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Authors can manage collaborators" ON public.playlist_collaborators
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = playlist_collaborators.playlist_id AND p.author_id = auth.uid()
  )
);

CREATE POLICY "Authors can update collaborators" ON public.playlist_collaborators
FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = playlist_collaborators.playlist_id AND p.author_id = auth.uid()
  )
);

CREATE POLICY "Authors can remove collaborators" ON public.playlist_collaborators
FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = playlist_collaborators.playlist_id AND p.author_id = auth.uid()
  )
);

-- Enable RLS for playlist_videos
ALTER TABLE public.playlist_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for playlist_videos
CREATE POLICY "View videos in accessible playlists" ON public.playlist_videos
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = playlist_videos.playlist_id AND (
      p.is_public = TRUE OR
      p.author_id = auth.uid() OR
      EXISTS (
        SELECT 1
        FROM public.playlist_collaborators pc
        WHERE pc.playlist_id = p.id AND pc.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Authors and editors can add videos" ON public.playlist_videos
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = playlist_videos.playlist_id AND (
      p.author_id = auth.uid() OR
      EXISTS (
        SELECT 1
        FROM public.playlist_collaborators pc
        WHERE pc.playlist_id = p.id AND pc.user_id = auth.uid() AND pc.role = 'editor'
      )
    )
  )
);

CREATE POLICY "Authors and editors can update videos" ON public.playlist_videos
FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = playlist_videos.playlist_id AND (
      p.author_id = auth.uid() OR
      EXISTS (
        SELECT 1
        FROM public.playlist_collaborators pc
        WHERE pc.playlist_id = p.id AND pc.user_id = auth.uid() AND pc.role = 'editor'
      )
    )
  )
);

CREATE POLICY "Authors and editors can remove videos" ON public.playlist_videos
FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = playlist_videos.playlist_id AND (
      p.author_id = auth.uid() OR
      EXISTS (
        SELECT 1
        FROM public.playlist_collaborators pc
        WHERE pc.playlist_id = p.id AND pc.user_id = auth.uid() AND pc.role = 'editor'
      )
    )
  )
);

-- Enable RLS for playlist_progress
ALTER TABLE public.playlist_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for playlist_progress
CREATE POLICY "Users can view their own progress" ON public.playlist_progress
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can track their own progress" ON public.playlist_progress
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.playlist_progress
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON public.playlist_progress
FOR DELETE TO authenticated USING (auth.uid() = user_id);
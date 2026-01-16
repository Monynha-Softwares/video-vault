-- Create playlists table
CREATE TABLE public.playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  thumbnail_url TEXT,
  course_code TEXT,
  unit_code TEXT,
  language TEXT DEFAULT 'pt' NOT NULL,
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  is_ordered BOOLEAN DEFAULT TRUE NOT NULL, -- NEW: for learning paths vs collections
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlist_collaborators table
CREATE TABLE public.playlist_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'editor' NOT NULL, -- 'editor' or 'viewer'
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (playlist_id, user_id)
);

-- Create playlist_videos table
CREATE TABLE public.playlist_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- NEW: explicit primary key
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  position INTEGER DEFAULT 0 NOT NULL,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (playlist_id, video_id) -- Ensure a video can only be in a playlist once
);

-- Create playlist_progress table
CREATE TABLE public.playlist_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  watched BOOLEAN DEFAULT FALSE NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE,
  last_position_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (playlist_id, user_id, video_id)
);
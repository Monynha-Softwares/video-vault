-- Get a sample user ID (assuming at least one user exists)
DO $$
DECLARE
    sample_user_id UUID;
    playlist_id_1 UUID;
    playlist_id_2 UUID;
    video_id_1 UUID;
    video_id_2 UUID;
    video_id_3 UUID;
    video_id_4 UUID;
BEGIN
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;

    IF sample_user_id IS NULL THEN
        RAISE NOTICE 'No users found in auth.users. Skipping playlist seeding.';
        RETURN;
    END IF;

    -- Get some sample video IDs
    SELECT id INTO video_id_1 FROM public.videos ORDER BY random() LIMIT 1;
    SELECT id INTO video_id_2 FROM public.videos WHERE id != video_id_1 ORDER BY random() LIMIT 1;
    SELECT id INTO video_id_3 FROM public.videos WHERE id != video_id_1 AND id != video_id_2 ORDER BY random() LIMIT 1;
    SELECT id INTO video_id_4 FROM public.videos WHERE id != video_id_1 AND id != video_id_2 AND id != video_id_3 ORDER BY random() LIMIT 1;

    IF video_id_1 IS NULL OR video_id_2 IS NULL OR video_id_3 IS NULL OR video_id_4 IS NULL THEN
        RAISE NOTICE 'Not enough videos found in public.videos. Skipping playlist seeding.';
        RETURN;
    END IF;

    -- Create a sample "Learning Path" playlist
    INSERT INTO public.playlists (name, slug, description, author_id, language, is_public, is_ordered, course_code, unit_code)
    VALUES (
        'Introdução ao Desenvolvimento Web',
        'intro-desenvolvimento-web',
        'Um caminho de aprendizado para iniciantes em desenvolvimento web, cobrindo HTML, CSS e JavaScript.',
        sample_user_id,
        'pt',
        TRUE,
        TRUE,
        'DEV-WEB',
        'INTRO-FUNDAMENTOS'
    )
    RETURNING id INTO playlist_id_1;

    -- Add videos to the "Learning Path" playlist
    INSERT INTO public.playlist_videos (playlist_id, video_id, position, added_by, notes)
    VALUES
        (playlist_id_1, video_id_1, 0, sample_user_id, 'Comece por aqui!'),
        (playlist_id_1, video_id_2, 1, sample_user_id, 'Aprenda o básico de CSS.');

    -- Create a sample "Collection" playlist
    INSERT INTO public.playlists (name, slug, description, author_id, language, is_public, is_ordered)
    VALUES (
        'Memes Clássicos da Internet',
        'memes-classicos-internet',
        'Uma coleção divertida dos memes mais icônicos que marcaram a história da internet.',
        sample_user_id,
        'pt',
        TRUE,
        FALSE
    )
    RETURNING id INTO playlist_id_2;

    -- Add videos to the "Collection" playlist
    INSERT INTO public.playlist_videos (playlist_id, video_id, position, added_by)
    VALUES
        (playlist_id_2, video_id_3, 0, sample_user_id),
        (playlist_id_2, video_id_4, 1, sample_user_id);

    -- Add a collaborator to the first playlist (assuming another user exists, or use the same user for simplicity)
    INSERT INTO public.playlist_collaborators (playlist_id, user_id, role)
    SELECT playlist_id_1, id, 'editor' FROM auth.users WHERE id != sample_user_id LIMIT 1;

    -- Add some progress for the sample user on the first playlist
    INSERT INTO public.playlist_progress (playlist_id, user_id, video_id, watched, watched_at, last_position_seconds)
    VALUES
        (playlist_id_1, sample_user_id, video_id_1, TRUE, NOW(), 120);

    RAISE NOTICE 'Playlist seeding complete.';
END $$;
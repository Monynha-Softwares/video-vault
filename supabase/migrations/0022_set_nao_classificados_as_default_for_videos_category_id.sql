DO $$
DECLARE
    unclassified_category_id UUID;
BEGIN
    -- Get the ID of the 'nao-classificados' category
    SELECT id INTO unclassified_category_id FROM public.categories WHERE slug = 'nao-classificados';

    -- Check if the default constraint already exists and drop it if it does
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'videos'
          AND column_name = 'category_id'
          AND column_default IS NOT NULL
    ) THEN
        EXECUTE 'ALTER TABLE public.videos ALTER COLUMN category_id DROP DEFAULT';
        RAISE NOTICE 'Dropped existing default constraint on videos.category_id.';
    END IF;

    -- Set the default value for category_id to the 'nao-classificados' category ID
    EXECUTE 'ALTER TABLE public.videos ALTER COLUMN category_id SET DEFAULT ''' || unclassified_category_id || '''';

    RAISE NOTICE 'Default value for videos.category_id set to "nao-classificados" category ID: %', unclassified_category_id;
END $$;
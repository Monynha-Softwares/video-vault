ALTER TABLE public.profiles
ADD COLUMN display_name TEXT,
ADD COLUMN bio TEXT;

-- Update existing profiles with default display_name if null
UPDATE public.profiles
SET display_name = username
WHERE display_name IS NULL;

-- Ensure display_name is not null going forward (if desired, can be added to table definition)
-- For now, we'll rely on the trigger to set it on new users.
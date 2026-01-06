-- Create ai_enrichments table
CREATE TABLE public.ai_enrichments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  optimized_title TEXT,
  summary_description TEXT,
  semantic_tags TEXT[],
  suggested_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  language TEXT,
  cultural_relevance TEXT,
  short_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reprocessed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.ai_enrichments ENABLE ROW LEVEL SECURITY;

-- Policies for ai_enrichments
-- Allow authenticated users to read enrichments for videos they can access
CREATE POLICY "ai_enrichments_select_policy" ON public.ai_enrichments
FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.videos WHERE id = video_id)
);

-- Allow authenticated users (e.g., via Edge Function) to insert enrichments
CREATE POLICY "ai_enrichments_insert_policy" ON public.ai_enrichments
FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users (e.g., via Edge Function) to update enrichments
CREATE POLICY "ai_enrichments_update_policy" ON public.ai_enrichments
FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users (e.g., via Edge Function) to delete enrichments
CREATE POLICY "ai_enrichments_delete_policy" ON public.ai_enrichments
FOR DELETE TO authenticated USING (true);
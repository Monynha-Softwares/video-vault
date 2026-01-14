import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useVideoCount() {
  return useQuery<number, Error>({
    queryKey: ['videoCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
  });
}
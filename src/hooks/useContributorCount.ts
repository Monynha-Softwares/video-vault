import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useContributorCount() {
  return useQuery<number, Error>({
    queryKey: ['contributorCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('videos')
        .select('submitted_by', { count: 'exact', head: true })
        .not('submitted_by', 'is', null) // Only count videos with a submitted_by user
        .distinct('submitted_by'); // Count unique submitters

      if (error) throw error;
      return count || 0;
    },
  });
}
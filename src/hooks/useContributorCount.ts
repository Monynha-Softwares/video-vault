import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useContributorCount() {
  return useQuery<number, Error>({
    queryKey: ['contributorCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
  });
}
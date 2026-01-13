import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TopUpRule {
  id: string;
  name: string;
  min_age: number | null;
  max_age: number | null;
  min_balance: number | null;
  max_balance: number | null;
  in_school: 'in_school' | 'not_in_school' | null;
  education_level: 'primary' | 'secondary' | 'post_secondary' | 'tertiary' | 'postgraduate' | null;
  continuing_learning: 'active' | 'inactive' | 'completed' | null;
  amount: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export function useTopUpRules() {
  return useQuery({
    queryKey: ['top_up_rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('top_up_rules')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as TopUpRule[];
    },
  });
}

export function useCreateTopUpRule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<TopUpRule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('top_up_rules')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top_up_rules'] });
      toast.success('Top-up rule created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create rule', { description: error.message });
    },
  });
}

export function useUpdateTopUpRule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<TopUpRule> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('top_up_rules')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top_up_rules'] });
      toast.success('Rule updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update rule', { description: error.message });
    },
  });
}

export function useDeleteTopUpRule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('top_up_rules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top_up_rules'] });
      toast.success('Rule deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete rule', { description: error.message });
    },
  });
}

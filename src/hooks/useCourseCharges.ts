import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CourseCharge {
  id: string;
  account_id: string;
  course_id: string;
  course_name: string;
  amount: number;
  amount_paid: number;
  due_date: string;
  status: 'outstanding' | 'overdue' | 'clear' | 'partially_paid';
  paid_date: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  courses?: {
    id: string;
    name: string;
    provider: string;
    fee: number;
    billing_cycle: string;
    status: string;
  } | null;
}

export function useCourseCharges() {
  return useQuery({
    queryKey: ['course_charges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_charges')
        .select(`
          *,
          courses (
            id,
            name,
            provider,
            fee,
            billing_cycle,
            status
          )
        `)
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data as CourseCharge[];
    },
  });
}

export function useCourseChargesByAccount(accountId: string) {
  return useQuery({
    queryKey: ['course_charges', 'account', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_charges')
        .select('*')
        .eq('account_id', accountId)
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data as CourseCharge[];
    },
    enabled: !!accountId,
  });
}

export function useCreateCourseCharge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<CourseCharge, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('course_charges')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_charges'] });
      toast.success('Charge created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create charge', { description: error.message });
    },
  });
}

export function useUpdateCourseCharge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, courses, ...data }: Partial<CourseCharge> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('course_charges')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_charges'] });
      toast.success('Charge updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update charge', { description: error.message });
    },
  });
}

export function useDeleteCourseCharge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('course_charges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_charges'] });
      toast.success('Charge deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete charge', { description: error.message });
    },
  });
}

-- Add 'cancelled' status to top_up_schedule_status enum
ALTER TYPE public.top_up_schedule_status ADD VALUE IF NOT EXISTS 'cancelled';

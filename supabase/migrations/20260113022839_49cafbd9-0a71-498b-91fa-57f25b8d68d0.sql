-- Add 'one_time' to the billing_cycle enum
ALTER TYPE public.billing_cycle ADD VALUE IF NOT EXISTS 'one_time';
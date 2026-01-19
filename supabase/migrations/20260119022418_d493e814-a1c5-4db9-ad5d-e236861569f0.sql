-- Change billing_date and billing_due_date from date to integer
-- These columns store day-of-month (1-28) and days-after values (14, 30), not actual dates

ALTER TABLE public.courses 
ALTER COLUMN billing_date TYPE integer USING NULL;

ALTER TABLE public.courses 
ALTER COLUMN billing_due_date TYPE integer USING NULL;
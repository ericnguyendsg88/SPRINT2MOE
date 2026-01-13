-- Create enum for residential status
CREATE TYPE public.residential_status AS ENUM ('sc', 'spr', 'non_resident');

-- Add residential_status column to account_holders
ALTER TABLE public.account_holders 
ADD COLUMN residential_status public.residential_status NOT NULL DEFAULT 'sc';

-- Randomly assign residential status to existing users
UPDATE public.account_holders 
SET residential_status = (
  CASE (floor(random() * 3)::int)
    WHEN 0 THEN 'sc'::residential_status
    WHEN 1 THEN 'spr'::residential_status
    ELSE 'non_resident'::residential_status
  END
);
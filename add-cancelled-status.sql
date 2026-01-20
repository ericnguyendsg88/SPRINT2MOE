-- Add 'cancelled' status to top_up_schedule_status enum if it doesn't exist
-- Run this in your Supabase SQL Editor

DO $$ 
BEGIN
    -- Check if 'cancelled' value already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum 
        WHERE enumlabel = 'cancelled' 
        AND enumtypid = 'public.top_up_schedule_status'::regtype
    ) THEN
        -- Add the 'cancelled' value to the enum
        ALTER TYPE public.top_up_schedule_status ADD VALUE 'cancelled';
        RAISE NOTICE 'Successfully added cancelled status to top_up_schedule_status enum';
    ELSE
        RAISE NOTICE 'cancelled status already exists in top_up_schedule_status enum';
    END IF;
END $$;

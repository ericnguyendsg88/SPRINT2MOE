-- Quick Fix: Add education_level column to courses
-- Run this single command if you have direct database access

-- Add the column
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS education_level text;

-- Add constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE constraint_name = 'courses_education_level_check'
  ) THEN
    ALTER TABLE public.courses
    ADD CONSTRAINT courses_education_level_check 
    CHECK (education_level IN ('primary', 'secondary', 'post_secondary', 'tertiary', 'postgraduate'));
  END IF;
END $$;

-- Done! The column is now added.

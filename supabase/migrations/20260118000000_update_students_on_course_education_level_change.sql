-- Create function to update all enrolled students' education levels when a course's education level changes
CREATE OR REPLACE FUNCTION update_students_on_course_education_level_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if education_level was actually changed
  IF OLD.education_level IS DISTINCT FROM NEW.education_level THEN
    -- For each active enrollment in this course, recalculate the student's education level
    -- This will trigger the existing update_account_holder_education_level function
    -- We do this by touching the enrollment record
    UPDATE enrollments
    SET updated_at = NOW()
    WHERE course_id = NEW.id
      AND status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on courses table to update students when course education level changes
CREATE TRIGGER update_students_on_course_education_change
  AFTER UPDATE ON courses
  FOR EACH ROW
  WHEN (OLD.education_level IS DISTINCT FROM NEW.education_level)
  EXECUTE FUNCTION update_students_on_course_education_level_change();

-- Add comment for documentation
COMMENT ON FUNCTION update_students_on_course_education_level_change() IS 'Updates all enrolled students education levels when a course education level is changed';

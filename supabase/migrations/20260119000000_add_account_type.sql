-- Migration to add account_type column based on residential_status
-- Education Account (SC) = has balance, can use combined payment methods, can receive top-ups
-- Student Account (PR/Non-Resident) = NO balance, pay in full with single method, no top-ups

-- Add account_type column
ALTER TABLE account_holders 
ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'education';

-- Update existing records based on residential_status
-- SC (Singapore Citizen) -> education account
-- PR/Non-Resident -> student account
UPDATE account_holders 
SET account_type = CASE 
  WHEN residential_status = 'sc' THEN 'education'
  ELSE 'student'
END;

-- Add constraint to ensure valid account types
ALTER TABLE account_holders
ADD CONSTRAINT chk_account_type 
CHECK (account_type IN ('education', 'student'));

-- Create trigger to automatically set account_type based on residential_status
CREATE OR REPLACE FUNCTION set_account_type_from_residential_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.residential_status = 'sc' THEN
    NEW.account_type := 'education';
  ELSE
    NEW.account_type := 'student';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
DROP TRIGGER IF EXISTS trg_set_account_type_insert ON account_holders;
CREATE TRIGGER trg_set_account_type_insert
  BEFORE INSERT ON account_holders
  FOR EACH ROW
  EXECUTE FUNCTION set_account_type_from_residential_status();

-- Create trigger for UPDATE (when residential_status changes)
DROP TRIGGER IF EXISTS trg_set_account_type_update ON account_holders;
CREATE TRIGGER trg_set_account_type_update
  BEFORE UPDATE OF residential_status ON account_holders
  FOR EACH ROW
  WHEN (OLD.residential_status IS DISTINCT FROM NEW.residential_status)
  EXECUTE FUNCTION set_account_type_from_residential_status();

-- For student accounts (PR/Non-Resident), set balance to 0
UPDATE account_holders 
SET balance = 0 
WHERE account_type = 'student';

-- Add a comment for documentation
COMMENT ON COLUMN account_holders.account_type IS 'Account type: education (SC - has balance, top-ups) or student (PR/Non-Resident - no balance, direct payment)';

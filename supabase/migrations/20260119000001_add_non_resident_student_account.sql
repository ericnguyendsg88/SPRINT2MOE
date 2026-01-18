-- Add a dummy Non-Resident Student Account
-- Student Account (Non-Resident) has NO balance and cannot receive top-ups

INSERT INTO public.account_holders (
  nric,
  name,
  date_of_birth,
  email,
  phone,
  residential_address,
  mailing_address,
  balance,
  status,
  in_school,
  education_level,
  continuing_learning,
  residential_status,
  created_at,
  updated_at
) VALUES (
  'G1234567N',
  'Kumar Ramasamy',
  '2005-08-20',
  'kumar.ramasamy@email.com',
  '+65 9876 5432',
  'Blk 789 Hougang Ave 8, #10-234, Singapore 530789',
  'Blk 789 Hougang Ave 8, #10-234, Singapore 530789',
  0, -- Student Accounts always have 0 balance
  'active',
  'in_school',
  'post_secondary',
  'active',
  'non_resident', -- Non-Resident status
  NOW(),
  NOW()
) ON CONFLICT (nric) DO NOTHING;

-- Note: The account_type will be automatically set to 'student' by the trigger
-- because residential_status is 'non_resident'

COMMENT ON COLUMN public.account_holders.residential_status IS 'Residential status: sc (Singapore Citizen - Education Account), pr (Permanent Resident - Student Account), non_resident (Non-Resident - Student Account)';

# Database Migration Required

## Issue
The "cancelled" status for top-up schedules needs to be added to the database enum.

## Solution
Run the following SQL in your Supabase SQL Editor:

```sql
ALTER TYPE public.top_up_schedule_status ADD VALUE IF NOT EXISTS 'cancelled';
```

## Alternative
If you have Supabase CLI installed, run:
```bash
npx supabase db push
```

Or apply all migrations:
```bash
npx supabase db reset
```

## Verification
After running the migration, you should be able to cancel scheduled top-up orders without errors.

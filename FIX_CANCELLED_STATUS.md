# Fix: Add 'cancelled' Status to Database

## Error
The system is showing: **"invalid input value for enum top_up_schedule_status: 'cancelled'"**

This means the database enum doesn't have the 'cancelled' value yet.

## Solution

You need to run the following SQL command in your **Supabase SQL Editor**:

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2: Run this SQL

```sql
ALTER TYPE public.top_up_schedule_status ADD VALUE IF NOT EXISTS 'cancelled';
```

### Step 3: Verify
After running the command, you should see a success message. The 'cancelled' status will now be available for top-up schedules.

## Alternative: Check if already exists

To check if the value already exists, run:

```sql
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'public.top_up_schedule_status'::regtype;
```

You should see a list that includes: scheduled, processing, completed, failed, and cancelled.

## After fixing

Once the SQL is run successfully, the cancel top-up feature will work properly.

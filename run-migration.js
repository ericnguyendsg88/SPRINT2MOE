// Run this script to add the 'cancelled' status to the database
// Usage: node run-migration.js

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env file');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addCancelledStatus() {
  console.log('Adding "cancelled" status to top_up_schedule_status enum...');
  
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM pg_enum 
              WHERE enumlabel = 'cancelled' 
              AND enumtypid = 'public.top_up_schedule_status'::regtype
          ) THEN
              ALTER TYPE public.top_up_schedule_status ADD VALUE 'cancelled';
              RAISE NOTICE 'Successfully added cancelled status';
          ELSE
              RAISE NOTICE 'cancelled status already exists';
          END IF;
      END $$;
    `
  });

  if (error) {
    console.error('Error running migration:', error);
    console.log('\nPlease run this SQL manually in your Supabase SQL Editor:');
    console.log('ALTER TYPE public.top_up_schedule_status ADD VALUE IF NOT EXISTS \'cancelled\';');
    process.exit(1);
  } else {
    console.log('✓ Migration completed successfully!');
  }
}

addCancelledStatus();

/**
 * Migration Script - Apply Education Level Migrations
 * 
 * This script applies the education_level column and triggers to your Supabase database
 * Run with: node apply-migrations.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  console.error('   Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
console.log(`   URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  console.log('\n📦 Applying education_level migrations...\n');

  try {
    // Check if column already exists
    console.log('1️⃣ Checking if education_level column exists...');
    const { data: columnCheck, error: checkError } = await supabase.rpc('check_column_exists', {
      p_table_name: 'courses',
      p_column_name: 'education_level'
    }).catch(() => ({ data: null, error: null }));

    // Read the migration SQL
    const migrationSql = readFileSync(join(__dirname, 'supabase', 'APPLY_MIGRATIONS.sql'), 'utf8');

    // Execute the migration
    console.log('2️⃣ Applying migration SQL...');
    
    // Note: Supabase client doesn't support running DDL directly
    // We'll provide instructions for the user
    console.log('\n⚠️  Direct SQL execution requires elevated permissions.');
    console.log('\n📋 Please run this command in your terminal:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nOption 1: Using psql (PostgreSQL command line)');
    console.log('─────────────────────────────────────────────────────────────');
    console.log('psql "postgresql://postgres:[YOUR-PASSWORD]@db.uigiuejiumbimnoccctg.supabase.co:5432/postgres" < supabase/APPLY_MIGRATIONS.sql\n');
    
    console.log('\nOption 2: Visit Supabase SQL Editor');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`1. Go to: https://supabase.com/dashboard/project/uigiuejiumbimnoccctg/sql/new`);
    console.log('2. Copy contents from: supabase/APPLY_MIGRATIONS.sql');
    console.log('3. Paste and click "Run"\n');
    
    console.log('\nOption 3: Using Supabase CLI with direct connection');
    console.log('─────────────────────────────────────────────────────────────');
    console.log('supabase db execute --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.uigiuejiumbimnoccctg.supabase.co:5432/postgres" < supabase/APPLY_MIGRATIONS.sql\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('💡 Your database password can be found in:');
    console.log('   Supabase Dashboard → Settings → Database → Connection String');
    console.log('   (Replace [YOUR-PASSWORD] with the actual password)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Test database connection first
async function testConnection() {
  console.log('\n🔍 Testing database connection...');
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log('✅ Database connection successful!\n');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

// Main execution
(async () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🚀 Education Level Migration Tool');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const connected = await testConnection();
  
  if (connected) {
    await applyMigrations();
  } else {
    console.log('\n⚠️  Please check your database credentials and try again.\n');
    process.exit(1);
  }
})();

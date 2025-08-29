#!/usr/bin/env node

// Database migration script for PromptHero
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function runMigrations() {
  console.log('🚀 Starting database migration...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('💡 Set it in Vercel Project Settings → Environment Variables → Production');
    console.log('💡 Or create .env.local with: DATABASE_URL=postgres://user:pass@host:5432/dbname');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'docs', 'api', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Executing schema...');
    await client.query(schema);
    
    console.log('✅ Schema executed successfully');
    
    // Verify tables were created
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('prompts', 'categories', 'languages', 'ratings', 'usage_tracking')
      ORDER BY table_name
    `);
    
    console.log('📊 Created tables:', tables.rows.map(row => row.table_name).join(', '));
    
    // Check sample data
    const promptCount = await client.query('SELECT COUNT(*) as count FROM prompts');
    const categoryCount = await client.query('SELECT COUNT(*) as count FROM categories');
    
    console.log(`📝 Sample prompts: ${promptCount.rows[0].count}`);
    console.log(`🏷️  Categories: ${categoryCount.rows[0].count}`);
    
    client.release();
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

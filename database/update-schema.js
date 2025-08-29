#!/usr/bin/env node

// Update database schema for anonymous user support
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function updateSchema() {
  console.log('🔄 Updating database schema for anonymous user support...');
  
  try {
    const client = await pool.connect();
    
    // Add user_identifier column to ratings table
    console.log('📝 Adding user_identifier to ratings table...');
    await client.query(`
      ALTER TABLE ratings 
      ADD COLUMN IF NOT EXISTS user_identifier VARCHAR(255);
    `);
    
    // Add user_identifier column to bookmarks table
    console.log('📝 Adding user_identifier to bookmarks table...');
    await client.query(`
      ALTER TABLE bookmarks 
      ADD COLUMN IF NOT EXISTS user_identifier VARCHAR(255);
    `);
    
    // Add user_identifier column to likes table
    console.log('📝 Adding user_identifier to likes table...');
    await client.query(`
      ALTER TABLE likes 
      ADD COLUMN IF NOT EXISTS user_identifier VARCHAR(255);
    `);
    
    // Add likes_count column to prompts table if it doesn't exist
    console.log('📝 Adding likes_count to prompts table...');
    await client.query(`
      ALTER TABLE prompts 
      ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
    `);
    
    // Create indexes for user_identifier columns
    console.log('📝 Creating indexes for user_identifier...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ratings_user_identifier ON ratings(user_identifier);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_user_identifier ON bookmarks(user_identifier);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_likes_user_identifier ON likes(user_identifier);
    `);
    
    // Update prompts table to use category as string instead of category_id
    console.log('📝 Checking prompts table structure...');
    const promptsColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'prompts' 
      AND column_name IN ('category', 'category_id');
    `);
    
    const hasCategory = promptsColumns.rows.some(row => row.column_name === 'category');
    const hasCategoryId = promptsColumns.rows.some(row => row.column_name === 'category_id');
    
    if (!hasCategory && hasCategoryId) {
      console.log('📝 Converting category_id to category string column...');
      await client.query(`
        ALTER TABLE prompts 
        ADD COLUMN category VARCHAR(100);
      `);
      
      // Update existing prompts to use category string
      await client.query(`
        UPDATE prompts 
        SET category = 'debugging' 
        WHERE category IS NULL;
      `);
    }
    
    client.release();
    console.log('✅ Database schema updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error);
  } finally {
    await pool.end();
  }
}

updateSchema();

#!/usr/bin/env node

// Create missing tables for the application
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function createMissingTables() {
  console.log('🔄 Creating missing tables...');
  
  try {
    const client = await pool.connect();
    
    // Enable UUID extension
    console.log('📝 Enabling UUID extension...');
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    
    // Create ratings table
    console.log('📝 Creating ratings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        prompt_id INTEGER REFERENCES prompts(id) ON DELETE CASCADE,
        user_identifier VARCHAR(255),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
        review TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create bookmarks table
    console.log('📝 Creating bookmarks table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        prompt_id INTEGER REFERENCES prompts(id) ON DELETE CASCADE,
        user_identifier VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create likes table
    console.log('📝 Creating likes table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        prompt_id INTEGER REFERENCES prompts(id) ON DELETE CASCADE,
        user_identifier VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Add likes_count column to prompts table
    console.log('📝 Adding likes_count to prompts table...');
    await client.query(`
      ALTER TABLE prompts 
      ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
    `);
    
    // Create indexes
    console.log('📝 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ratings_prompt ON ratings(prompt_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ratings_user_identifier ON ratings(user_identifier);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_prompt ON bookmarks(prompt_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_user_identifier ON bookmarks(user_identifier);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_likes_prompt ON likes(prompt_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_likes_user_identifier ON likes(user_identifier);
    `);
    
    client.release();
    console.log('✅ Missing tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

createMissingTables();

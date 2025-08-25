// CodePrompt Hub - Database Utilities
// PostgreSQL connection and common queries

const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Get all prompts with category information
async function getPrompts(filters = {}) {
  try {
    let query = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.prompt_text,
        p.language,
        p.tags,
        p.rating,
        p.rating_count,
        p.usage_count,
        p.likes_count,
        p.created_at,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color
      FROM prompts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_approved = true
    `;
    
    const params = [];
    let paramCount = 0;
    
    // Add category filter
    if (filters.category) {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      params.push(filters.category);
    }
    
    // Add language filter
    if (filters.language) {
      paramCount++;
      query += ` AND p.language = $${paramCount}`;
      params.push(filters.language);
    }
    
    // Add search filter
    if (filters.search) {
      paramCount++;
      query += ` AND (
        p.title ILIKE $${paramCount} OR 
        p.description ILIKE $${paramCount} OR 
        p.tags::text ILIKE $${paramCount}
      )`;
      params.push(`%${filters.search}%`);
    }
    
    // Add sorting
    if (filters.sort === 'rating') {
      query += ' ORDER BY p.rating DESC, p.rating_count DESC';
    } else if (filters.sort === 'usage') {
      query += ' ORDER BY p.usage_count DESC';
    } else if (filters.sort === 'newest') {
      query += ' ORDER BY p.created_at DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }
    
    // Add pagination
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      
      if (filters.offset) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(filters.offset);
      }
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
}

// Get prompt by ID
async function getPromptById(id) {
  try {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color
      FROM prompts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_approved = true
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching prompt by ID:', error);
    throw error;
  }
}

// Create new prompt
async function createPrompt(promptData) {
  try {
    const query = `
      INSERT INTO prompts (
        title, description, prompt_text, category_id, language, tags
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      promptData.title,
      promptData.description,
      promptData.prompt_text,
      promptData.category_id,
      promptData.language,
      promptData.tags
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating prompt:', error);
    throw error;
  }
}

// Get all categories
async function getCategories() {
  try {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as prompt_count
      FROM categories c
      LEFT JOIN prompts p ON c.id = p.category_id AND p.is_approved = true
      GROUP BY c.id
      ORDER BY c.name
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Rate a prompt
async function ratePrompt(promptId, userId, rating, comment = null) {
  try {
    const query = `
      INSERT INTO ratings (prompt_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (prompt_id, user_id)
      DO UPDATE SET rating = $3, comment = $4, updated_at = NOW()
      RETURNING *
    `;
    
    const result = await pool.query(query, [promptId, userId, rating, comment]);
    return result.rows[0];
  } catch (error) {
    console.error('Error rating prompt:', error);
    throw error;
  }
}

// Toggle bookmark
async function toggleBookmark(promptId, userId) {
  try {
    // Check if bookmark exists
    const existingQuery = 'SELECT id FROM bookmarks WHERE prompt_id = $1 AND user_id = $2';
    const existing = await pool.query(existingQuery, [promptId, userId]);
    
    if (existing.rows.length > 0) {
      // Remove bookmark
      await pool.query('DELETE FROM bookmarks WHERE prompt_id = $1 AND user_id = $2', [promptId, userId]);
      return { bookmarked: false };
    } else {
      // Add bookmark
      await pool.query('INSERT INTO bookmarks (prompt_id, user_id) VALUES ($1, $2)', [promptId, userId]);
      return { bookmarked: true };
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
}

// Toggle like
async function toggleLike(promptId, userId) {
  try {
    // Check if like exists
    const existingQuery = 'SELECT id FROM likes WHERE prompt_id = $1 AND user_id = $2';
    const existing = await pool.query(existingQuery, [promptId, userId]);
    
    if (existing.rows.length > 0) {
      // Remove like
      await pool.query('DELETE FROM likes WHERE prompt_id = $1 AND user_id = $2', [promptId, userId]);
      return { liked: false };
    } else {
      // Add like
      await pool.query('INSERT INTO likes (prompt_id, user_id) VALUES ($1, $2)', [promptId, userId]);
      return { liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

// Track prompt usage
async function trackUsage(promptId, userId = null, ipAddress = null, userAgent = null) {
  try {
    const query = `
      INSERT INTO usage_tracking (prompt_id, user_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
    `;
    
    await pool.query(query, [promptId, userId, ipAddress, userAgent]);
  } catch (error) {
    console.error('Error tracking usage:', error);
    // Don't throw error for usage tracking failures
  }
}

// Get user's bookmarked prompts
async function getUserBookmarks(userId) {
  try {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon
      FROM prompts p
      JOIN categories c ON p.category_id = c.id
      JOIN bookmarks b ON p.id = b.prompt_id
      WHERE b.user_id = $1 AND p.is_approved = true
      ORDER BY b.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    throw error;
  }
}

// Get user's liked prompts
async function getUserLikes(userId) {
  try {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon
      FROM prompts p
      JOIN categories c ON p.category_id = c.id
      JOIN likes l ON p.id = l.prompt_id
      WHERE l.user_id = $1 AND p.is_approved = true
      ORDER BY l.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching user likes:', error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  getPrompts,
  getPromptById,
  createPrompt,
  getCategories,
  ratePrompt,
  toggleBookmark,
  toggleLike,
  trackUsage,
  getUserBookmarks,
  getUserLikes
};

// PromptHero - Bookmarks API (ESM)
import db from '../database/db.js';

const { pool } = db;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute
const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip);
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimitStore.set(ip, validRequests);
  
  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  validRequests.push(now);
  return true;
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'unknown';
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: 60
    });
  }

  try {
    if (req.method === 'POST') {
      return await toggleBookmark(req, res);
    } else if (req.method === 'GET') {
      return await getBookmarks(req, res);
    } else if (req.method === 'DELETE') {
      return await removeBookmark(req, res);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Bookmarks API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Toggle bookmark (add if not exists, remove if exists)
async function toggleBookmark(req, res) {
  const { prompt_id, user_identifier } = req.body;

  if (!prompt_id) {
    return res.status(400).json({ error: 'prompt_id is required' });
  }

  const userId = user_identifier || getClientIP(req);

  try {
    // Check if bookmark exists
    const existingBookmark = await pool.query(
      'SELECT id FROM bookmarks WHERE prompt_id = $1 AND user_identifier = $2',
      [prompt_id, userId]
    );

    if (existingBookmark.rows.length > 0) {
      // Remove bookmark
      await pool.query(
        'DELETE FROM bookmarks WHERE prompt_id = $1 AND user_identifier = $2',
        [prompt_id, userId]
      );
      
      res.status(200).json({
        message: 'Bookmark removed successfully',
        bookmarked: false
      });
    } else {
      // Add bookmark
      await pool.query(
        'INSERT INTO bookmarks (prompt_id, user_identifier, created_at) VALUES ($1, $2, NOW())',
        [prompt_id, userId]
      );
      
      res.status(200).json({
        message: 'Bookmark added successfully',
        bookmarked: true
      });
    }

  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
}

// Get user's bookmarked prompts
async function getBookmarks(req, res) {
  const { user_identifier } = req.query;

  if (!user_identifier) {
    return res.status(400).json({ error: 'user_identifier is required' });
  }

  try {
    const result = await pool.query(
      `SELECT p.*, b.created_at as bookmarked_at
       FROM prompts p
       JOIN bookmarks b ON p.id = b.prompt_id
       WHERE b.user_identifier = $1
       ORDER BY b.created_at DESC`,
      [user_identifier]
    );

    res.status(200).json({
      user_identifier,
      bookmarks: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
}

// Remove specific bookmark
async function removeBookmark(req, res) {
  const { prompt_id, user_identifier } = req.query;

  if (!prompt_id || !user_identifier) {
    return res.status(400).json({ error: 'prompt_id and user_identifier are required' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM bookmarks WHERE prompt_id = $1 AND user_identifier = $2',
      [prompt_id, user_identifier]
    );

    if (result.rowCount > 0) {
      res.status(200).json({
        message: 'Bookmark removed successfully',
        removed: true
      });
    } else {
      res.status(404).json({
        message: 'Bookmark not found',
        removed: false
      });
    }

  } catch (error) {
    console.error('Error removing bookmark:', error);
    return res.status(500).json({ error: 'Failed to remove bookmark' });
  }
}

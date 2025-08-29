// PromptHero - Likes API (ESM)
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
      return await toggleLike(req, res);
    } else if (req.method === 'GET') {
      return await getLikes(req, res);
    } else if (req.method === 'DELETE') {
      return await removeLike(req, res);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Likes API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Toggle like (add if not exists, remove if exists)
async function toggleLike(req, res) {
  const { prompt_id, user_identifier } = req.body;

  if (!prompt_id) {
    return res.status(400).json({ error: 'prompt_id is required' });
  }

  const userId = user_identifier || getClientIP(req);

  try {
    // Check if like exists
    const existingLike = await pool.query(
      'SELECT id FROM likes WHERE prompt_id = $1 AND user_identifier = $2',
      [prompt_id, userId]
    );

    if (existingLike.rows.length > 0) {
      // Remove like
      await pool.query(
        'DELETE FROM likes WHERE prompt_id = $1 AND user_identifier = $2',
        [prompt_id, userId]
      );
      
      // Update prompt likes count
      await updatePromptLikesCount(prompt_id);
      
      res.status(200).json({
        message: 'Like removed successfully',
        liked: false
      });
    } else {
      // Add like
      await pool.query(
        'INSERT INTO likes (prompt_id, user_identifier, created_at) VALUES ($1, $2, NOW())',
        [prompt_id, userId]
      );
      
      // Update prompt likes count
      await updatePromptLikesCount(prompt_id);
      
      res.status(200).json({
        message: 'Like added successfully',
        liked: true
      });
    }

  } catch (error) {
    console.error('Error toggling like:', error);
    return res.status(500).json({ error: 'Failed to toggle like' });
  }
}

// Get user's liked prompts
async function getLikes(req, res) {
  const { user_identifier } = req.query;

  if (!user_identifier) {
    return res.status(400).json({ error: 'user_identifier is required' });
  }

  try {
    const result = await pool.query(
      `SELECT p.*, l.created_at as liked_at
       FROM prompts p
       JOIN likes l ON p.id = l.prompt_id
       WHERE l.user_identifier = $1
       ORDER BY l.created_at DESC`,
      [user_identifier]
    );

    res.status(200).json({
      user_identifier,
      likes: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching likes:', error);
    return res.status(500).json({ error: 'Failed to fetch likes' });
  }
}

// Remove specific like
async function removeLike(req, res) {
  const { prompt_id, user_identifier } = req.query;

  if (!prompt_id || !user_identifier) {
    return res.status(400).json({ error: 'prompt_id and user_identifier are required' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM likes WHERE prompt_id = $1 AND user_identifier = $2',
      [prompt_id, user_identifier]
    );

    if (result.rowCount > 0) {
      // Update prompt likes count
      await updatePromptLikesCount(prompt_id);
      
      res.status(200).json({
        message: 'Like removed successfully',
        removed: true
      });
    } else {
      res.status(404).json({
        message: 'Like not found',
        removed: false
      });
    }

  } catch (error) {
    console.error('Error removing like:', error);
    return res.status(500).json({ error: 'Failed to remove like' });
  }
}

// Helper function to update prompt likes count
async function updatePromptLikesCount(promptId) {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as total_likes FROM likes WHERE prompt_id = $1',
      [promptId]
    );

    const totalLikes = parseInt(result.rows[0].total_likes) || 0;

    await pool.query(
      'UPDATE prompts SET likes_count = $1 WHERE id = $2',
      [totalLikes, promptId]
    );
  } catch (error) {
    console.error('Error updating prompt likes count:', error);
    // Don't throw error here to avoid breaking the main like operation
  }
}

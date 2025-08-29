// PromptHero - Ratings API (ESM)
import db from '../database/db.js';

const { pool } = db;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 50; // 50 requests per minute
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
      return await createRating(req, res);
    } else if (req.method === 'GET') {
      return await getRatings(req, res);
    } else if (req.method === 'PUT') {
      return await updateRating(req, res);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Ratings API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Create or update a rating
async function createRating(req, res) {
  const { prompt_id, rating, review, user_identifier } = req.body;

  // Validate input
  if (!prompt_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ 
      error: 'Missing or invalid required fields: prompt_id, rating (1-5)'
    });
  }

  // Use IP as user identifier if not provided
  const userId = user_identifier || getClientIP(req);

  try {
    // Check if rating already exists
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE prompt_id = $1 AND user_identifier = $2',
      [prompt_id, userId]
    );

    let result;
    if (existingRating.rows.length > 0) {
      // Update existing rating
      result = await pool.query(
        `UPDATE ratings
         SET rating = $1, review = $2, updated_at = NOW()
         WHERE prompt_id = $3 AND user_identifier = $4
         RETURNING *`,
        [rating, review || null, prompt_id, userId]
      );
    } else {
      // Create new rating
      result = await pool.query(
        `INSERT INTO ratings (
          prompt_id, rating, review, user_identifier, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *`,
        [prompt_id, rating, review || null, userId]
      );
    }

    // Update prompt average rating
    await updatePromptAverageRating(prompt_id);

    res.status(200).json({
      message: existingRating.rows.length > 0 ? 'Rating updated successfully' : 'Rating created successfully',
      rating: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating/updating rating:', error);
    return res.status(500).json({ error: 'Failed to process rating' });
  }
}

// Get ratings for a prompt
async function getRatings(req, res) {
  const { prompt_id } = req.query;

  if (!prompt_id) {
    return res.status(400).json({ error: 'prompt_id is required' });
  }

  try {
    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM ratings WHERE prompt_id = $1',
      [prompt_id]
    );

    // Get all ratings
    const ratingsResult = await pool.query(
      `SELECT id, rating, review, user_identifier, created_at, updated_at
       FROM ratings WHERE prompt_id = $1
       ORDER BY created_at DESC`,
      [prompt_id]
    );

    // Get rating statistics
    const statsResult = await pool.query(
      `SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_ratings,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
       FROM ratings WHERE prompt_id = $1`,
      [prompt_id]
    );

    res.status(200).json({
      prompt_id: parseInt(prompt_id),
      total_ratings: parseInt(countResult.rows[0].total),
      average_rating: parseFloat(statsResult.rows[0].average_rating) || 0,
      rating_distribution: {
        five_star: parseInt(statsResult.rows[0].five_star) || 0,
        four_star: parseInt(statsResult.rows[0].four_star) || 0,
        three_star: parseInt(statsResult.rows[0].three_star) || 0,
        two_star: parseInt(statsResult.rows[0].two_star) || 0,
        one_star: parseInt(statsResult.rows[0].one_star) || 0
      },
      ratings: ratingsResult.rows
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    return res.status(500).json({ error: 'Failed to fetch ratings' });
  }
}

// Update rating (same as create for simplicity)
async function updateRating(req, res) {
  return await createRating(req, res);
}

// Helper function to update prompt average rating
async function updatePromptAverageRating(promptId) {
  try {
    const result = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings FROM ratings WHERE prompt_id = $1',
      [promptId]
    );

    const avgRating = parseFloat(result.rows[0].avg_rating) || 0;
    const totalRatings = parseInt(result.rows[0].total_ratings) || 0;

    await pool.query(
      'UPDATE prompts SET rating = $1, rating_count = $2 WHERE id = $3',
      [avgRating, totalRatings, promptId]
    );
  } catch (error) {
    console.error('Error updating prompt average rating:', error);
    // Don't throw error here to avoid breaking the main rating operation
  }
}

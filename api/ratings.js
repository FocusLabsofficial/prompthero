// CodePrompt Hub - Ratings API (ESM)
import db from '../database/db.js';
const { pool } = db;

// Handle rating operations for prompts
export default async function handler(request, response) {
  try {
    const { method } = request;

    if (method === 'POST') {
      return await createRating(request, response);
    } else if (method === 'GET') {
      return await getRatings(request, response);
    } else if (method === 'PUT') {
      return await updateRating(request, response);
    } else {
      response.setHeader('Allow', ['POST', 'GET', 'PUT']);
      return response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Ratings API Error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

// Create or update a rating
async function createRating(request, response) {
  const { prompt_id, rating, review, user_identifier } = request.body;

  // Validation
  if (!prompt_id || !rating || rating < 1 || rating > 5) {
    return response.status(400).json({ 
      error: 'Missing or invalid required fields: prompt_id, rating (1-5)' 
    });
  }

  if (!user_identifier) {
    return response.status(400).json({ 
      error: 'User identifier is required' 
    });
  }

  try {
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE prompt_id = $1 AND user_identifier = $2',
      [prompt_id, user_identifier]
    );

    if (existingRating.rows.length > 0) {
      const result = await pool.query(
        `UPDATE ratings 
         SET rating = $1, review = $2, updated_at = NOW()
         WHERE prompt_id = $3 AND user_identifier = $4
         RETURNING *`,
        [rating, review || null, prompt_id, user_identifier]
      );

      await updatePromptAverageRating(prompt_id);

      return response.status(200).json({
        message: 'Rating updated successfully',
        rating: result.rows[0]
      });
    } else {
      const result = await pool.query(
        `INSERT INTO ratings (
           prompt_id, rating, review, user_identifier, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [prompt_id, rating, review || null, user_identifier]
      );

      await updatePromptAverageRating(prompt_id);

      return response.status(201).json({
        message: 'Rating created successfully',
        rating: result.rows[0]
      });
    }

  } catch (error) {
    console.error('Error creating/updating rating:', error);
    return response.status(500).json({ error: 'Failed to process rating' });
  }
}

// Get ratings for a prompt
async function getRatings(request, response) {
  const { prompt_id, page = 1, limit = 10 } = request.query;

  if (!prompt_id) {
    return response.status(400).json({ error: 'prompt_id is required' });
  }

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM ratings WHERE prompt_id = $1',
      [prompt_id]
    );
    const total = parseInt(countResult.rows[0].total);

    const ratingsResult = await pool.query(
      `SELECT id, rating, review, user_identifier, created_at, updated_at
       FROM ratings WHERE prompt_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [prompt_id, parseInt(limit), offset]
    );

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

    return response.status(200).json({
      ratings: ratingsResult.rows,
      statistics: statsResult.rows[0],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    return response.status(500).json({ error: 'Failed to fetch ratings' });
  }
}

// Update rating (same as create for simplicity)
async function updateRating(request, response) {
  return await createRating(request, response);
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

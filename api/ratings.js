// CodePrompt Hub - Ratings API (ESM)
import { sql } from '@vercel/postgres';

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
    // Check if user has already rated this prompt
    const existingRating = await sql`
      SELECT id FROM ratings 
      WHERE prompt_id = ${prompt_id} AND user_identifier = ${user_identifier}
    `;

    if (existingRating.rowCount > 0) {
      // Update existing rating
      const result = await sql`
        UPDATE ratings 
        SET 
          rating = ${rating},
          review = ${review || null},
          updated_at = NOW()
        WHERE prompt_id = ${prompt_id} AND user_identifier = ${user_identifier}
        RETURNING *
      `;

      await updatePromptAverageRating(prompt_id);

      return response.status(200).json({
        message: 'Rating updated successfully',
        rating: result.rows[0]
      });
    } else {
      // Create new rating
      const result = await sql`
        INSERT INTO ratings (
          prompt_id,
          rating,
          review,
          user_identifier,
          created_at,
          updated_at
        )
        VALUES (
          ${prompt_id},
          ${rating},
          ${review || null},
          ${user_identifier},
          NOW(),
          NOW()
        )
        RETURNING *
      `;

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

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total 
      FROM ratings 
      WHERE prompt_id = ${prompt_id}
    `;
    const total = parseInt(countResult.rows[0].total);

    // Get ratings with pagination
    const ratingsResult = await sql`
      SELECT 
        id,
        rating,
        review,
        user_identifier,
        created_at,
        updated_at
      FROM ratings 
      WHERE prompt_id = ${prompt_id}
      ORDER BY created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${offset}
    `;

    // Get rating statistics
    const statsResult = await sql`
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_ratings,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM ratings 
      WHERE prompt_id = ${prompt_id}
    `;

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
    const result = await sql`
      SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings
      FROM ratings 
      WHERE prompt_id = ${promptId}
    `;

    const avgRating = parseFloat(result.rows[0].avg_rating) || 0;
    const totalRatings = parseInt(result.rows[0].total_ratings) || 0;

    await sql`
      UPDATE prompts 
      SET 
        rating = ${avgRating},
        rating_count = ${totalRatings}
      WHERE id = ${promptId}
    `;

  } catch (error) {
    console.error('Error updating prompt average rating:', error);
    // Don't throw error here to avoid breaking the main rating operation
  }
}

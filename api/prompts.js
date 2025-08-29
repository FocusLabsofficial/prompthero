// PromptHero - Prompts API (ESM)
import db from '../database/db.js';

const { getPrompts, createPrompt, getCategories, pool } = db;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get query parameters
      const { category, language, search, sort, limit = 20, offset = 0 } = req.query;
      
      // Build filters object
      const filters = {};
      if (category) filters.category = category;
      if (language) filters.language = language;
      if (search) filters.search = search;
      if (sort) filters.sort = sort;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);
      
      // Fetch prompts from database
      const prompts = await getPrompts(filters);
      
      // Get total count for pagination
      const totalPrompts = await getPrompts({ ...filters, limit: null, offset: null });
      
      const response = {
        prompts: prompts.map(prompt => ({
          id: prompt.id,
          title: prompt.title,
          category: prompt.category_slug,
          language: prompt.language,
          prompt_text: prompt.prompt_text,
          description: prompt.description,
          rating: parseFloat(prompt.rating) || 0,
          usage_count: prompt.usage_count || 0,
          created_at: prompt.created_at
        })),
        pagination: {
          page: Math.floor(offset / limit) + 1,
          limit: parseInt(limit),
          total: totalPrompts.length,
          totalPages: Math.ceil(totalPrompts.length / limit)
        }
      };
      
      res.status(200).json(response);
      
    } else if (req.method === 'POST') {
      // Create new prompt
      const promptData = req.body;

      // Accept either category_id or category_slug
      let categoryId = promptData.category_id;
      if (!categoryId && promptData.category_slug) {
        try {
          const result = await pool.query(
            'SELECT id FROM categories WHERE slug = $1 LIMIT 1',
            [promptData.category_slug]
          );
          if (result.rows.length > 0) {
            categoryId = result.rows[0].id;
          }
        } catch (e) {
          // fall through to validation error below
        }
      }

      // Validate required fields
      if (!promptData.title || !promptData.prompt_text || !categoryId) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, prompt_text, and category (id or slug)'
        });
      }

      const newPrompt = await createPrompt({
        ...promptData,
        category_id: categoryId,
      });

      res.status(201).json({ 
        message: 'Prompt created successfully', 
        prompt: newPrompt 
      });
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

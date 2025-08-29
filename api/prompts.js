// PromptHero - Prompts API (ESM)
import db from '../database/db.js';

const { getPrompts, createPrompt, pool } = db;

// Simple in-memory rate limiting store
const rateLimitStore = new Map();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

// Rate limiting middleware
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimitStore.set(ip, validRequests);
  
  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  validRequests.push(now);
  return true; // Request allowed
}

// Get client IP
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

  // Rate limiting check
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: 60
    });
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
          category: prompt.category,
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

      // Validate required fields
      if (!promptData.title || !promptData.prompt_text || !promptData.category_slug) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, prompt_text, and category_slug'
        });
      }

      const newPrompt = await createPrompt({
        title: promptData.title,
        description: promptData.description || '',
        prompt_text: promptData.prompt_text,
        category: promptData.category_slug,
        language: promptData.language || 'general',
        tags: promptData.tags || []
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

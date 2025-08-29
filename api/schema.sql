-- CodePrompt Hub Database Schema
-- PostgreSQL schema for the prompt sharing platform

-- Create the prompts table
CREATE TABLE IF NOT EXISTS prompts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    language VARCHAR(50) DEFAULT 'general',
    prompt_text TEXT NOT NULL,
    description TEXT NOT NULL,
    author VARCHAR(100) DEFAULT 'Anonymous',
    tags TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    prompt_id INTEGER NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    user_identifier VARCHAR(255) NOT NULL, -- Could be IP, session ID, or user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prompt_id, user_identifier) -- Prevent duplicate ratings from same user
);

-- Create the categories table for reference
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the languages table for reference
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id SERIAL PRIMARY KEY,
    prompt_id INTEGER NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    user_identifier VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_language ON prompts(language);
CREATE INDEX IF NOT EXISTS idx_prompts_rating ON prompts(rating DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_usage_count ON prompts(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_featured ON prompts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_prompts_approved ON prompts(is_approved) WHERE is_approved = TRUE;

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_prompts_fulltext ON prompts USING gin(
    to_tsvector('english', title || ' ' || description || ' ' || prompt_text)
);

CREATE INDEX IF NOT EXISTS idx_ratings_prompt_id ON ratings(prompt_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_identifier);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_prompt_id ON usage_tracking(prompt_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_created_at ON usage_tracking(created_at);

-- Insert default categories
INSERT INTO categories (name, display_name, description, icon, sort_order) VALUES
('debugging', 'Debugging', 'Find and fix bugs efficiently', '🐛', 1),
('testing', 'Testing', 'Write comprehensive tests', '🧪', 2),
('optimization', 'Performance', 'Optimize code performance', '⚡', 3),
('refactoring', 'Refactoring', 'Improve code structure', '🔧', 4),
('documentation', 'Documentation', 'Generate clear documentation', '📚', 5),
('security', 'Security', 'Secure coding practices', '🔒', 6),
('architecture', 'Architecture', 'System design and architecture', '🏗️', 7),
('api', 'API Development', 'API design and development', '🔌', 8),
('database', 'Database', 'Database queries and optimization', '🗄️', 9),
('frontend', 'Frontend', 'UI/UX and frontend development', '🎨', 10),
('backend', 'Backend', 'Server-side development', '⚙️', 11),
('devops', 'DevOps', 'Deployment and infrastructure', '🚀', 12)
ON CONFLICT (name) DO NOTHING;

-- Insert default programming languages
INSERT INTO languages (code, name, sort_order) VALUES
('general', 'General', 0),
('javascript', 'JavaScript', 1),
('typescript', 'TypeScript', 2),
('python', 'Python', 3),
('java', 'Java', 4),
('csharp', 'C#', 5),
('cpp', 'C++', 6),
('go', 'Go', 7),
('rust', 'Rust', 8),
('php', 'PHP', 9),
('ruby', 'Ruby', 10),
('swift', 'Swift', 11),
('kotlin', 'Kotlin', 12),
('dart', 'Dart', 13),
('sql', 'SQL', 14),
('html', 'HTML', 15),
('css', 'CSS', 16),
('shell', 'Shell/Bash', 17),
('powershell', 'PowerShell', 18),
('r', 'R', 19),
('matlab', 'MATLAB', 20)
ON CONFLICT (code) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_prompts_updated_at 
    BEFORE UPDATE ON prompts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at 
    BEFORE UPDATE ON ratings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage_count(prompt_id_param INTEGER, user_id_param VARCHAR DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    -- Update usage count
    UPDATE prompts 
    SET usage_count = usage_count + 1 
    WHERE id = prompt_id_param;
    
    -- Log the usage
    INSERT INTO usage_tracking (prompt_id, user_identifier, created_at)
    VALUES (prompt_id_param, user_id_param, NOW());
END;
$$ LANGUAGE plpgsql;

-- View for prompt statistics
CREATE OR REPLACE VIEW prompt_stats AS
SELECT 
    p.id,
    p.title,
    p.category,
    p.language,
    p.rating,
    p.rating_count,
    p.usage_count,
    p.created_at,
    c.display_name as category_display,
    c.icon as category_icon,
    l.name as language_display,
    COALESCE(recent_usage.recent_uses, 0) as recent_usage_count
FROM prompts p
LEFT JOIN categories c ON p.category = c.name
LEFT JOIN languages l ON p.language = l.code
LEFT JOIN (
    SELECT 
        prompt_id, 
        COUNT(*) as recent_uses
    FROM usage_tracking 
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY prompt_id
) recent_usage ON p.id = recent_usage.prompt_id
WHERE p.is_approved = TRUE;

-- Insert sample prompts for demonstration
INSERT INTO prompts (title, category, language, prompt_text, description, author, tags, rating, rating_count, usage_count) VALUES
(
    'Debug Function Logic',
    'debugging',
    'javascript',
    'I have a function that''s not working as expected. Can you help me debug it?

Here''s the function:
```javascript
[PASTE YOUR CODE HERE]
```

The expected behavior is: [DESCRIBE EXPECTED BEHAVIOR]
The actual behavior is: [DESCRIBE ACTUAL BEHAVIOR]

Please analyze the logic and suggest fixes.',
    'Use this prompt when you need help debugging function logic. Replace the placeholders with your actual code and behavior descriptions.',
    'developer_pro',
    ARRAY['debugging', 'javascript', 'functions'],
    4.5,
    23,
    342
),
(
    'Write Unit Tests',
    'testing',
    'python',
    'Create comprehensive unit tests for the following Python function:

```python
[PASTE YOUR FUNCTION HERE]
```

Please include:
- Edge cases
- Error handling tests
- Performance considerations
- Mock dependencies if needed

Use pytest framework and follow best practices.',
    'Generate thorough unit tests for any Python function. Covers edge cases, error handling, and follows pytest conventions.',
    'test_guru',
    ARRAY['testing', 'python', 'pytest', 'unit-tests'],
    4.8,
    31,
    567
),
(
    'Optimize Algorithm Performance',
    'optimization',
    'general',
    'Analyze the following algorithm and suggest optimizations:

```
[PASTE YOUR ALGORITHM/CODE HERE]
```

Current time complexity: [IF KNOWN]
Input size expectations: [DESCRIBE DATA SIZE]

Please provide:
1. Time/space complexity analysis
2. Bottleneck identification
3. Optimization suggestions
4. Alternative approaches if applicable',
    'Get expert advice on optimizing algorithms. Includes complexity analysis and practical optimization strategies.',
    'algo_expert',
    ARRAY['optimization', 'algorithms', 'performance', 'complexity'],
    4.6,
    18,
    289
)
ON CONFLICT DO NOTHING;

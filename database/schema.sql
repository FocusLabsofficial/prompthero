-- CodePrompt Hub Database Schema
-- PostgreSQL schema for the CodePrompt Hub application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompts table
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    language VARCHAR(50),
    tags TEXT[],
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prompt_id, user_id)
);

-- Bookmarks table
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prompt_id, user_id)
);

-- Likes table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prompt_id, user_id)
);

-- Usage tracking table
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_prompts_category ON prompts(category_id);
CREATE INDEX idx_prompts_rating ON prompts(rating DESC);
CREATE INDEX idx_prompts_usage ON prompts(usage_count DESC);
CREATE INDEX idx_prompts_created ON prompts(created_at DESC);
CREATE INDEX idx_ratings_prompt ON ratings(prompt_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_likes_prompt ON likes(prompt_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_usage_tracking_prompt ON usage_tracking(prompt_id);

-- Triggers for updating prompt statistics
CREATE OR REPLACE FUNCTION update_prompt_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        -- Update rating and rating_count
        UPDATE prompts 
        SET 
            rating = COALESCE(
                (SELECT AVG(rating)::DECIMAL(3,2) 
                 FROM ratings 
                 WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id)), 
                0
            ),
            rating_count = (
                SELECT COUNT(*) 
                FROM ratings 
                WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id)
            )
        WHERE id = COALESCE(NEW.prompt_id, OLD.prompt_id);
        
        -- Update likes_count
        UPDATE prompts 
        SET likes_count = (
            SELECT COUNT(*) 
            FROM likes 
            WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id)
        )
        WHERE id = COALESCE(NEW.prompt_id, OLD.prompt_id);
        
        RETURN COALESCE(NEW, OLD);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_prompt_stats_rating
    AFTER INSERT OR UPDATE OR DELETE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_prompt_stats();

CREATE TRIGGER trigger_update_prompt_stats_likes
    AFTER INSERT OR UPDATE OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_prompt_stats();

-- Function to update usage count
CREATE OR REPLACE FUNCTION update_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE prompts 
    SET usage_count = usage_count + 1
    WHERE id = NEW.prompt_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_usage_count
    AFTER INSERT ON usage_tracking
    FOR EACH ROW EXECUTE FUNCTION update_usage_count();

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Debugging', 'debugging', 'Fix React, Python, SQL, and API issues', '🐛', '#FF6B6B'),
('Testing', 'testing', 'Unit, e2e, load testing & automation', '🧪', '#4ECDC4'),
('Performance', 'optimization', 'React, database & frontend optimization', '⚡', '#45B7D1'),
('Refactoring', 'refactoring', 'Clean code, microservices & modernization', '🔧', '#96CEB4'),
('Documentation', 'documentation', 'APIs, technical specs & project docs', '📚', '#FFEAA7'),
('Security', 'security', 'Security audits & authentication systems', '🔒', '#DDA0DD'),
('Frontend', 'frontend', 'UI libraries, PWAs & accessibility', '🎨', '#98D8C8'),
('DevOps', 'devops', 'Kubernetes, CI/CD & cloud deployment', '🚀', '#F7DC6F'),
('Backend', 'backend', 'API development, databases & server architecture', '⚙️', '#BB8FCE'),
('Mobile', 'mobile', 'React Native, Flutter & native app development', '📱', '#85C1E9'),
('AI & ML', 'ai-ml', 'Machine learning, data science & AI integration', '🤖', '#F8C471'),
('Database', 'database', 'SQL, NoSQL, migrations & data modeling', '🗄️', '#82E0AA'),
('API Design', 'api', 'REST, GraphQL & API best practices', '🔌', '#F1948A'),
('Cloud', 'cloud', 'AWS, Azure, GCP & serverless architecture', '☁️', '#85C1E9'),
('Blockchain', 'blockchain', 'Smart contracts, Web3 & decentralized apps', '⛓️', '#F7DC6F'),
('Game Development', 'game-dev', 'Unity, Unreal Engine & game mechanics', '🎮', '#D7BDE2'),
('Data Visualization', 'data-viz', 'Charts, dashboards & interactive graphics', '📊', '#A9CCE3'),
('Automation', 'automation', 'Scripts, bots & workflow automation', '🤖', '#F8C471');

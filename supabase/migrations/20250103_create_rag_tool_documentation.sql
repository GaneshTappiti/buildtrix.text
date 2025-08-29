-- Create RAG Tool Documentation tables for storing tool-specific documentation and prompts
-- This replaces the file-based system from the Python RAG with database storage

-- Enable the vector extension for embeddings (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create enum for RAG tools
CREATE TYPE rag_tool_type AS ENUM (
  'lovable',
  'uizard', 
  'adalo',
  'flutterflow',
  'framer',
  'bubble',
  'bolt',
  'cursor',
  'cline',
  'v0',
  'devin',
  'windsurf',
  'roocode',
  'manus',
  'same_dev'
);

-- Create enum for document types
CREATE TYPE rag_document_type AS ENUM (
  'prompt_template',
  'best_practices',
  'constraints',
  'examples',
  'api_reference',
  'user_guide',
  'troubleshooting'
);

-- Create enum for prompt stages
CREATE TYPE rag_prompt_stage AS ENUM (
  'app_skeleton',
  'page_ui', 
  'flow_connections',
  'feature_specific',
  'debugging',
  'optimization'
);

-- Main table for tool documentation
CREATE TABLE rag_tool_documentation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id rag_tool_type NOT NULL,
  document_type rag_document_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  prompt_template TEXT,
  stage rag_prompt_stage,
  
  -- Metadata
  source_file VARCHAR(255),
  version VARCHAR(50) DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  
  -- Vector embedding for semantic search
  embedding vector(1536), -- OpenAI/Gemini embedding dimension
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  UNIQUE(tool_id, document_type, title)
);

-- Create indexes for better performance
CREATE INDEX idx_rag_tool_documentation_tool_id ON rag_tool_documentation(tool_id);
CREATE INDEX idx_rag_tool_documentation_document_type ON rag_tool_documentation(document_type);
CREATE INDEX idx_rag_tool_documentation_stage ON rag_tool_documentation(stage);
CREATE INDEX idx_rag_tool_documentation_is_active ON rag_tool_documentation(is_active);

-- Create vector similarity search index
CREATE INDEX idx_rag_tool_documentation_embedding ON rag_tool_documentation 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Table for storing tool-specific optimization tips
CREATE TABLE rag_tool_optimizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id rag_tool_type NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'optimization_tip', 'constraint', 'best_practice', 'common_pitfall'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Context filters
  app_types TEXT[], -- JSON array of compatible app types
  platforms TEXT[], -- JSON array of compatible platforms
  complexity_levels TEXT[], -- JSON array of complexity levels
  
  -- Priority and effectiveness
  priority INTEGER DEFAULT 1, -- 1 = highest priority
  effectiveness_score DECIMAL(3,2) DEFAULT 0.8, -- 0.0 to 1.0
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for optimizations table
CREATE INDEX idx_rag_tool_optimizations_tool_id ON rag_tool_optimizations(tool_id);
CREATE INDEX idx_rag_tool_optimizations_category ON rag_tool_optimizations(category);
CREATE INDEX idx_rag_tool_optimizations_priority ON rag_tool_optimizations(priority);
CREATE INDEX idx_rag_tool_optimizations_is_active ON rag_tool_optimizations(is_active);

-- Table for storing prompt generation history and analytics
CREATE TABLE rag_prompt_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tool_id rag_tool_type,
  prompt_type VARCHAR(50) NOT NULL, -- 'framework', 'page', 'linking'
  
  -- Request context
  app_type VARCHAR(50),
  platforms TEXT[],
  project_description TEXT,
  
  -- Generated content
  generated_prompt TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  sources_used TEXT[], -- Array of documentation IDs used
  
  -- Quality metrics
  user_rating INTEGER, -- 1-5 rating from user
  was_used BOOLEAN DEFAULT false,
  feedback TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for prompt history
CREATE INDEX idx_rag_prompt_history_user_id ON rag_prompt_history(user_id);
CREATE INDEX idx_rag_prompt_history_tool_id ON rag_prompt_history(tool_id);
CREATE INDEX idx_rag_prompt_history_prompt_type ON rag_prompt_history(prompt_type);
CREATE INDEX idx_rag_prompt_history_created_at ON rag_prompt_history(created_at);

-- Create updated_at trigger for documentation table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rag_tool_documentation_updated_at 
    BEFORE UPDATE ON rag_tool_documentation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rag_tool_optimizations_updated_at 
    BEFORE UPDATE ON rag_tool_optimizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE rag_tool_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_tool_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_prompt_history ENABLE ROW LEVEL SECURITY;

-- Public read access for documentation (since it's reference material)
CREATE POLICY "Public read access for tool documentation" ON rag_tool_documentation
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for tool optimizations" ON rag_tool_optimizations
    FOR SELECT USING (is_active = true);

-- Users can only access their own prompt history
CREATE POLICY "Users can view own prompt history" ON rag_prompt_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompt history" ON rag_prompt_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompt history" ON rag_prompt_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (for managing documentation)
CREATE POLICY "Admins can manage tool documentation" ON rag_tool_documentation
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage tool optimizations" ON rag_tool_optimizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Function to search documentation by similarity
CREATE OR REPLACE FUNCTION search_tool_documentation(
    query_embedding vector(1536),
    tool_filter rag_tool_type DEFAULT NULL,
    document_type_filter rag_document_type DEFAULT NULL,
    similarity_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    tool_id rag_tool_type,
    document_type rag_document_type,
    title VARCHAR(255),
    content TEXT,
    prompt_template TEXT,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rtd.id,
        rtd.tool_id,
        rtd.document_type,
        rtd.title,
        rtd.content,
        rtd.prompt_template,
        1 - (rtd.embedding <=> query_embedding) AS similarity
    FROM rag_tool_documentation rtd
    WHERE 
        rtd.is_active = true
        AND (tool_filter IS NULL OR rtd.tool_id = tool_filter)
        AND (document_type_filter IS NULL OR rtd.document_type = document_type_filter)
        AND 1 - (rtd.embedding <=> query_embedding) > similarity_threshold
    ORDER BY rtd.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Function to get tool optimizations with context filtering
CREATE OR REPLACE FUNCTION get_tool_optimizations(
    tool_filter rag_tool_type,
    app_type_filter TEXT DEFAULT NULL,
    platform_filter TEXT DEFAULT NULL,
    complexity_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    category VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    priority INTEGER,
    effectiveness_score DECIMAL(3,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rto.id,
        rto.category,
        rto.title,
        rto.description,
        rto.priority,
        rto.effectiveness_score
    FROM rag_tool_optimizations rto
    WHERE 
        rto.tool_id = tool_filter
        AND rto.is_active = true
        AND (app_type_filter IS NULL OR app_type_filter = ANY(rto.app_types))
        AND (platform_filter IS NULL OR platform_filter = ANY(rto.platforms))
        AND (complexity_filter IS NULL OR complexity_filter = ANY(rto.complexity_levels))
    ORDER BY rto.priority ASC, rto.effectiveness_score DESC;
END;
$$;

-- Comments for documentation
COMMENT ON TABLE rag_tool_documentation IS 'Stores tool-specific documentation, prompts, and reference materials for RAG system';
COMMENT ON TABLE rag_tool_optimizations IS 'Stores optimization tips, constraints, and best practices for each tool';
COMMENT ON TABLE rag_prompt_history IS 'Tracks generated prompts for analytics and improvement';
COMMENT ON FUNCTION search_tool_documentation IS 'Performs vector similarity search on tool documentation';
COMMENT ON FUNCTION get_tool_optimizations IS 'Retrieves filtered optimization tips for a specific tool and context';

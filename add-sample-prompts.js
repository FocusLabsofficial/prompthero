#!/usr/bin/env node

// Add sample prompts to database
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const samplePrompts = [
  {
    title: "React Component Optimization",
    category: "optimization",
    language: "javascript",
    prompt_text: "Help me optimize this React component for better performance:\n\n```jsx\n[PASTE YOUR COMPONENT HERE]\n```\n\nIssues I'm experiencing:\n- [DESCRIBE PERFORMANCE ISSUES]\n- Re-renders: [FREQUENCY]\n- Bundle size: [IF KNOWN]\n\nPlease suggest:\n1. Memoization strategies\n2. Component splitting opportunities\n3. State management optimizations\n4. Bundle optimization techniques",
    description: "Optimize React components for better performance, including memoization and bundle optimization.",
    tags: ["react", "optimization", "javascript", "performance"]
  },
  {
    title: "API Security Review",
    category: "security",
    language: "general",
    prompt_text: "Perform a comprehensive security review of this API endpoint:\n\n```[LANGUAGE]\n[PASTE YOUR API CODE HERE]\n```\n\n**Context:**\n- Authentication method: [JWT/OAuth/BASIC]\n- Data sensitivity: [HIGH/MEDIUM/LOW]\n- User roles: [DESCRIBE ROLES]\n\n**Security checklist:**\n1. Input validation and sanitization\n2. Authentication and authorization\n3. SQL injection prevention\n4. XSS protection\n5. Rate limiting\n6. Data encryption\n7. Error handling\n8. Logging and monitoring\n\nProvide specific remediation steps for each vulnerability found.",
    description: "Comprehensive API security review covering OWASP Top 10 vulnerabilities.",
    tags: ["security", "api", "authentication", "owasp"]
  },
  {
    title: "Database Query Optimization",
    category: "database",
    language: "sql",
    prompt_text: "Optimize this database query for better performance:\n\n```sql\n[PASTE YOUR SLOW QUERY HERE]\n```\n\n**Database context:**\n- Database: [PostgreSQL/MySQL/SQL Server]\n- Table sizes: [ROW COUNTS]\n- Current performance: [EXECUTION TIME]\n- Target performance: [DESIRED TIME]\n\n**Schema information:**\n```sql\n[PASTE RELEVANT TABLE SCHEMAS]\n```\n\n**Please analyze and optimize:**\n1. Query execution plan analysis\n2. Index recommendations\n3. Query rewriting suggestions\n4. Database configuration tuning\n5. Connection pooling optimization",
    description: "Complete database query optimization with performance analysis and tuning recommendations.",
    tags: ["database", "sql", "optimization", "performance"]
  },
  {
    title: "Docker Container Security",
    category: "security",
    language: "dockerfile",
    prompt_text: "Review and secure this Docker container configuration:\n\n```dockerfile\n[PASTE YOUR DOCKERFILE HERE]\n```\n\n**Application context:**\n- Application type: [WEB/API/BATCH]\n- Base image: [SPECIFY IMAGE]\n- Exposed ports: [LIST PORTS]\n\n**Security checklist:**\n1. Base image security\n2. User permissions and privileges\n3. Secrets management\n4. Network security\n5. Resource limits\n6. Vulnerability scanning\n7. Multi-stage builds\n8. Image size optimization\n\nProvide specific security improvements and best practices.",
    description: "Comprehensive Docker security review with container hardening recommendations.",
    tags: ["docker", "security", "container", "devops"]
  },
  {
    title: "TypeScript Error Handling",
    category: "debugging",
    language: "typescript",
    prompt_text: "Help me implement proper error handling in this TypeScript code:\n\n```typescript\n[PASTE YOUR CODE HERE]\n```\n\n**Current issues:**\n- Error types: [DESCRIBE ERRORS]\n- Error handling: [CURRENT APPROACH]\n- User experience: [HOW ERRORS ARE DISPLAYED]\n\n**Please implement:**\n1. Custom error types and interfaces\n2. Try-catch blocks with proper typing\n3. Error boundaries (if React)\n4. User-friendly error messages\n5. Error logging and monitoring\n6. Graceful degradation strategies",
    description: "Implement robust TypeScript error handling with proper typing and user experience.",
    tags: ["typescript", "error-handling", "debugging", "types"]
  },
  {
    title: "GraphQL Schema Design",
    category: "api",
    language: "graphql",
    prompt_text: "Design a GraphQL schema for this application:\n\n**Application requirements:**\n- Main entities: [LIST ENTITIES]\n- Relationships: [DESCRIBE RELATIONSHIPS]\n- Query complexity: [SIMPLE/COMPLEX]\n- Real-time features: [SUBSCRIPTIONS NEEDED?]\n\n**Please design:**\n1. Type definitions and interfaces\n2. Query and mutation schemas\n3. Input validation types\n4. Error handling types\n5. Subscription schemas (if needed)\n6. Schema documentation\n7. Performance considerations\n8. Security and authorization\n\nInclude examples of queries and mutations.",
    description: "Complete GraphQL schema design with types, queries, mutations, and best practices.",
    tags: ["graphql", "api", "schema", "types"]
  },
  {
    title: "Python Data Processing Pipeline",
    category: "automation",
    language: "python",
    prompt_text: "Create a data processing pipeline for this task:\n\n**Data requirements:**\n- Input format: [CSV/JSON/XML/DATABASE]\n- Data size: [APPROXIMATE SIZE]\n- Processing steps: [LIST STEPS]\n- Output format: [DESIRED OUTPUT]\n\n**Please implement:**\n1. Data loading and validation\n2. Data cleaning and transformation\n3. Processing pipeline architecture\n4. Error handling and logging\n5. Performance optimization\n6. Testing framework\n7. Monitoring and metrics\n8. Deployment strategy\n\nUse pandas, numpy, or other relevant libraries.",
    description: "Robust Python data processing pipeline with error handling and performance optimization.",
    tags: ["python", "data-processing", "pandas", "automation"]
  },
  {
    title: "AWS Lambda Function",
    category: "cloud",
    language: "javascript",
    prompt_text: "Create an AWS Lambda function for this use case:\n\n**Function requirements:**\n- Trigger: [API GATEWAY/S3/SQS/EVENTBRIDGE]\n- Runtime: [NODE.JS/PYTHON/JAVA]\n- Purpose: [DESCRIBE FUNCTIONALITY]\n- Performance: [RESPONSE TIME REQUIREMENTS]\n\n**Please implement:**\n1. Function handler and logic\n2. Error handling and logging\n3. Environment configuration\n4. IAM permissions\n5. API Gateway integration (if needed)\n6. Testing framework\n7. Monitoring and alerting\n8. Cost optimization\n\nInclude CloudFormation/SAM templates.",
    description: "Complete AWS Lambda function with proper error handling, monitoring, and deployment.",
    tags: ["aws", "lambda", "serverless", "cloud"]
  }
];

async function addSamplePrompts() {
  console.log('🚀 Adding sample prompts to database...');
  
  try {
    const client = await pool.connect();
    
    for (const prompt of samplePrompts) {
      const query = `
        INSERT INTO prompts (
          title, description, prompt_text, category, language, tags, 
          rating, rating_count, usage_count, is_approved
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `;
      
      const values = [
        prompt.title,
        prompt.description,
        prompt.prompt_text,
        prompt.category,
        prompt.language,
        prompt.tags,
        Math.random() * 2 + 3, // Random rating between 3-5
        Math.floor(Math.random() * 50) + 10, // Random rating count
        Math.floor(Math.random() * 200) + 50, // Random usage count
        true
      ];
      
      try {
        const result = await client.query(query, values);
        console.log(`✅ Added: ${prompt.title}`);
      } catch (insertError) {
        if (insertError.code === '23505') { // Unique violation
          console.log(`⏭️  Skipped (exists): ${prompt.title}`);
        } else {
          console.log(`❌ Error adding ${prompt.title}:`, insertError.message);
        }
      }
    }
    
    // Get total count
    const countResult = await client.query('SELECT COUNT(*) as total FROM prompts');
    console.log(`📊 Total prompts in database: ${countResult.rows[0].total}`);
    
    client.release();
    console.log('🎉 Sample prompts added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding sample prompts:', error);
  } finally {
    await pool.end();
  }
}

addSamplePrompts();

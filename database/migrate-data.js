// CodePrompt Hub - Data Migration Script
// Migrates existing mock data to PostgreSQL database

const { Pool } = require('pg');

// Database connection (will be set via environment variables)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Mock data from current prompts
const mockPrompts = [
  {
    title: "Debug React Component Issues",
    description: "Debug React components with hooks, state management, and rendering issues. Get clear explanations and fixes.",
    prompt_text: "I'm having issues with this React component. Can you help me debug it?\n\n```jsx\n[PASTE YOUR COMPONENT CODE HERE]\n```\n\nCurrent behavior: [DESCRIBE WHAT'S HAPPENING]\nExpected behavior: [DESCRIBE WHAT SHOULD HAPPEN]\nError messages (if any): [PASTE CONSOLE ERRORS]\n\nPlease help me:\n1. Identify the root cause\n2. Explain why it's happening\n3. Provide a fixed version\n4. Suggest best practices to avoid similar issues",
    category_slug: "debugging",
    language: "javascript",
    tags: ["debugging", "react", "javascript", "frontend"],
    rating: 4.8,
    rating_count: 156,
    usage_count: 892,
    likes_count: 89
  },
  {
    title: "Write TypeScript Tests with Jest",
    description: "Generate comprehensive TypeScript tests with proper typing, mocking, and modern Jest patterns.",
    prompt_text: "Create comprehensive TypeScript tests for this function/class using Jest:\n\n```typescript\n[PASTE YOUR TYPESCRIPT CODE HERE]\n```\n\nPlease include:\n- Type-safe test setup\n- Unit tests for all methods/functions\n- Edge cases and error scenarios\n- Mock implementations for dependencies\n- Test coverage for async operations\n- Proper TypeScript test utilities\n\nUse modern Jest features and TypeScript best practices.",
    category_slug: "testing",
    language: "typescript",
    tags: ["testing", "typescript", "jest", "unit-tests"],
    rating: 4.9,
    rating_count: 234,
    usage_count: 1243,
    likes_count: 156
  },
  {
    title: "Optimize React Performance",
    description: "Optimize React applications for better performance, including memoization, bundle optimization, and render optimization.",
    prompt_text: "My React app is slow and has performance issues. Here's the problematic component:\n\n```jsx\n[PASTE YOUR COMPONENT CODE HERE]\n```\n\nPerformance issues I'm seeing:\n- [DESCRIBE PERFORMANCE PROBLEMS]\n- Bundle size: [IF KNOWN]\n- Render frequency: [IF MEASURED]\n\nPlease help me:\n1. Identify performance bottlenecks\n2. Implement React.memo, useMemo, useCallback where needed\n3. Optimize re-renders and component structure\n4. Suggest code splitting opportunities\n5. Recommend profiling tools and techniques",
    category_slug: "optimization",
    language: "javascript",
    tags: ["optimization", "react", "performance", "frontend"],
    rating: 4.7,
    rating_count: 189,
    usage_count: 756,
    likes_count: 98
  },
  {
    title: "Clean Code Refactoring",
    description: "Transform messy code into clean, maintainable code following industry best practices and SOLID principles.",
    prompt_text: "Please help me refactor this code to follow clean code principles:\n\n```[LANGUAGE]\n[PASTE YOUR CODE HERE]\n```\n\nCurrent issues I see:\n- [LIST ANY KNOWN CODE SMELLS]\n\nPlease refactor focusing on:\n1. Single Responsibility Principle\n2. Clear naming conventions\n3. Function/method length and complexity\n4. Removing code duplication\n5. Improving readability and maintainability\n6. Adding appropriate comments/documentation\n\nExplain each change and why it improves the code.",
    category_slug: "refactoring",
    language: "general",
    tags: ["refactoring", "clean-code", "best-practices", "maintainability"],
    rating: 4.6,
    rating_count: 145,
    usage_count: 634,
    likes_count: 76
  },
  {
    title: "Generate README Documentation",
    description: "Create professional, comprehensive README files that make your projects accessible and well-documented.",
    prompt_text: "Create a comprehensive README.md for my project:\n\n**Project Details:**\n- Project name: [YOUR PROJECT NAME]\n- Description: [BRIEF DESCRIPTION]\n- Tech stack: [LIST TECHNOLOGIES USED]\n- Target audience: [WHO WILL USE THIS]\n\n**Repository structure:**\n```\n[PASTE YOUR PROJECT STRUCTURE OR DESCRIBE IT]\n```\n\nPlease include:\n1. Clear project description and purpose\n2. Installation and setup instructions\n3. Usage examples with code snippets\n4. API documentation (if applicable)\n5. Contributing guidelines\n6. License information\n7. Badges for build status, coverage, etc.\n8. Screenshots or demos (placeholders)\n\nMake it professional and beginner-friendly.",
    category_slug: "documentation",
    language: "markdown",
    tags: ["documentation", "readme", "markdown", "project-setup"],
    rating: 4.8,
    rating_count: 267,
    usage_count: 1089,
    likes_count: 134
  },
  {
    title: "Security Code Review",
    description: "Comprehensive security analysis covering OWASP Top 10 vulnerabilities with actionable remediation steps.",
    prompt_text: "Please perform a security review of this code:\n\n```[LANGUAGE]\n[PASTE YOUR CODE HERE]\n```\n\n**Context:**\n- Application type: [WEB APP/API/MOBILE/DESKTOP]\n- Framework: [SPECIFY FRAMEWORK]\n- User data handled: [DESCRIBE DATA TYPES]\n- Authentication method: [IF APPLICABLE]\n\n**Security checklist:**\n1. Input validation and sanitization\n2. SQL injection prevention\n3. XSS (Cross-Site Scripting) protection\n4. Authentication and authorization flaws\n5. Sensitive data exposure\n6. Security misconfiguration\n7. Insecure dependencies\n8. Cryptographic issues\n\nProvide specific remediation steps for each vulnerability found.",
    category_slug: "security",
    language: "general",
    tags: ["security", "vulnerabilities", "owasp", "code-review"],
    rating: 4.9,
    rating_count: 178,
    usage_count: 445,
    likes_count: 89
  },
  {
    title: "Database Query Optimization",
    description: "Optimize slow database queries with indexing strategies, query restructuring, and performance analysis.",
    prompt_text: "Help me optimize this slow database query:\n\n```sql\n[PASTE YOUR QUERY HERE]\n```\n\n**Database context:**\n- Database system: [PostgreSQL/MySQL/MongoDB/etc.]\n- Table sizes: [APPROXIMATE ROW COUNTS]\n- Current execution time: [IF KNOWN]\n- Existing indexes: [LIST CURRENT INDEXES]\n\n**Performance analysis needed:**\n1. Query execution plan analysis\n2. Index recommendations\n3. Query restructuring suggestions\n4. Join optimization\n5. Subquery vs JOIN performance\n6. Pagination optimization (if applicable)\n\nPlease explain the reasoning behind each optimization.",
    category_slug: "optimization",
    language: "sql",
    tags: ["optimization", "database", "sql", "performance"],
    rating: 4.7,
    rating_count: 156,
    usage_count: 567,
    likes_count: 78
  },
  {
    title: "API Error Handling Best Practices",
    description: "Implement comprehensive API error handling with proper status codes, logging, and user-friendly messages.",
    prompt_text: "Help me implement proper error handling for this API:\n\n```[LANGUAGE]\n[PASTE YOUR API CODE HERE]\n```\n\n**Current issues:**\n- [DESCRIBE ERROR HANDLING PROBLEMS]\n- [LIST ANY ERROR SCENARIOS NOT COVERED]\n\n**Requirements:**\n1. Consistent error response format\n2. Proper HTTP status codes\n3. Meaningful error messages for different audiences\n4. Error logging and monitoring\n5. Graceful degradation\n6. Input validation errors\n7. Database connection errors\n8. Third-party service failures\n\nProvide a robust error handling strategy with examples.",
    category_slug: "debugging",
    language: "general",
    tags: ["debugging", "api", "error-handling", "backend"],
    rating: 4.6,
    rating_count: 134,
    usage_count: 723,
    likes_count: 67
  },
  {
    title: "Write Integration Tests",
    description: "Comprehensive integration testing covering end-to-end workflows, API testing, and external service integration.",
    prompt_text: "Create comprehensive integration tests for this application:\n\n**Application context:**\n- Type: [WEB APP/API/MOBILE]\n- Framework: [SPECIFY FRAMEWORK]\n- Database: [SPECIFY DATABASE]\n- External services: [LIST ANY EXTERNAL APIS]\n\n**Test requirements:**\n1. End-to-end user workflows\n2. API endpoint testing\n3. Database integration tests\n4. External service mocking\n5. Authentication flows\n6. Error scenarios\n7. Performance testing\n8. Security testing\n\n**Please include:**\n- Test setup and teardown\n- Data seeding strategies\n- Mock implementations\n- Assertion patterns\n- Test organization\n- CI/CD integration\n\nUse modern testing frameworks and best practices.",
    category_slug: "testing",
    language: "general",
    tags: ["testing", "integration", "e2e", "automation"],
    rating: 4.8,
    rating_count: 198,
    usage_count: 445,
    likes_count: 112
  },
  {
    title: "Frontend Accessibility Implementation",
    description: "Implement comprehensive accessibility features following WCAG 2.1 AA guidelines for inclusive user experience.",
    prompt_text: "Help me implement accessibility features for this frontend component:\n\n```[LANGUAGE]\n[PASTE YOUR COMPONENT CODE HERE]\n```\n\n**Component context:**\n- Component type: [FORM/NAVIGATION/CONTENT/DISPLAY]\n- Framework: [REACT/VUE/ANGULAR/VANILLA]\n- User interactions: [LIST MAIN INTERACTIONS]\n\n**Accessibility requirements:**\n1. ARIA labels and roles\n2. Keyboard navigation\n3. Screen reader compatibility\n4. Color contrast compliance\n5. Focus management\n6. Semantic HTML structure\n7. Alternative text for images\n8. Form validation and error handling\n\n**Please implement:**\n- Proper ARIA attributes\n- Keyboard event handlers\n- Focus indicators\n- Screen reader announcements\n- WCAG 2.1 AA compliance\n- Testing with assistive technologies\n\nInclude testing strategies and compliance verification.",
    category_slug: "frontend",
    language: "javascript",
    tags: ["frontend", "accessibility", "wcag", "aria"],
    rating: 4.7,
    rating_count: 167,
    usage_count: 389,
    likes_count: 89
  }
];

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...');
    
    // Get category IDs mapping
    const categoryResult = await pool.query('SELECT id, slug FROM categories');
    const categoryMap = {};
    categoryResult.rows.forEach(row => {
      categoryMap[row.slug] = row.id;
    });
    
    console.log('📊 Found categories:', Object.keys(categoryMap));
    
    // Insert prompts
    for (const prompt of mockPrompts) {
      const categoryId = categoryMap[prompt.category_slug];
      if (!categoryId) {
        console.warn(`⚠️  Category not found: ${prompt.category_slug}`);
        continue;
      }
      
      const result = await pool.query(`
        INSERT INTO prompts (
          title, description, prompt_text, category_id, language, tags,
          rating, rating_count, usage_count, likes_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        prompt.title,
        prompt.description,
        prompt.prompt_text,
        categoryId,
        prompt.language,
        prompt.tags,
        prompt.rating,
        prompt.rating_count,
        prompt.usage_count,
        prompt.likes_count
      ]);
      
      console.log(`✅ Migrated: ${prompt.title} (ID: ${result.rows[0].id})`);
    }
    
    console.log('🎉 Data migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };

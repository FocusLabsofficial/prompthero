// CodePrompt Hub - Main JavaScript functionality

// Enhanced prompt data with modern, relevant prompts
const samplePrompts = [
    {
        id: 1,
        title: "Debug React Component Issues",
        category: "debugging",
        language: "javascript",
        text: "I'm having issues with this React component. Can you help me debug it?\n\n```jsx\n[PASTE YOUR COMPONENT CODE HERE]\n```\n\nCurrent behavior: [DESCRIBE WHAT'S HAPPENING]\nExpected behavior: [DESCRIBE WHAT SHOULD HAPPEN]\nError messages (if any): [PASTE CONSOLE ERRORS]\n\nPlease help me:\n1. Identify the root cause\n2. Explain why it's happening\n3. Provide a fixed version\n4. Suggest best practices to avoid similar issues",
        description: "Debug React components with hooks, state management, and rendering issues. Get clear explanations and fixes.",
        rating: 4.8,
        ratingCount: 156,
        uses: 892,
        likes: 89,
        tags: ["debugging", "react", "javascript", "frontend"]
    },
    {
        id: 2,
        title: "Write TypeScript Tests with Jest",
        category: "testing",
        language: "typescript",
        text: "Create comprehensive TypeScript tests for this function/class using Jest:\n\n```typescript\n[PASTE YOUR TYPESCRIPT CODE HERE]\n```\n\nPlease include:\n- Type-safe test setup\n- Unit tests for all methods/functions\n- Edge cases and error scenarios\n- Mock implementations for dependencies\n- Test coverage for async operations\n- Proper TypeScript test utilities\n\nUse modern Jest features and TypeScript best practices.",
        description: "Generate comprehensive TypeScript tests with proper typing, mocking, and modern Jest patterns.",
        rating: 4.9,
        uses: 1243,
        tags: ["testing", "typescript", "jest", "unit-tests"]
    },
    {
        id: 3,
        title: "Optimize React Performance",
        category: "optimization",
        language: "javascript",
        text: "My React app is slow and has performance issues. Here's the problematic component:\n\n```jsx\n[PASTE YOUR COMPONENT CODE HERE]\n```\n\nPerformance issues I'm seeing:\n- [DESCRIBE PERFORMANCE PROBLEMS]\n- Bundle size: [IF KNOWN]\n- Render frequency: [IF MEASURED]\n\nPlease help me:\n1. Identify performance bottlenecks\n2. Implement React.memo, useMemo, useCallback where needed\n3. Optimize re-renders and component structure\n4. Suggest code splitting opportunities\n5. Recommend profiling tools and techniques",
        description: "Optimize React applications for better performance, including memoization, bundle optimization, and render optimization.",
        rating: 4.7,
        uses: 756,
        tags: ["optimization", "react", "performance", "frontend"]
    },
    {
        id: 4,
        title: "Clean Code Refactoring",
        category: "refactoring",
        language: "general",
        text: "Please help me refactor this code to follow clean code principles:\n\n```[LANGUAGE]\n[PASTE YOUR CODE HERE]\n```\n\nCurrent issues I see:\n- [LIST ANY KNOWN CODE SMELLS]\n\nPlease refactor focusing on:\n1. Single Responsibility Principle\n2. Clear naming conventions\n3. Function/method length and complexity\n4. Removing code duplication\n5. Improving readability and maintainability\n6. Adding appropriate comments/documentation\n\nExplain each change and why it improves the code.",
        description: "Transform messy code into clean, maintainable code following industry best practices and SOLID principles.",
        rating: 4.6,
        uses: 634,
        tags: ["refactoring", "clean-code", "best-practices", "maintainability"]
    },
    {
        id: 5,
        title: "Generate README Documentation",
        category: "documentation",
        language: "markdown",
        text: "Create a comprehensive README.md for my project:\n\n**Project Details:**\n- Project name: [YOUR PROJECT NAME]\n- Description: [BRIEF DESCRIPTION]\n- Tech stack: [LIST TECHNOLOGIES USED]\n- Target audience: [WHO WILL USE THIS]\n\n**Repository structure:**\n```\n[PASTE YOUR PROJECT STRUCTURE OR DESCRIBE IT]\n```\n\nPlease include:\n1. Clear project description and purpose\n2. Installation and setup instructions\n3. Usage examples with code snippets\n4. API documentation (if applicable)\n5. Contributing guidelines\n6. License information\n7. Badges for build status, coverage, etc.\n8. Screenshots or demos (placeholders)\n\nMake it professional and beginner-friendly.",
        description: "Create professional, comprehensive README files that make your projects accessible and well-documented.",
        rating: 4.8,
        uses: 1089,
        tags: ["documentation", "readme", "markdown", "project-setup"]
    },
    {
        id: 6,
        title: "Security Code Review",
        category: "security",
        language: "general",
        text: "Please perform a security review of this code:\n\n```[LANGUAGE]\n[PASTE YOUR CODE HERE]\n```\n\n**Context:**\n- Application type: [WEB APP/API/MOBILE/DESKTOP]\n- Framework: [SPECIFY FRAMEWORK]\n- User data handled: [DESCRIBE DATA TYPES]\n- Authentication method: [IF APPLICABLE]\n\n**Security checklist:**\n1. Input validation and sanitization\n2. SQL injection prevention\n3. XSS (Cross-Site Scripting) protection\n4. Authentication and authorization flaws\n5. Sensitive data exposure\n6. Security misconfiguration\n7. Insecure dependencies\n8. Cryptographic issues\n\nProvide specific remediation steps for each vulnerability found.",
        description: "Comprehensive security analysis covering OWASP Top 10 vulnerabilities with actionable remediation steps.",
        rating: 4.9,
        uses: 445,

        tags: ["security", "vulnerabilities", "owasp", "code-review"]
    },
    {
        id: 7,
        title: "Database Query Optimization",
        category: "optimization",
        language: "sql",
        text: "Help me optimize this slow database query:\n\n```sql\n[PASTE YOUR QUERY HERE]\n```\n\n**Database context:**\n- Database system: [PostgreSQL/MySQL/MongoDB/etc.]\n- Table sizes: [APPROXIMATE ROW COUNTS]\n- Current execution time: [IF KNOWN]\n- Existing indexes: [LIST CURRENT INDEXES]\n\n**Performance analysis needed:**\n1. Query execution plan analysis\n2. Index recommendations\n3. Query restructuring suggestions\n4. Join optimization\n5. Subquery vs JOIN performance\n6. Pagination optimization (if applicable)\n\nPlease explain the reasoning behind each optimization.",
        description: "Optimize slow database queries with indexing strategies, query restructuring, and performance analysis.",
        rating: 4.7,
        uses: 567,
        tags: ["optimization", "database", "sql", "performance"]
    },
    {
        id: 8,
        title: "API Error Handling Best Practices",
        category: "debugging",
        language: "general",
        text: "Help me implement proper error handling for this API:\n\n```[LANGUAGE]\n[PASTE YOUR API CODE HERE]\n```\n\n**Current issues:**\n- [DESCRIBE ERROR HANDLING PROBLEMS]\n- [LIST ANY ERROR SCENARIOS NOT COVERED]\n\n**Requirements:**\n1. Consistent error response format\n2. Proper HTTP status codes\n3. Meaningful error messages for different audiences\n4. Error logging and monitoring\n5. Graceful degradation\n6. Input validation errors\n7. Database connection errors\n8. Third-party service failures\n\nProvide a robust error handling strategy with examples.",
        description: "Implement comprehensive API error handling with proper status codes, logging, and user-friendly messages.",
        rating: 4.6,
        uses: 723,
        tags: ["debugging", "api", "error-handling", "backend"]
    },
    {
        id: 9,
        title: "Write Integration Tests",
        category: "testing",
        language: "general",
        text: "Create integration tests for this system/API:\n\n```[LANGUAGE]\n[PASTE YOUR CODE HERE]\n```\n\n**System context:**\n- Application type: [API/WEB APP/MICROSERVICE]\n- External dependencies: [DATABASES/APIS/SERVICES]\n- Test environment: [DESCRIBE SETUP]\n\n**Test scenarios needed:**\n1. End-to-end user workflows\n2. Database interactions\n3. External API integrations\n4. Authentication flows\n5. Error scenarios and edge cases\n6. Data consistency checks\n7. Performance under load (if applicable)\n\nInclude test setup, teardown, and mock strategies for external dependencies.",
        description: "Create comprehensive integration tests covering real-world scenarios, external dependencies, and user workflows.",
        rating: 4.5,
        uses: 498,
        tags: ["testing", "integration", "e2e", "api-testing"]
    },
    {
        id: 10,
        title: "Docker Container Setup",
        category: "devops",
        language: "dockerfile",
        text: "Help me create a production-ready Docker setup for my application:\n\n**Project details:**\n- Technology: [NODE.JS/PYTHON/JAVA/etc.]\n- Dependencies: [LIST MAIN DEPENDENCIES]\n- Build process: [DESCRIBE BUILD STEPS]\n- Runtime requirements: [ENVIRONMENT VARIABLES/PORTS/etc.]\n\n**Files to create/optimize:**\n```\n[PASTE CURRENT DOCKERFILE IF ANY]\n```\n\nPlease provide:\n1. Optimized Dockerfile with multi-stage builds\n2. .dockerignore file\n3. docker-compose.yml for development\n4. Production deployment considerations\n5. Security best practices\n6. Image size optimization\n7. Health checks and monitoring\n\nFocus on security, performance, and maintainability.",
        description: "Create production-ready Docker containers with security, optimization, and best practices for modern applications.",
        rating: 4.8,
        uses: 892,
        tags: ["devops", "docker", "containerization", "deployment"]
    },
    {
        id: 11,
        title: "Code Architecture Review",
        category: "refactoring",
        language: "general",
        text: "Please review the architecture of my codebase and suggest improvements:\n\n**Project structure:**\n```\n[PASTE YOUR PROJECT STRUCTURE]\n```\n\n**Key files/components:**\n```[LANGUAGE]\n[PASTE MAIN APPLICATION CODE]\n```\n\n**Current challenges:**\n- [DESCRIBE PAIN POINTS]\n- [MENTION SCALABILITY CONCERNS]\n- [LIST MAINTENANCE ISSUES]\n\n**Architecture review areas:**\n1. Separation of concerns\n2. Dependency management\n3. Scalability considerations\n4. Testing architecture\n5. Code organization and modularity\n6. Design patterns usage\n7. Performance implications\n\nProvide specific, actionable recommendations with examples.",
        description: "Get expert architectural advice to improve code organization, scalability, and maintainability of your project.",
        rating: 4.7,
        uses: 356,
        tags: ["refactoring", "architecture", "design-patterns", "scalability"]
    },
    {
        id: 12,
        title: "Accessibility Audit & Fixes",
        category: "frontend",
        language: "html",
        text: "Help me make this web component/page more accessible:\n\n```html\n[PASTE YOUR HTML CODE HERE]\n```\n\n```css\n[PASTE RELEVANT CSS IF NEEDED]\n```\n\n```javascript\n[PASTE RELEVANT JAVASCRIPT IF NEEDED]\n```\n\n**Accessibility requirements:**\n- WCAG compliance level: [A/AA/AAA]\n- Target users: [DESCRIBE USER NEEDS]\n- Assistive technologies to support: [SCREEN READERS/etc.]\n\n**Please check for:**\n1. Semantic HTML structure\n2. ARIA labels and roles\n3. Keyboard navigation\n4. Color contrast ratios\n5. Focus management\n6. Screen reader compatibility\n7. Form accessibility\n8. Image alt text\n\nProvide both fixes and testing recommendations.",
        description: "Comprehensive accessibility audit with specific fixes to make your web applications inclusive for all users.",
        rating: 4.6,
        uses: 234,
        tags: ["frontend", "accessibility", "wcag", "inclusive-design"]
    },
    {
        id: 13,
        title: "Fix Python Error with Stack Trace",
        category: "debugging",
        language: "python",
        text: "I'm getting this error in my Python code:\n\n```python\n[PASTE YOUR CODE HERE]\n```\n\n**Error message:**\n```\n[PASTE FULL ERROR TRACEBACK HERE]\n```\n\n**Context:**\n- Python version: [VERSION]\n- Framework/libraries: [LIST DEPENDENCIES]\n- What I was trying to do: [DESCRIBE GOAL]\n- Input data: [DESCRIBE INPUTS]\n\n**Please help me:**\n1. Identify the root cause of the error\n2. Explain why this error occurred\n3. Provide a working fix\n4. Suggest how to prevent similar errors\n5. Add proper error handling if needed",
        description: "Debug Python errors with detailed analysis of stack traces, common pitfalls, and robust error handling solutions.",
        rating: 4.7,
        uses: 623,
        tags: ["debugging", "python", "error-handling", "traceback"]
    },
    {
        id: 14,
        title: "Debug SQL Query Performance Issues",
        category: "debugging",
        language: "sql",
        text: "My SQL query is running slowly. Can you help me optimize it?\n\n```sql\n[PASTE YOUR SLOW QUERY HERE]\n```\n\n**Database info:**\n- Database system: [MySQL/PostgreSQL/SQL Server/etc.]\n- Table sizes: [APPROXIMATE ROW COUNTS]\n- Current execution time: [TIME]\n- Expected/acceptable time: [TIME]\n\n**Schema (if relevant):**\n```sql\n[PASTE TABLE STRUCTURES/INDEXES]\n```\n\n**Please analyze:**\n1. Query execution plan\n2. Missing or inefficient indexes\n3. Query structure optimization\n4. Alternative approaches\n5. Performance monitoring suggestions",
        description: "Optimize slow SQL queries with execution plan analysis, indexing strategies, and performance tuning techniques.",
        rating: 4.8,
        uses: 445,
        tags: ["debugging", "sql", "performance", "database", "optimization"]
    },
    {
        id: 15,
        title: "Create Comprehensive Unit Tests",
        category: "testing",
        language: "python",
        text: "Write complete unit tests for this Python code:\n\n```python\n[PASTE YOUR PYTHON CODE/CLASS/FUNCTION HERE]\n```\n\n**Testing requirements:**\n- Test framework: [pytest/unittest/specify]\n- Coverage target: [PERCENTAGE OR 'comprehensive']\n- Mock external dependencies: [LIST DEPENDENCIES TO MOCK]\n- Environment: [DEV/STAGING/etc.]\n\n**Please include:**\n1. Happy path test cases\n2. Edge cases and boundary conditions\n3. Error handling and exception scenarios\n4. Mock/patch configurations for external calls\n5. Parameterized tests where applicable\n6. Setup and teardown methods\n7. Assertion best practices\n\nUse modern pytest features and testing patterns.",
        description: "Generate comprehensive Python unit tests with pytest, covering edge cases, mocking, and testing best practices.",
        rating: 4.9,
        uses: 756,
        tags: ["testing", "python", "pytest", "unit-tests", "mocking"]
    },
    {
        id: 16,
        title: "End-to-End Testing with Playwright",
        category: "testing",
        language: "javascript",
        text: "Create end-to-end tests for this web application flow:\n\n**Application details:**\n- Framework: [React/Vue/Angular/Vanilla]\n- URL: [STAGING/DEV URL]\n- Authentication: [TYPE IF APPLICABLE]\n\n**User flow to test:**\n[DESCRIBE THE COMPLETE USER JOURNEY]\n\n**Test scenarios needed:**\n1. [MAIN HAPPY PATH]\n2. [ERROR SCENARIOS]\n3. [EDGE CASES]\n\n**Please create:**\n1. Playwright test setup and configuration\n2. Page Object Model classes\n3. Test data management\n4. Cross-browser testing approach\n5. Screenshot/video capture on failures\n6. CI/CD integration setup\n7. Accessibility testing integration\n\nUse modern Playwright features and best practices.",
        description: "Build robust end-to-end tests with Playwright, including page objects, cross-browser testing, and CI integration.",
        rating: 4.7,
        uses: 398,
        tags: ["testing", "e2e", "playwright", "automation", "javascript"]
    },
    {
        id: 17,
        title: "Load Testing Strategy and Implementation",
        category: "testing",
        language: "javascript",
        text: "Design a load testing strategy for this system:\n\n**System details:**\n- Application type: [API/WEB APP/MICROSERVICE]\n- Technology stack: [TECH STACK]\n- Expected users: [CONCURRENT USERS]\n- Critical endpoints: [LIST KEY ENDPOINTS]\n- Performance requirements: [RESPONSE TIME/THROUGHPUT]\n\n**Current concerns:**\n[DESCRIBE PERFORMANCE ISSUES OR CONCERNS]\n\n**Please provide:**\n1. Load testing tool recommendations (k6, Artillery, JMeter)\n2. Test scenarios and user journey simulation\n3. Realistic test data generation\n4. Gradual load increase strategy\n5. Key metrics to monitor\n6. Performance baseline establishment\n7. Bottleneck identification methodology\n8. CI/CD integration for performance regression testing\n\nInclude actual test scripts and monitoring setup.",
        description: "Comprehensive load testing strategy with tool selection, realistic scenarios, and performance monitoring.",
        rating: 4.6,
        uses: 287,
        tags: ["testing", "performance", "load-testing", "k6", "monitoring"]
    },
    {
        id: 18,
        title: "Database Query Optimization",
        category: "optimization",
        language: "sql",
        text: "Optimize this database query and overall database performance:\n\n```sql\n[PASTE YOUR SLOW QUERY HERE]\n```\n\n**Database context:**\n- Database: [PostgreSQL/MySQL/SQL Server/etc.]\n- Table sizes: [ROW COUNTS]\n- Current performance: [EXECUTION TIME]\n- Target performance: [DESIRED TIME]\n- Query frequency: [HOW OFTEN IT RUNS]\n\n**Schema information:**\n```sql\n[PASTE RELEVANT TABLE SCHEMAS]\n```\n\n**Please analyze and optimize:**\n1. Query execution plan analysis\n2. Index recommendations (create, modify, drop)\n3. Query rewriting for better performance\n4. Partitioning strategies if applicable\n5. Database configuration tuning\n6. Connection pooling optimization\n7. Caching strategies\n8. Monitoring and alerting setup\n\nProvide before/after performance comparisons.",
        description: "Complete database optimization covering queries, indexes, partitioning, and performance monitoring setup.",
        rating: 4.9,
        uses: 542,
        tags: ["optimization", "database", "sql", "performance", "indexing"]
    },
    {
        id: 19,
        title: "Frontend Bundle Size Optimization",
        category: "optimization",
        language: "javascript",
        text: "My web application bundle is too large. Help me optimize it:\n\n**Current bundle info:**\n- Framework: [React/Vue/Angular/etc.]\n- Build tool: [Webpack/Vite/Parcel/etc.]\n- Current bundle size: [SIZE]\n- Target bundle size: [DESIRED SIZE]\n- Loading time: [CURRENT vs DESIRED]\n\n**Application details:**\n```json\n[PASTE package.json dependencies]\n```\n\n**Build configuration:**\n```javascript\n[PASTE BUILD CONFIG IF AVAILABLE]\n```\n\n**Please optimize:**\n1. Bundle analysis and visualization\n2. Code splitting strategies\n3. Tree shaking optimization\n4. Dynamic imports implementation\n5. Dependency audit and alternatives\n6. Image and asset optimization\n7. Lazy loading implementation\n8. CDN optimization strategies\n9. Caching strategies\n10. Performance monitoring setup\n\nProvide specific webpack/vite configurations.",
        description: "Comprehensive frontend optimization including bundle analysis, code splitting, and performance monitoring.",
        rating: 4.8,
        uses: 634,
        tags: ["optimization", "frontend", "webpack", "performance", "bundle"]
    },
    {
        id: 20,
        title: "Microservices Architecture Refactoring",
        category: "refactoring",
        language: "general",
        text: "Help me refactor this monolithic application into microservices:\n\n**Current application:**\n- Technology: [CURRENT TECH STACK]\n- Application size: [LINES OF CODE/TEAM SIZE]\n- Main functions: [LIST CORE FEATURES]\n- Performance issues: [DESCRIBE PROBLEMS]\n- Team structure: [TEAM SIZE/ORGANIZATION]\n\n**Current architecture:**\n```\n[DESCRIBE CURRENT ARCHITECTURE]\n```\n\n**Goals:**\n- [LIST REFACTORING GOALS]\n- [EXPECTED BENEFITS]\n- [CONSTRAINTS/LIMITATIONS]\n\n**Please provide:**\n1. Domain-driven design analysis\n2. Service boundary identification\n3. Data migration strategies\n4. API design and versioning\n5. Service communication patterns\n6. Deployment and DevOps considerations\n7. Testing strategies for distributed systems\n8. Monitoring and observability setup\n9. Gradual migration plan\n10. Risk mitigation strategies",
        description: "Strategic microservices refactoring with domain analysis, migration planning, and architectural best practices.",
        rating: 4.7,
        uses: 298,
        tags: ["refactoring", "microservices", "architecture", "migration", "design-patterns"]
    },
    {
        id: 21,
        title: "Legacy Code Modernization",
        category: "refactoring",
        language: "javascript",
        text: "Modernize this legacy JavaScript/Node.js code:\n\n```javascript\n[PASTE YOUR LEGACY CODE HERE]\n```\n\n**Current state:**\n- Node.js version: [VERSION]\n- Dependencies: [LIST OLD DEPENDENCIES]\n- Code patterns: [DESCRIBE LEGACY PATTERNS]\n- Pain points: [LIST MAIN ISSUES]\n\n**Modernization goals:**\n- Target Node.js version: [VERSION]\n- Modern patterns: [ES6+, async/await, etc.]\n- Performance improvements\n- Maintainability enhancements\n- Security updates\n\n**Please modernize:**\n1. Update to modern JavaScript syntax (ES6+)\n2. Replace callbacks with async/await\n3. Implement proper error handling\n4. Add TypeScript if beneficial\n5. Update dependencies and remove deprecated ones\n6. Implement modern testing patterns\n7. Add proper logging and monitoring\n8. Improve security practices\n9. Optimize performance\n10. Document the migration process",
        description: "Comprehensive legacy code modernization with modern JavaScript patterns, security updates, and documentation.",
        rating: 4.6,
        uses: 423,
        tags: ["refactoring", "modernization", "javascript", "node.js", "typescript"]
    },
    {
        id: 22,
        title: "API Documentation with OpenAPI",
        category: "documentation",
        language: "yaml",
        text: "Create comprehensive API documentation for this service:\n\n**API details:**\n- Framework: [Express/FastAPI/Spring/etc.]\n- Base URL: [API BASE URL]\n- Authentication: [JWT/OAuth/API Key/etc.]\n- Version: [API VERSION]\n\n**Endpoints to document:**\n```\n[LIST YOUR API ENDPOINTS WITH METHODS]\nExample:\nGET /api/users\nPOST /api/users\nGET /api/users/{id}\nPUT /api/users/{id}\nDELETE /api/users/{id}\n```\n\n**Data models:**\n```json\n[PASTE EXAMPLE REQUEST/RESPONSE BODIES]\n```\n\n**Please create:**\n1. Complete OpenAPI 3.0 specification\n2. Detailed endpoint descriptions\n3. Request/response schemas\n4. Authentication configuration\n5. Error response documentation\n6. Code examples in multiple languages\n7. Interactive documentation setup (Swagger UI)\n8. Postman collection generation\n9. SDK generation instructions\n10. API versioning strategy\n\nInclude examples and edge cases.",
        description: "Professional API documentation with OpenAPI, interactive examples, and multi-language SDK generation.",
        rating: 4.8,
        uses: 567,
        tags: ["documentation", "api", "openapi", "swagger", "rest"]
    },
    {
        id: 23,
        title: "Technical Architecture Documentation",
        category: "documentation",
        language: "markdown",
        text: "Create comprehensive technical documentation for this system:\n\n**System overview:**\n- Project name: [PROJECT NAME]\n- Technology stack: [FULL TECH STACK]\n- System scale: [USERS/TRAFFIC/DATA VOLUME]\n- Team size: [DEVELOPERS/STAKEHOLDERS]\n\n**Architecture components:**\n```\n[DESCRIBE YOUR SYSTEM ARCHITECTURE]\n- Frontend: [TECHNOLOGY]\n- Backend: [SERVICES/APIs]\n- Database: [TYPE AND SETUP]\n- Infrastructure: [CLOUD/ON-PREM]\n- Third-party integrations: [LIST SERVICES]\n```\n\n**Documentation needs:**\n- Architecture decisions record (ADR)\n- Deployment procedures\n- Development workflow\n- Troubleshooting guides\n\n**Please create:**\n1. System architecture overview with diagrams\n2. Component interaction documentation\n3. Data flow and database schema docs\n4. Deployment and infrastructure guides\n5. Development environment setup\n6. API integration documentation\n7. Security and compliance procedures\n8. Monitoring and alerting setup\n9. Disaster recovery procedures\n10. Onboarding guide for new developers\n\nUse Mermaid diagrams and clear formatting.",
        description: "Complete technical system documentation with architecture diagrams, procedures, and developer onboarding.",
        rating: 4.7,
        uses: 445,
        tags: ["documentation", "architecture", "procedures", "onboarding", "diagrams"]
    },
    {
        id: 24,
        title: "Security Vulnerability Assessment",
        category: "security",
        language: "general",
        text: "Perform a comprehensive security review of this application:\n\n**Application details:**\n- Type: [WEB APP/API/MOBILE/DESKTOP]\n- Framework: [TECHNOLOGY STACK]\n- User data handled: [TYPES OF SENSITIVE DATA]\n- Authentication method: [JWT/OAuth/SAML/etc.]\n- Deployment: [CLOUD/ON-PREM/HYBRID]\n\n**Code/configuration to review:**\n```\n[PASTE CODE/CONFIG FILES FOR REVIEW]\n```\n\n**Current security measures:**\n- [LIST EXISTING SECURITY CONTROLS]\n- [COMPLIANCE REQUIREMENTS (SOC2/GDPR/etc.)]\n\n**Please assess:**\n1. OWASP Top 10 vulnerabilities\n2. Authentication and authorization flaws\n3. Input validation and sanitization\n4. SQL injection and XSS prevention\n5. Sensitive data exposure risks\n6. Security misconfiguration issues\n7. Insecure dependencies audit\n8. Cryptographic implementation review\n9. API security best practices\n10. Infrastructure security analysis\n\n**Provide:**\n- Risk severity ratings\n- Specific remediation steps\n- Code examples for fixes\n- Security testing recommendations\n- Compliance checklist",
        description: "Comprehensive security assessment covering OWASP Top 10, authentication, and compliance requirements.",
        rating: 4.9,
        uses: 378,
        tags: ["security", "vulnerability", "owasp", "assessment", "compliance"]
    },
    {
        id: 25,
        title: "Secure Authentication Implementation",
        category: "security",
        language: "javascript",
        text: "Implement secure authentication for this application:\n\n**Application context:**\n- Framework: [React/Vue/Express/etc.]\n- User types: [ADMIN/USER/GUEST/etc.]\n- Authentication needs: [LOGIN/SIGNUP/RESET/2FA]\n- Compliance requirements: [GDPR/CCPA/etc.]\n\n**Current auth state:**\n```javascript\n[PASTE CURRENT AUTH CODE IF ANY]\n```\n\n**Requirements:**\n- Multi-factor authentication\n- Secure session management\n- Password security\n- Social login integration\n- Role-based access control\n\n**Please implement:**\n1. Secure password hashing (bcrypt/argon2)\n2. JWT token implementation with refresh tokens\n3. Multi-factor authentication (TOTP/SMS)\n4. Rate limiting and brute force protection\n5. Secure session management\n6. Password policy enforcement\n7. Social OAuth integration (Google/GitHub)\n8. Role-based permission system\n9. Account lockout mechanisms\n10. Audit logging for auth events\n\n**Include:**\n- Frontend auth components\n- Backend middleware\n- Database schema\n- Security best practices\n- Testing strategies",
        description: "Complete secure authentication system with MFA, OAuth, rate limiting, and comprehensive security measures.",
        rating: 4.8,
        uses: 623,
        tags: ["security", "authentication", "jwt", "oauth", "mfa"]
    },
    {
        id: 26,
        title: "Responsive UI Component Library",
        category: "frontend",
        language: "javascript",
        text: "Create a responsive, accessible UI component library:\n\n**Requirements:**\n- Framework: [React/Vue/Angular/Web Components]\n- Design system: [Material/Bootstrap/Custom]\n- Browser support: [BROWSER REQUIREMENTS]\n- Accessibility: WCAG 2.1 AA compliance\n\n**Components needed:**\n```\n[LIST COMPONENTS TO BUILD]\nExample:\n- Button (variants, sizes, states)\n- Input/Form components\n- Modal/Dialog\n- Navigation\n- Cards\n- Data tables\n```\n\n**Design tokens:**\n```css\n[PASTE YOUR DESIGN TOKENS/VARIABLES]\n```\n\n**Please create:**\n1. Component architecture and structure\n2. Responsive design implementation\n3. Accessibility features (ARIA, keyboard nav)\n4. Theme system and CSS variables\n5. TypeScript prop interfaces\n6. Storybook documentation\n7. Unit and visual regression tests\n8. Build and distribution setup\n9. Usage examples and guidelines\n10. Performance optimization\n\n**Include:**\n- Mobile-first responsive design\n- Dark/light theme support\n- Animation and micro-interactions\n- Form validation components\n- Loading and error states",
        description: "Professional UI component library with accessibility, theming, documentation, and comprehensive testing.",
        rating: 4.7,
        uses: 534,
        tags: ["frontend", "components", "react", "accessibility", "responsive"]
    },
    {
        id: 27,
        title: "Progressive Web App Implementation",
        category: "frontend",
        language: "javascript",
        text: "Convert this web application into a Progressive Web App (PWA):\n\n**Current application:**\n- Framework: [React/Vue/Angular/Vanilla]\n- Hosting: [NETLIFY/VERCEL/AWS/etc.]\n- Target platforms: [MOBILE/DESKTOP/BOTH]\n- Offline requirements: [FULL/PARTIAL/READ-ONLY]\n\n**Current state:**\n```javascript\n[PASTE CURRENT APP STRUCTURE/CONFIG]\n```\n\n**PWA requirements:**\n- Offline functionality\n- Push notifications\n- App-like experience\n- Install prompts\n- Background sync\n\n**Please implement:**\n1. Service Worker for caching strategies\n2. Web App Manifest configuration\n3. Offline page and data handling\n4. Background sync for data updates\n5. Push notification system\n6. Install prompt and app shortcuts\n7. Performance optimization\n8. PWA-specific testing\n9. Analytics for PWA metrics\n10. Progressive enhancement strategy\n\n**Include:**\n- Cache-first/network-first strategies\n- IndexedDB for offline storage\n- Workbox implementation\n- Cross-platform compatibility\n- Performance monitoring\n- SEO considerations",
        description: "Complete PWA implementation with offline support, push notifications, and app-like experience.",
        rating: 4.6,
        uses: 389,
        tags: ["frontend", "pwa", "service-worker", "offline", "notifications"]
    },
    {
        id: 28,
        title: "Kubernetes Deployment Strategy",
        category: "devops",
        language: "yaml",
        text: "Create a complete Kubernetes deployment strategy for this application:\n\n**Application details:**\n- Application type: [WEB APP/API/MICROSERVICE]\n- Framework: [TECHNOLOGY STACK]\n- Dependencies: [DATABASE/REDIS/etc.]\n- Environment: [DEV/STAGING/PROD]\n- Scaling requirements: [EXPECTED LOAD]\n\n**Current deployment:**\n```\n[DESCRIBE CURRENT DEPLOYMENT METHOD]\n```\n\n**Infrastructure requirements:**\n- High availability\n- Auto-scaling\n- Zero-downtime deployments\n- Environment isolation\n- Monitoring and logging\n\n**Please create:**\n1. Deployment manifests (Deployment, Service, Ingress)\n2. ConfigMaps and Secrets management\n3. Horizontal Pod Autoscaler (HPA) configuration\n4. Resource limits and requests\n5. Health checks (liveness, readiness)\n6. Multi-environment setup (dev/staging/prod)\n7. CI/CD pipeline integration\n8. Monitoring and logging setup\n9. Backup and disaster recovery\n10. Security policies and RBAC\n\n**Include:**\n- Helm charts for templating\n- ArgoCD for GitOps deployment\n- Prometheus monitoring setup\n- Grafana dashboards\n- Log aggregation with ELK/Fluentd",
        description: "Enterprise-grade Kubernetes deployment with auto-scaling, monitoring, and GitOps workflows.",
        rating: 4.8,
        uses: 445,
        tags: ["devops", "kubernetes", "deployment", "monitoring", "gitops"]
    },
    {
        id: 29,
        title: "CI/CD Pipeline with Security Scanning",
        category: "devops",
        language: "yaml",
        text: "Build a comprehensive CI/CD pipeline with integrated security scanning:\n\n**Project details:**\n- Repository: [GITHUB/GITLAB/BITBUCKET]\n- Application: [WEB APP/API/MOBILE]\n- Technology: [TECH STACK]\n- Deployment target: [AWS/GCP/AZURE/ON-PREM]\n- Team size: [NUMBER OF DEVELOPERS]\n\n**Current CI/CD state:**\n```yaml\n[PASTE CURRENT PIPELINE CONFIG IF ANY]\n```\n\n**Requirements:**\n- Automated testing (unit, integration, e2e)\n- Security vulnerability scanning\n- Code quality checks\n- Multi-environment deployment\n- Rollback capabilities\n\n**Please create:**\n1. Multi-stage pipeline configuration\n2. Automated testing integration\n3. Security scanning (SAST, DAST, dependency check)\n4. Code quality gates (SonarQube, ESLint)\n5. Container security scanning\n6. Infrastructure as Code (IaC) validation\n7. Environment-specific deployment strategies\n8. Monitoring and alerting integration\n9. Artifact management\n10. Compliance reporting\n\n**Include:**\n- Branch protection and review policies\n- Automated changelog generation\n- Performance testing integration\n- Blue-green/canary deployment strategies\n- Rollback automation\n- Slack/Teams notifications",
        description: "Complete CI/CD pipeline with security scanning, quality gates, and automated deployment strategies.",
        rating: 4.9,
        uses: 567,
        tags: ["devops", "ci-cd", "security", "automation", "deployment"]
    },
    {
        id: 30,
        title: "Build RESTful API with Express.js",
        category: "backend",
        language: "javascript",
        text: "Create a RESTful API using Express.js with the following requirements:\n\n**API Requirements:**\n- Resource: [DESCRIBE YOUR RESOURCE]\n- Operations: [CRUD OPERATIONS NEEDED]\n- Authentication: [JWT/OAuth/BASIC]\n- Database: [MONGODB/POSTGRESQL/MYSQL]\n- Validation: [INPUT VALIDATION REQUIREMENTS]\n\n**Please implement:**\n1. Express.js server setup with middleware\n2. RESTful routes (GET, POST, PUT, DELETE)\n3. Database connection and models\n4. Input validation and sanitization\n5. Error handling middleware\n6. Authentication/authorization\n7. API documentation structure\n8. Testing setup\n9. Environment configuration\n10. Security best practices\n\n**Include:**\n- Proper HTTP status codes\n- Response formatting\n- Logging and monitoring\n- Rate limiting\n- CORS configuration\n- API versioning strategy",
        description: "Complete RESTful API implementation with Express.js, including authentication, validation, and best practices.",
        rating: 4.8,
        uses: 445,
        tags: ["backend", "api", "express", "nodejs", "rest"]
    },
    {
        id: 31,
        title: "React Native App Development",
        category: "mobile",
        language: "javascript",
        text: "Help me build a React Native app with the following features:\n\n**App Requirements:**\n- App type: [SOCIAL/ECOMMERCE/UTILITY/GAME]\n- Target platforms: [IOS/ANDROID/BOTH]\n- Key features: [LIST MAIN FEATURES]\n- Backend integration: [API/REALM/FIREBASE]\n\n**Please implement:**\n1. React Native project setup\n2. Navigation structure (Stack/Tab/Drawer)\n3. State management (Redux/Context/State)\n4. UI components and styling\n5. API integration and data fetching\n6. Local storage and caching\n7. Push notifications setup\n8. Platform-specific code\n9. Performance optimization\n10. Testing strategy\n\n**Include:**\n- Component architecture\n- Error boundaries\n- Loading states\n- Offline functionality\n- Deep linking\n- App store preparation",
        description: "Complete React Native app development guide with modern patterns and best practices.",
        rating: 4.7,
        uses: 389,
        tags: ["mobile", "react-native", "javascript", "app-development"]
    },
    {
        id: 32,
        title: "Machine Learning Model Implementation",
        category: "ai-ml",
        language: "python",
        text: "Help me implement a machine learning model for this problem:\n\n**Problem Description:**\n- Task type: [CLASSIFICATION/REGRESSION/CLUSTERING]\n- Data type: [TEXT/IMAGE/NUMERICAL/TIME-SERIES]\n- Dataset size: [APPROXIMATE SIZE]\n- Performance requirements: [ACCURACY/SPEED/BOTH]\n\n**Please implement:**\n1. Data preprocessing and feature engineering\n2. Model selection and architecture\n3. Training pipeline with validation\n4. Hyperparameter tuning\n5. Model evaluation metrics\n6. Deployment strategy\n7. Monitoring and retraining\n8. API integration\n9. Performance optimization\n10. Documentation and reproducibility\n\n**Include:**\n- Data visualization\n- Cross-validation\n- Feature importance analysis\n- Model interpretability\n- A/B testing framework\n- Production deployment",
        description: "Complete ML model implementation with preprocessing, training, evaluation, and deployment.",
        rating: 4.9,
        uses: 234,
        tags: ["ai-ml", "python", "machine-learning", "data-science"]
    },
    {
        id: 33,
        title: "Database Schema Design",
        category: "database",
        language: "sql",
        text: "Design a database schema for this application:\n\n**Application Requirements:**\n- Application type: [WEB/MOBILE/DESKTOP]\n- Main entities: [LIST KEY ENTITIES]\n- Relationships: [DESCRIBE RELATIONSHIPS]\n- Scale requirements: [SMALL/MEDIUM/LARGE]\n- Performance needs: [READ/WRITE HEAVY]\n\n**Please design:**\n1. Entity-Relationship Diagram (ERD)\n2. Normalized table structures\n3. Primary and foreign keys\n4. Indexes for performance\n5. Constraints and validations\n6. Stored procedures/functions\n7. Views for common queries\n8. Migration scripts\n9. Backup and recovery strategy\n10. Security and access control\n\n**Include:**\n- Data types and sizes\n- Referential integrity\n- Audit trails\n- Soft deletes\n- Performance considerations\n- Scalability planning",
        description: "Comprehensive database schema design with normalization, indexing, and best practices.",
        rating: 4.6,
        uses: 567,
        tags: ["database", "sql", "schema-design", "normalization"]
    },
    {
        id: 34,
        title: "GraphQL API Development",
        category: "api",
        language: "javascript",
        text: "Build a GraphQL API with the following requirements:\n\n**API Requirements:**\n- Data sources: [DATABASES/APIS/FILES]\n- Query complexity: [SIMPLE/COMPLEX]\n- Real-time features: [SUBSCRIPTIONS NEEDED?]\n- Authentication: [REQUIRED?]\n\n**Please implement:**\n1. GraphQL schema definition\n2. Resolvers for queries and mutations\n3. Type definitions and interfaces\n4. Input validation and error handling\n5. Authentication and authorization\n6. Data fetching and batching\n7. Caching strategy\n8. Performance optimization\n9. Testing setup\n10. Documentation with GraphQL Playground\n\n**Include:**\n- N+1 query prevention\n- Field-level permissions\n- Rate limiting\n- Error formatting\n- Introspection\n- Schema stitching",
        description: "Complete GraphQL API implementation with schema design, resolvers, and performance optimization.",
        rating: 4.7,
        uses: 298,
        tags: ["api", "graphql", "javascript", "backend"]
    },
    {
        id: 35,
        title: "AWS Serverless Architecture",
        category: "cloud",
        language: "javascript",
        text: "Design a serverless architecture on AWS for this application:\n\n**Application Requirements:**\n- Application type: [WEB/API/BATCH PROCESSING]\n- Traffic patterns: [STEADY/VARIABLE/SPIKY]\n- Data processing: [REAL-TIME/BATCH]\n- Storage needs: [FILE/DATABASE/CACHE]\n\n**Please design:**\n1. Lambda functions architecture\n2. API Gateway configuration\n3. DynamoDB table design\n4. S3 bucket structure\n5. CloudFront CDN setup\n6. Event-driven patterns\n7. Monitoring and logging\n8. Security and IAM\n9. Cost optimization\n10. Deployment pipeline\n\n**Include:**\n- VPC configuration\n- Environment separation\n- Auto-scaling policies\n- Error handling\n- Dead letter queues\n- Performance optimization",
        description: "Complete AWS serverless architecture with Lambda, API Gateway, and best practices.",
        rating: 4.8,
        uses: 345,
        tags: ["cloud", "aws", "serverless", "lambda"]
    },
    {
        id: 36,
        title: "Smart Contract Development",
        category: "blockchain",
        language: "solidity",
        text: "Develop a smart contract for this use case:\n\n**Contract Requirements:**\n- Use case: [DEFI/NFT/GAMING/GOVERNANCE]\n- Token standard: [ERC-20/ERC-721/ERC-1155]\n- Functionality: [DESCRIBE MAIN FUNCTIONS]\n- Security level: [STANDARD/HIGH]\n\n**Please implement:**\n1. Smart contract architecture\n2. State variables and functions\n3. Access control mechanisms\n4. Event emissions\n5. Error handling\n6. Gas optimization\n7. Security best practices\n8. Testing framework\n9. Deployment scripts\n10. Documentation and audit\n\n**Include:**\n- Reentrancy protection\n- Integer overflow checks\n- Access control patterns\n- Upgradeable contracts\n- Emergency stops\n- Gas optimization",
        description: "Secure smart contract development with Solidity, including testing and deployment.",
        rating: 4.5,
        uses: 178,
        tags: ["blockchain", "solidity", "smart-contracts", "ethereum"]
    },
    {
        id: 37,
        title: "Unity Game Development",
        category: "game-dev",
        language: "csharp",
        text: "Help me develop a Unity game with these features:\n\n**Game Requirements:**\n- Genre: [ACTION/PUZZLE/STRATEGY/RPG]\n- Platform: [PC/MOBILE/CONSOLE]\n- Core mechanics: [DESCRIBE MAIN GAMEPLAY]\n- Multiplayer: [SINGLE/MULTI/BOTH]\n\n**Please implement:**\n1. Game architecture and design patterns\n2. Player controller and movement\n3. Game state management\n4. UI system and menus\n5. Audio system integration\n6. Physics and collision detection\n7. AI and pathfinding\n8. Save/load system\n9. Performance optimization\n10. Build and deployment\n\n**Include:**\n- Scriptable objects\n- Event systems\n- Pooling for performance\n- Scene management\n- Input handling\n- Mobile optimization",
        description: "Complete Unity game development with C#, including architecture and optimization.",
        rating: 4.6,
        uses: 234,
        tags: ["game-dev", "unity", "csharp", "game-development"]
    },
    {
        id: 38,
        title: "Data Visualization Dashboard",
        category: "data-viz",
        language: "javascript",
        text: "Create a data visualization dashboard with these requirements:\n\n**Dashboard Requirements:**\n- Data type: [SALES/ANALYTICS/MONITORING]\n- Chart types: [BAR/LINE/PIE/SCATTER]\n- Interactivity: [FILTERS/DRILL-DOWN/REAL-TIME]\n- Framework: [D3.JS/CHART.JS/PLOTLY]\n\n**Please implement:**\n1. Dashboard layout and design\n2. Data processing and transformation\n3. Chart components and configurations\n4. Interactive features and filters\n5. Real-time data updates\n6. Responsive design\n7. Performance optimization\n8. Export functionality\n9. User preferences\n10. Accessibility features\n\n**Include:**\n- Color schemes and themes\n- Animation and transitions\n- Mobile responsiveness\n- Print-friendly layouts\n- Data export options\n- Keyboard navigation",
        description: "Interactive data visualization dashboard with modern frameworks and best practices.",
        rating: 4.7,
        uses: 456,
        tags: ["data-viz", "javascript", "charts", "dashboard"]
    },
    {
        id: 39,
        title: "Workflow Automation Script",
        category: "automation",
        language: "python",
        text: "Create an automation script for this workflow:\n\n**Workflow Requirements:**\n- Process type: [FILE PROCESSING/DATA EXTRACTION/REPORTING]\n- Frequency: [DAILY/WEEKLY/ON-DEMAND]\n- Input sources: [FILES/APIS/DATABASES]\n- Output format: [REPORTS/EMAILS/API CALLS]\n\n**Please implement:**\n1. Script architecture and structure\n2. Input validation and error handling\n3. Data processing logic\n4. Output generation and formatting\n5. Logging and monitoring\n6. Configuration management\n7. Scheduling and triggers\n8. Error recovery\n9. Performance optimization\n10. Documentation and maintenance\n\n**Include:**\n- Command-line interface\n- Configuration files\n- Progress tracking\n- Email notifications\n- Backup procedures\n- Testing framework",
        description: "Robust automation script with error handling, logging, and scheduling capabilities.",
        rating: 4.8,
        uses: 389,
        tags: ["automation", "python", "scripting", "workflow"]
    },
    {
        id: 40,
        title: "Microservices Architecture",
        category: "backend",
        language: "general",
        text: "Design a microservices architecture for this application:\n\n**Application Requirements:**\n- Domain: [E-COMMERCE/FINANCE/HEALTHCARE]\n- Scale: [SMALL/MEDIUM/LARGE]\n- Team structure: [MONOLITHIC/TEAM-BASED]\n- Technology stack: [SPECIFY PREFERRED STACK]\n\n**Please design:**\n1. Service decomposition strategy\n2. API gateway configuration\n3. Service communication patterns\n4. Data consistency strategies\n5. Deployment and orchestration\n6. Monitoring and observability\n7. Security and authentication\n8. Testing strategies\n9. CI/CD pipeline\n10. Disaster recovery\n\n**Include:**\n- Service boundaries\n- Event-driven patterns\n- Circuit breakers\n- Distributed tracing\n- Health checks\n- Load balancing",
        description: "Complete microservices architecture with service design, communication, and deployment strategies.",
        rating: 4.9,
        uses: 234,
        tags: ["backend", "microservices", "architecture", "distributed-systems"]
    },
    {
        id: 41,
        title: "Flutter Mobile App",
        category: "mobile",
        language: "dart",
        text: "Build a Flutter app with these features:\n\n**App Requirements:**\n- App type: [SOCIAL/ECOMMERCE/UTILITY]\n- Target platforms: [IOS/ANDROID/BOTH]\n- Key features: [LIST MAIN FEATURES]\n- Backend integration: [FIREBASE/API]\n\n**Please implement:**\n1. Flutter project structure\n2. State management (Provider/Bloc/Riverpod)\n3. Navigation and routing\n4. UI components and theming\n5. API integration\n6. Local storage\n7. Push notifications\n8. Platform-specific code\n9. Performance optimization\n10. Testing and deployment\n\n**Include:**\n- Widget architecture\n- Custom animations\n- Responsive design\n- Offline functionality\n- App store preparation\n- Performance profiling",
        description: "Complete Flutter app development with modern patterns and cross-platform optimization.",
        rating: 4.7,
        uses: 298,
        tags: ["mobile", "flutter", "dart", "cross-platform"]
    },
    {
        id: 42,
        title: "Deep Learning Model Training",
        category: "ai-ml",
        language: "python",
        text: "Train a deep learning model for this task:\n\n**Task Requirements:**\n- Task type: [IMAGE CLASSIFICATION/OBJECT DETECTION/NLP]\n- Framework: [TENSORFLOW/PYTORCH]\n- Dataset: [DESCRIBE DATASET]\n- Hardware: [CPU/GPU/TPU]\n\n**Please implement:**\n1. Data preprocessing pipeline\n2. Model architecture design\n3. Training configuration\n4. Validation and testing\n5. Hyperparameter optimization\n6. Model evaluation\n7. Deployment strategy\n8. Performance monitoring\n9. Model versioning\n10. Documentation\n\n**Include:**\n- Data augmentation\n- Transfer learning\n- Model interpretability\n- A/B testing\n- Production deployment\n- Continuous training",
        description: "Complete deep learning model training with modern frameworks and deployment strategies.",
        rating: 4.8,
        uses: 189,
        tags: ["ai-ml", "python", "deep-learning", "tensorflow"]
    },
    {
        id: 43,
        title: "PostgreSQL Performance Tuning",
        category: "database",
        language: "sql",
        text: "Optimize PostgreSQL database performance:\n\n**Database Context:**\n- Database size: [SMALL/MEDIUM/LARGE]\n- Workload type: [OLTP/OLAP/MIXED]\n- Performance issues: [SLOW QUERIES/HIGH CPU/MEMORY]\n- Current configuration: [DEFAULT/CUSTOM]\n\n**Please optimize:**\n1. Query performance analysis\n2. Index optimization\n3. Configuration tuning\n4. Partitioning strategies\n5. Connection pooling\n6. Query caching\n7. Maintenance procedures\n8. Monitoring setup\n9. Backup optimization\n10. Scaling strategies\n\n**Include:**\n- Query execution plans\n- Index recommendations\n- Configuration parameters\n- Partitioning schemes\n- Performance monitoring\n- Capacity planning",
        description: "Comprehensive PostgreSQL performance optimization with tuning and monitoring.",
        rating: 4.6,
        uses: 445,
        tags: ["database", "postgresql", "performance", "optimization"]
    },
    {
        id: 44,
        title: "API Rate Limiting Implementation",
        category: "api",
        language: "general",
        text: "Implement rate limiting for this API:\n\n**API Requirements:**\n- API type: [REST/GRAPHQL/WEBHOOK]\n- Rate limits: [REQUESTS PER MINUTE/HOUR]\n- Storage: [REDIS/MEMORY/DATABASE]\n- Strategy: [TOKEN BUCKET/LEAKY BUCKET/FIXED WINDOW]\n\n**Please implement:**\n1. Rate limiting algorithm\n2. Storage mechanism\n3. Middleware integration\n4. Response headers\n5. Error handling\n6. Monitoring and metrics\n7. Configuration management\n8. Testing strategy\n9. Documentation\n10. Performance optimization\n\n**Include:**\n- Rate limit headers\n- Retry-after logic\n- IP-based limiting\n- User-based limiting\n- Burst handling\n- Graceful degradation",
        description: "Robust API rate limiting implementation with multiple strategies and monitoring.",
        rating: 4.7,
        uses: 567,
        tags: ["api", "rate-limiting", "security", "performance"]
    },
    {
        id: 45,
        title: "Kubernetes Deployment Strategy",
        category: "cloud",
        language: "yaml",
        text: "Design a Kubernetes deployment strategy:\n\n**Application Requirements:**\n- Application type: [WEB/API/BATCH]\n- Scale requirements: [SMALL/MEDIUM/LARGE]\n- High availability: [REQUIRED?]\n- Multi-environment: [DEV/STAGING/PROD]\n\n**Please design:**\n1. Pod and service definitions\n2. Deployment strategies\n3. Service mesh integration\n4. Ingress configuration\n5. Resource management\n6. Monitoring and logging\n7. Security policies\n8. Backup and recovery\n9. CI/CD integration\n10. Cost optimization\n\n**Include:**\n- Rolling updates\n- Blue-green deployments\n- Canary releases\n- Resource quotas\n- Network policies\n- Persistent storage",
        description: "Complete Kubernetes deployment strategy with scaling, monitoring, and best practices.",
        rating: 4.8,
        uses: 234,
        tags: ["cloud", "kubernetes", "deployment", "containerization"]
    },
    {
        id: 46,
        title: "NFT Smart Contract",
        category: "blockchain",
        language: "solidity",
        text: "Create an NFT smart contract:\n\n**NFT Requirements:**\n- Standard: [ERC-721/ERC-1155]\n- Metadata: [ON-CHAIN/OFF-CHAIN]\n- Royalties: [REQUIRED?]\n- Marketplace: [INTEGRATED/EXTERNAL]\n\n**Please implement:**\n1. NFT contract structure\n2. Minting functionality\n3. Metadata handling\n4. Royalty system\n5. Access control\n6. Marketplace integration\n7. Gas optimization\n8. Security features\n9. Testing framework\n10. Deployment scripts\n\n**Include:**\n- Batch minting\n- URI management\n- Royalty distribution\n- Access control\n- Emergency functions\n- Gas optimization",
        description: "Complete NFT smart contract with minting, metadata, and marketplace integration.",
        rating: 4.5,
        uses: 298,
        tags: ["blockchain", "nft", "solidity", "ethereum"]
    },
    {
        id: 47,
        title: "Unreal Engine Game Development",
        category: "game-dev",
        language: "cpp",
        text: "Develop a game using Unreal Engine:\n\n**Game Requirements:**\n- Genre: [FPS/RPG/STRATEGY/PUZZLE]\n- Platform: [PC/CONSOLE/MOBILE]\n- Graphics level: [LOW/MEDIUM/HIGH]\n- Multiplayer: [SINGLE/MULTI/BOTH]\n\n**Please implement:**\n1. Project setup and structure\n2. Blueprint and C++ integration\n3. Game framework setup\n4. Character and controller\n5. UI system\n6. Audio integration\n7. AI and behavior trees\n8. Networking\n9. Performance optimization\n10. Build and packaging\n\n**Include:**\n- Game mode setup\n- Level streaming\n- Material system\n- Animation blueprints\n- Networking replication\n- Platform-specific features",
        description: "Complete Unreal Engine game development with Blueprint and C++ integration.",
        rating: 4.6,
        uses: 178,
        tags: ["game-dev", "unreal-engine", "cpp", "blueprint"]
    },
    {
        id: 48,
        title: "Real-time Analytics Dashboard",
        category: "data-viz",
        language: "javascript",
        text: "Build a real-time analytics dashboard:\n\n**Dashboard Requirements:**\n- Data source: [WEBSOCKETS/API/EVENT STREAM]\n- Update frequency: [SECONDS/MINUTES]\n- Chart types: [REAL-TIME CHARTS]\n- Framework: [REACT/VUE/ANGULAR]\n\n**Please implement:**\n1. Real-time data connection\n2. Dashboard layout\n3. Live chart updates\n4. Data processing\n5. Performance optimization\n6. Error handling\n7. User interactions\n8. Export functionality\n9. Mobile responsiveness\n10. Accessibility\n\n**Include:**\n- WebSocket integration\n- Chart animations\n- Data buffering\n- Performance monitoring\n- Offline handling\n- Real-time alerts",
        description: "Real-time analytics dashboard with live data updates and interactive visualizations.",
        rating: 4.7,
        uses: 345,
        tags: ["data-viz", "javascript", "real-time", "analytics"]
    },
    {
        id: 49,
        title: "CI/CD Pipeline Automation",
        category: "automation",
        language: "yaml",
        text: "Create a comprehensive CI/CD pipeline:\n\n**Pipeline Requirements:**\n- Repository: [GITHUB/GITLAB/BITBUCKET]\n- Application: [WEB/API/MOBILE]\n- Testing: [UNIT/INTEGRATION/E2E]\n- Deployment: [KUBERNETES/AWS/LOCAL]\n\n**Please implement:**\n1. Build automation\n2. Testing pipeline\n3. Code quality checks\n4. Security scanning\n5. Deployment stages\n6. Environment management\n7. Rollback procedures\n8. Monitoring integration\n9. Notification system\n10. Documentation\n\n**Include:**\n- Multi-stage builds\n- Parallel testing\n- Artifact management\n- Environment promotion\n- Automated rollbacks\n- Performance testing",
        description: "Complete CI/CD pipeline with testing, security, and automated deployment.",
        rating: 4.8,
        uses: 456,
        tags: ["automation", "ci-cd", "devops", "deployment"]
    },
    {
        id: 50,
        title: "Event-Driven Architecture",
        category: "backend",
        language: "general",
        text: "Design an event-driven architecture:\n\n**System Requirements:**\n- Domain: [E-COMMERCE/FINANCE/LOGISTICS]\n- Event types: [USER ACTIONS/SYSTEM EVENTS]\n- Scale: [SMALL/MEDIUM/LARGE]\n- Technology: [KAFKA/RABBITMQ/AWS SQS]\n\n**Please design:**\n1. Event schema design\n2. Event producer setup\n3. Event consumer patterns\n4. Message routing\n5. Event storage\n6. Error handling\n7. Monitoring and observability\n8. Testing strategies\n9. Performance optimization\n10. Disaster recovery\n\n**Include:**\n- Event sourcing\n- CQRS patterns\n- Dead letter queues\n- Event versioning\n- Schema evolution\n- Event replay",
        description: "Complete event-driven architecture with event sourcing and CQRS patterns.",
        rating: 4.7,
        uses: 234,
        tags: ["backend", "event-driven", "architecture", "messaging"]
    }
];

// Global state
let currentPrompts = [...samplePrompts];
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CodePrompt Hub: Initializing...');
    
    try {
        // Initialize enhanced data fields for existing prompts
        initializeEnhancedData();
        
        loadPrompts();
        setupEventListeners();
        
        // Set initial filter state
        setUnifiedFilter('all');
        
        console.log('✅ CodePrompt Hub: Initialization complete');
        console.log('📊 Total prompts loaded:', samplePrompts.length);
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
});

// Initialize enhanced data fields for prompts that don't have them
function initializeEnhancedData() {
    samplePrompts.forEach(prompt => {
        if (!prompt.ratingCount) {
            prompt.ratingCount = Math.floor(Math.random() * 200) + 20; // 20-220 ratings
        }
        if (!prompt.likes) {
            prompt.likes = Math.floor(Math.random() * prompt.ratingCount * 0.8); // 0-80% of raters also liked
        }
        if (!prompt.liked) {
            prompt.liked = likedPrompts.includes(prompt.id);
        }
        if (!prompt.bookmarked) {
            prompt.bookmarked = bookmarkedPrompts.includes(prompt.id);
        }
    });
}

function setupEventListeners() {
    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Setup form submission
    const form = document.getElementById('promptSubmissionForm');
    if (form) {
        form.addEventListener('submit', handlePromptSubmission);
    }

    // Setup filter chip functionality
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setUnifiedFilter(filter);
        });
    });
    
    // Setup category card click handlers (programmatically to avoid onclick issues)
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryMap = [
        { keywords: ['debugging'], filter: 'debugging' },
        { keywords: ['testing'], filter: 'testing' },
        { keywords: ['performance', 'optimization'], filter: 'optimization' },
        { keywords: ['refactoring'], filter: 'refactoring' },
        { keywords: ['documentation'], filter: 'documentation' },
        { keywords: ['security'], filter: 'security' },
        { keywords: ['frontend'], filter: 'frontend' },
        { keywords: ['devops'], filter: 'devops' },
        { keywords: ['backend'], filter: 'backend' },
        { keywords: ['mobile'], filter: 'mobile' },
        { keywords: ['ai-ml', 'ai & ml'], filter: 'ai-ml' },
        { keywords: ['database'], filter: 'database' },
        { keywords: ['api'], filter: 'api' },
        { keywords: ['cloud'], filter: 'cloud' },
        { keywords: ['blockchain'], filter: 'blockchain' },
        { keywords: ['game-dev', 'game development'], filter: 'game-dev' },
        { keywords: ['data-viz', 'data visualization'], filter: 'data-viz' },
        { keywords: ['automation'], filter: 'automation' }
    ];
    
    categoryCards.forEach((card, index) => {
        // Remove any existing onclick handlers
        card.removeAttribute('onclick');
        
        // Use both content matching and position-based fallback
        let filterType = 'all';
        const cardText = card.innerHTML.toLowerCase();
        
        // Try to match by content first
        for (const category of categoryMap) {
            if (category.keywords.some(keyword => cardText.includes(keyword))) {
                filterType = category.filter;
                break;
            }
        }
        
        // Fallback: use position-based mapping if content matching fails
        if (filterType === 'all' && index < categoryMap.length) {
            filterType = categoryMap[index].filter;
        }
        
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Category card clicked:', filterType, 'from card:', card.querySelector('h3')?.textContent);
            setUnifiedFilter(filterType);
        });
        
        // Add visual feedback and data attribute
        card.style.cursor = 'pointer';
        card.setAttribute('data-category', filterType);
    });
    
    console.log('Event listeners set up for', filterChips.length, 'filter chips and', categoryCards.length, 'category cards');
}

function loadPrompts(prompts = currentPrompts) {
    const container = document.getElementById('unifiedGrid');
    if (!container) return;

    container.innerHTML = '';

    if (prompts.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No prompts found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    prompts.forEach(prompt => {
        const promptCard = createPromptCard(prompt);
        container.appendChild(promptCard);
    });
}

function createPromptCard(prompt) {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.innerHTML = `
        <div class="prompt-header">
            <div class="prompt-title-section">
                <h3 class="prompt-title">${prompt.title}</h3>
                <button class="bookmark-btn" onclick="toggleBookmark(${prompt.id})" title="Bookmark this prompt">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                    </svg>
                </button>
            </div>
            <div class="prompt-meta">
                <span class="prompt-category">${prompt.category}</span>
                <span class="prompt-language">${prompt.language}</span>
            </div>
        </div>
        <p class="prompt-description">${prompt.description}</p>
        <div class="prompt-text" onclick="expandPrompt(${prompt.id})">${prompt.text}</div>
        <div class="prompt-actions">
            <div class="prompt-stats">
                <div class="interactive-rating" data-prompt-id="${prompt.id}">
                    <div class="rating-display">
                        <div class="rating-stars clickable" onclick="showRatingModal(${prompt.id})">${generateInteractiveStars(prompt.rating, prompt.id)}</div>
                        <span class="rating-value">${prompt.rating}/5</span>
                    </div>
                    <span class="rating-count">(${prompt.ratingCount || 0} ratings)</span>
                </div>
                <span class="usage-count">${formatUsageCount(prompt.uses)} uses</span>
            </div>
            <div class="action-buttons">
                <button class="copy-prompt-btn" onclick="copyPrompt(${prompt.id})" title="Copy to clipboard">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                </button>
                <button class="share-prompt-btn" onclick="sharePrompt(${prompt.id})" title="Share this prompt">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                </button>
                <button class="like-prompt-btn ${prompt.liked ? 'liked' : ''}" onclick="toggleLike(${prompt.id})" title="Like this prompt">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span class="like-count">${prompt.likes || 0}</span>
                </button>
            </div>
        </div>
    `;
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
        stars += '<span class="star empty">☆</span>';
    }
    
    return stars;
}

function formatUsageCount(count) {
    if (count >= 1000) {
        return Math.floor(count / 100) / 10 + 'k';
    }
    return count.toString();
}

function generateInteractiveStars(rating, promptId) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += `<span class="star filled" data-rating="${i}">★</span>`;
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += `<span class="star half" data-rating="${i}">★</span>`;
        } else {
            stars += `<span class="star empty" data-rating="${i}">☆</span>`;
        }
    }
    
    return stars;
}

// Global state for user interactions
let bookmarkedPrompts = JSON.parse(localStorage.getItem('bookmarkedPrompts') || '[]');
let likedPrompts = JSON.parse(localStorage.getItem('likedPrompts') || '[]');
let userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');

// Enhanced functionality functions
window.toggleBookmark = function(promptId) {
    const index = bookmarkedPrompts.indexOf(promptId);
    if (index > -1) {
        bookmarkedPrompts.splice(index, 1);
    } else {
        bookmarkedPrompts.push(promptId);
    }
    localStorage.setItem('bookmarkedPrompts', JSON.stringify(bookmarkedPrompts));
    updateBookmarkUI(promptId);
    showNotification(index > -1 ? 'Removed from bookmarks' : 'Added to bookmarks');
}

window.toggleLike = function(promptId) {
    const prompt = samplePrompts.find(p => p.id === promptId);
    if (!prompt) return;
    
    const index = likedPrompts.indexOf(promptId);
    if (index > -1) {
        likedPrompts.splice(index, 1);
        prompt.likes = (prompt.likes || 0) - 1;
        prompt.liked = false;
    } else {
        likedPrompts.push(promptId);
        prompt.likes = (prompt.likes || 0) + 1;
        prompt.liked = true;
    }
    
    localStorage.setItem('likedPrompts', JSON.stringify(likedPrompts));
    updateLikeUI(promptId, prompt.likes, prompt.liked);
    showNotification(prompt.liked ? 'Liked!' : 'Unliked');
}

window.sharePrompt = function(promptId) {
    const prompt = samplePrompts.find(p => p.id === promptId);
    if (!prompt) return;
    
    const shareUrl = `${window.location.origin}${window.location.pathname}#prompt-${promptId}`;
    const shareText = `Check out this ${prompt.category} prompt: "${prompt.title}"`;
    
    if (navigator.share) {
        navigator.share({
            title: prompt.title,
            text: shareText,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        showNotification('Share link copied to clipboard!');
    }
}

window.expandPrompt = function(promptId) {
    const promptCard = document.querySelector(`[onclick*="${promptId}"]`).closest('.prompt-card');
    const promptText = promptCard.querySelector('.prompt-text');
    
    if (promptText.classList.contains('expanded')) {
        promptText.classList.remove('expanded');
    } else {
        promptText.classList.add('expanded');
    }
}

window.showRatingModal = function(promptId) {
    const prompt = samplePrompts.find(p => p.id === promptId);
    if (!prompt) return;
    
    const modal = document.createElement('div');
    modal.className = 'rating-modal-overlay';
    modal.innerHTML = `
        <div class="rating-modal">
            <div class="rating-modal-header">
                <h3>Rate this prompt</h3>
                <button class="close-modal" onclick="closeRatingModal()">&times;</button>
            </div>
            <div class="rating-modal-content">
                <h4>${prompt.title}</h4>
                <p>How helpful was this prompt?</p>
                <div class="rating-input">
                    ${[1,2,3,4,5].map(rating => `
                        <button class="rating-btn" onclick="submitRating(${promptId}, ${rating})">
                            <span class="star">★</span>
                            <span class="rating-label">${getRatingLabel(rating)}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="current-rating">
                    Current rating: ${prompt.rating}/5 (${prompt.ratingCount || 0} ratings)
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

window.closeRatingModal = function() {
    const modal = document.querySelector('.rating-modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

window.submitRating = function(promptId, rating) {
    const prompt = samplePrompts.find(p => p.id === promptId);
    if (!prompt) return;
    
    // Store user's rating
    userRatings[promptId] = rating;
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
    
    // Update prompt rating (simplified calculation)
    const currentCount = prompt.ratingCount || 0;
    const currentTotal = prompt.rating * currentCount;
    const newCount = currentCount + 1;
    const newRating = (currentTotal + rating) / newCount;
    
    prompt.rating = Math.round(newRating * 10) / 10;
    prompt.ratingCount = newCount;
    
    // Update UI
    updateRatingUI(promptId, prompt.rating, prompt.ratingCount);
    closeRatingModal();
    showNotification(`Thanks for rating! You gave ${rating} stars.`);
}

function getRatingLabel(rating) {
    const labels = {
        1: 'Poor',
        2: 'Fair', 
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    return labels[rating];
}

function updateBookmarkUI(promptId) {
    const bookmarkBtn = document.querySelector(`[onclick*="toggleBookmark(${promptId})"]`);
    if (bookmarkBtn) {
        const isBookmarked = bookmarkedPrompts.includes(promptId);
        bookmarkBtn.classList.toggle('bookmarked', isBookmarked);
        const svg = bookmarkBtn.querySelector('svg');
        if (svg) {
            svg.setAttribute('fill', isBookmarked ? 'currentColor' : 'none');
        }
    }
}

function updateLikeUI(promptId, likeCount, isLiked) {
    const likeBtn = document.querySelector(`[onclick*="toggleLike(${promptId})"]`);
    if (likeBtn) {
        likeBtn.classList.toggle('liked', isLiked);
        const countSpan = likeBtn.querySelector('.like-count');
        if (countSpan) {
            countSpan.textContent = likeCount;
        }
    }
}

function updateRatingUI(promptId, rating, ratingCount) {
    const ratingDisplay = document.querySelector(`[data-prompt-id="${promptId}"]`);
    if (ratingDisplay) {
        const starsContainer = ratingDisplay.querySelector('.rating-stars');
        const ratingValue = ratingDisplay.querySelector('.rating-value');
        const ratingCountSpan = ratingDisplay.querySelector('.rating-count');
        
        if (starsContainer) {
            starsContainer.innerHTML = generateInteractiveStars(rating, promptId);
        }
        if (ratingValue) {
            ratingValue.textContent = `${rating}/5`;
        }
        if (ratingCountSpan) {
            ratingCountSpan.textContent = `(${ratingCount} ratings)`;
        }
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Filter functionality - expose globally for onclick handlers
window.setUnifiedFilter = function setUnifiedFilter(filterType) {
    console.log('🎯 setUnifiedFilter called with:', filterType);
    
    try {
        currentFilter = filterType;
        
        // Update active filter chip
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.classList.remove('active');
        });
        
        const activeChip = document.querySelector(`[data-filter="${filterType}"]`);
        if (activeChip) {
            activeChip.classList.add('active');
        }
        
        // Add visual feedback for category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Filter prompts
        if (filterType === 'all') {
            currentPrompts = [...samplePrompts];
        } else if (filterType === 'bookmarked') {
            currentPrompts = samplePrompts.filter(prompt => bookmarkedPrompts.includes(prompt.id));
        } else if (filterType === 'popular') {
            // Sort by likes and rating, take top 10
            currentPrompts = [...samplePrompts]
                .sort((a, b) => {
                    const aScore = (a.likes || 0) + (a.rating * 20);
                    const bScore = (b.likes || 0) + (b.rating * 20);
                    return bScore - aScore;
                })
                .slice(0, 10);
        } else {
            currentPrompts = samplePrompts.filter(prompt => 
                prompt.category === filterType
            );
            
            // Highlight the selected category card briefly
            const categoryCards = document.querySelectorAll('.category-card');
            categoryCards.forEach(card => {
                if (card.getAttribute('data-category') === filterType) {
                    card.classList.add('selected');
                    setTimeout(() => card.classList.remove('selected'), 2000);
                }
            });
        }
        
        console.log('📊 Filtered prompts count:', currentPrompts.length, 'for category:', filterType);
        
        // Reload prompts with filter applied
        loadPrompts(currentPrompts);
        
        // Scroll to prompts section with smooth behavior
        setTimeout(() => {
            const promptsSection = document.getElementById('unifiedGrid');
            if (promptsSection) {
                // Enhanced smooth scroll with offset for better positioning
                smoothScrollTo(promptsSection, -100);
            }
        }, 200);
        
        // Update URL hash for bookmarking
        if (filterType === 'all') {
            history.replaceState(null, '', window.location.pathname);
        } else {
            history.replaceState(null, '', `#${filterType}`);
        }
        
    } catch (error) {
        console.error('❌ Error in setUnifiedFilter:', error);
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (!query) {
        // Reset to current filter
        setUnifiedFilter(currentFilter);
        return;
    }
    
    // Search within current filter
    const basePrompts = currentFilter === 'all' ? samplePrompts : 
        samplePrompts.filter(prompt => prompt.category === currentFilter);
    
    const filteredPrompts = basePrompts.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.category.toLowerCase().includes(query) ||
        prompt.language.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    loadPrompts(filteredPrompts);
}

function copyPrompt(promptId) {
    const prompt = samplePrompts.find(p => p.id === promptId);
    if (!prompt) return;

    navigator.clipboard.writeText(prompt.text).then(() => {
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = prompt.text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    
    if (query === '') {
        currentPrompts = [...samplePrompts];
    } else {
        currentPrompts = samplePrompts.filter(prompt => 
            prompt.title.toLowerCase().includes(query) ||
            prompt.description.toLowerCase().includes(query) ||
            prompt.text.toLowerCase().includes(query) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    // Apply current filter
    if (currentFilter !== 'all') {
        currentPrompts = currentPrompts.filter(prompt => prompt.category === currentFilter);
    }
    
    loadPrompts(currentPrompts);
    updateResultsCount();
}

function setUnifiedFilter(filter) {
    currentFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Apply filter
    if (filter === 'all') {
        currentPrompts = [...samplePrompts];
    } else {
        currentPrompts = samplePrompts.filter(prompt => prompt.category === filter);
    }
    
    // Apply search if there's a query
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    if (searchQuery) {
        currentPrompts = currentPrompts.filter(prompt => 
            prompt.title.toLowerCase().includes(searchQuery) ||
            prompt.description.toLowerCase().includes(searchQuery) ||
            prompt.text.toLowerCase().includes(searchQuery) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }
    
    loadPrompts(currentPrompts);
    updateResultsCount();
}

function filterByCategory(category) {
    setUnifiedFilter(category);
    // Enhanced scroll to results with delay
    setTimeout(() => {
        const contentGrid = document.getElementById('contentGrid') || document.getElementById('unifiedGrid');
        if (contentGrid) {
            smoothScrollTo(contentGrid, -80);
        }
    }, 300);
}

function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = `Found(${currentPrompts.length} prompts)`;
    }
}

// Modal functions
function openSubmitModal() {
    document.getElementById('submitModal').style.display = 'flex';
}

function closeSubmitModal() {
    document.getElementById('submitModal').style.display = 'none';
    document.getElementById('promptSubmissionForm').reset();
}

function handlePromptSubmission(event) {
    event.preventDefault();
    
    const promptData = {
        title: document.getElementById('promptTitle').value,
        category: document.getElementById('promptCategory').value,
        language: document.getElementById('promptLanguage').value,
        text: document.getElementById('promptText').value,
        description: document.getElementById('promptDescription').value,
        tags: document.getElementById('promptTags') ? document.getElementById('promptTags').value.split(',').map(tag => tag.trim()) : [document.getElementById('promptCategory').value, document.getElementById('promptLanguage').value]
    };
    
    // Show GitHub submission dialog
    showGitHubSubmissionDialog(promptData);
    
    // Close the original modal
    closeSubmitModal();
}

function showGitHubSubmissionDialog(promptData) {
    const modal = document.createElement('div');
    modal.className = 'github-submission-modal';
    modal.innerHTML = `
        <div class="github-modal-overlay">
            <div class="github-modal">
                <div class="github-modal-header">
                    <h3>🚀 Submit to GitHub</h3>
                    <button class="close-github-modal" onclick="closeGitHubModal()">&times;</button>
                </div>
                <div class="github-modal-content">
                    <div class="github-icon">
                        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                    </div>
                    <h4>Contribute to the Community</h4>
                    <p>To submit your prompt, please create a GitHub issue with your contribution.</p>
                    
                    <div class="prompt-preview">
                        <h5>Your Prompt Preview:</h5>
                        <div class="preview-card">
                            <strong>Title:</strong> ${promptData.title}<br>
                            <strong>Category:</strong> ${promptData.category}<br>
                            <strong>Language:</strong> ${promptData.language}<br>
                            <strong>Description:</strong> ${promptData.description}<br>
                            <strong>Tags:</strong> ${promptData.tags.join(', ')}<br>
                            <div class="prompt-text-preview">${promptData.text}</div>
                        </div>
                    </div>
                    
                    <div class="github-actions">
                        <button onclick="copyPromptForGitHub('${encodeURIComponent(JSON.stringify(promptData))}')" class="btn-github-copy">
                            📋 Copy Prompt Data
                        </button>
                        <a href="https://github.com/davila7/claude-code-templates/issues/new?title=New%20Prompt:%20${encodeURIComponent(promptData.title)}" 
                           target="_blank" class="btn-github-submit">
                            🐙 Submit on GitHub
                        </a>
                    </div>
                    
                    <div class="github-note">
                        <p><strong>Note:</strong> This will open GitHub in a new tab. Please paste the copied prompt data in the issue description.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

window.closeGitHubModal = function() {
    const modal = document.querySelector('.github-submission-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

window.copyPromptForGitHub = function(encodedData) {
    const promptData = JSON.parse(decodeURIComponent(encodedData));
    const githubFormat = `## Prompt Submission

**Title:** ${promptData.title}
**Category:** ${promptData.category}
**Language:** ${promptData.language}
**Tags:** ${promptData.tags.join(', ')}

### Description
${promptData.description}

### Prompt Text
\`\`\`
${promptData.text}
\`\`\`

### Additional Notes
Please review and add this prompt to the collection.
`;
    
    navigator.clipboard.writeText(githubFormat).then(() => {
        showNotification('Prompt data copied to clipboard! 📋', 'success');
    }).catch(() => {
        showNotification('Failed to copy. Please manually copy the text.', 'error');
    });
}

// Additional utility functions
function showTopRated() {
    currentPrompts = [...samplePrompts].sort((a, b) => b.rating - a.rating);
    loadPrompts(currentPrompts);
    // Enhanced smooth scroll to results
    setTimeout(() => {
        const contentGrid = document.getElementById('contentGrid') || document.getElementById('unifiedGrid');
        if (contentGrid) {
            smoothScrollTo(contentGrid, -100);
        }
    }, 200);
}



// Export functions for global access
window.setUnifiedFilter = setUnifiedFilter;
window.filterByCategory = filterByCategory;
window.openSubmitModal = openSubmitModal;
window.closeSubmitModal = closeSubmitModal;
window.showTopRated = showTopRated;

window.copyPrompt = copyPrompt;
window.scrollToCategories = scrollToCategories;
window.scrollToSection = scrollToSection;

function scrollToCategories() {
    const categoriesSection = document.querySelector('.categories-grid');
    if (categoriesSection) {
        // Add a small delay for better UX feedback
        setTimeout(() => {
            categoriesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }, 100);
    }
}

// Enhanced smooth scroll utility function
function smoothScrollTo(element, offset = 0) {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition + offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Generic scroll to section function
function scrollToSection(sectionId, offset = -80) {
    const section = document.getElementById(sectionId) || document.querySelector(sectionId);
    if (section) {
        setTimeout(() => {
            smoothScrollTo(section, offset);
        }, 100);
    }
}

// Add smooth scroll behavior to all anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Handle all anchor links with smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement, -100);
            }
        });
    });
});

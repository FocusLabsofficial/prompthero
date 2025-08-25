// Simple development server for CodePrompt Hub
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API routes (mock for now)
  if (pathname.startsWith('/api/prompts')) {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'GET') {
      // Mock prompts data with enhanced, modern prompts
      const mockPrompts = {
        prompts: [
          {
            id: 1,
            title: "Debug React Component Issues",
            category: "debugging",
            language: "javascript",
            prompt_text: "I'm having issues with this React component. Can you help me debug it?\n\n```jsx\n[PASTE YOUR COMPONENT CODE HERE]\n```\n\nCurrent behavior: [DESCRIBE WHAT'S HAPPENING]\nExpected behavior: [DESCRIBE WHAT SHOULD HAPPEN]\nError messages (if any): [PASTE CONSOLE ERRORS]\n\nPlease help me:\n1. Identify the root cause\n2. Explain why it's happening\n3. Provide a fixed version\n4. Suggest best practices to avoid similar issues",
            description: "Debug React components with hooks, state management, and rendering issues. Get clear explanations and fixes.",
            rating: 4.8,
            usage_count: 892,
            created_at: "2024-01-20T10:30:00Z"
          },
          {
            id: 2,
            title: "Write TypeScript Tests with Jest",
            category: "testing",
            language: "typescript",
            prompt_text: "Create comprehensive TypeScript tests for this function/class using Jest:\n\n```typescript\n[PASTE YOUR TYPESCRIPT CODE HERE]\n```\n\nPlease include:\n- Type-safe test setup\n- Unit tests for all methods/functions\n- Edge cases and error scenarios\n- Mock implementations for dependencies\n- Test coverage for async operations\n- Proper TypeScript test utilities\n\nUse modern Jest features and TypeScript best practices.",
            description: "Generate comprehensive TypeScript tests with proper typing, mocking, and modern Jest patterns.",
            rating: 4.9,
            usage_count: 1243,
            created_at: "2024-01-19T14:20:00Z"
          },
          {
            id: 3,
            title: "Optimize React Performance",
            category: "optimization",
            language: "javascript",
            prompt_text: "My React app is slow and has performance issues. Here's the problematic component:\n\n```jsx\n[PASTE YOUR COMPONENT CODE HERE]\n```\n\nPerformance issues I'm seeing:\n- [DESCRIBE PERFORMANCE PROBLEMS]\n- Bundle size: [IF KNOWN]\n- Render frequency: [IF MEASURED]\n\nPlease help me:\n1. Identify performance bottlenecks\n2. Implement React.memo, useMemo, useCallback where needed\n3. Optimize re-renders and component structure\n4. Suggest code splitting opportunities\n5. Recommend profiling tools and techniques",
            description: "Optimize React applications for better performance, including memoization, bundle optimization, and render optimization.",
            rating: 4.7,
            usage_count: 756,
            created_at: "2024-01-18T09:15:00Z"
          },
          {
            id: 4,
            title: "Security Code Review",
            category: "security",
            language: "general",
            prompt_text: "Please perform a security review of this code:\n\n```[LANGUAGE]\n[PASTE YOUR CODE HERE]\n```\n\n**Context:**\n- Application type: [WEB APP/API/MOBILE/DESKTOP]\n- Framework: [SPECIFY FRAMEWORK]\n- User data handled: [DESCRIBE DATA TYPES]\n- Authentication method: [IF APPLICABLE]\n\n**Security checklist:**\n1. Input validation and sanitization\n2. SQL injection prevention\n3. XSS (Cross-Site Scripting) protection\n4. Authentication and authorization flaws\n5. Sensitive data exposure\n6. Security misconfiguration\n7. Insecure dependencies\n8. Cryptographic issues\n\nProvide specific remediation steps for each vulnerability found.",
            description: "Comprehensive security analysis covering OWASP Top 10 vulnerabilities with actionable remediation steps.",
            rating: 4.9,
            usage_count: 445,
            created_at: "2024-01-17T16:45:00Z"
          },
          {
            id: 13,
            title: "Fix Python Error with Stack Trace",
            category: "debugging",
            language: "python",
            prompt_text: "I'm getting this error in my Python code:\n\n```python\n[PASTE YOUR CODE HERE]\n```\n\n**Error message:**\n```\n[PASTE FULL ERROR TRACEBACK HERE]\n```\n\n**Context:**\n- Python version: [VERSION]\n- Framework/libraries: [LIST DEPENDENCIES]\n- What I was trying to do: [DESCRIBE GOAL]\n- Input data: [DESCRIBE INPUTS]\n\n**Please help me:**\n1. Identify the root cause of the error\n2. Explain why this error occurred\n3. Provide a working fix\n4. Suggest how to prevent similar errors\n5. Add proper error handling if needed",
            description: "Debug Python errors with detailed analysis of stack traces, common pitfalls, and robust error handling solutions.",
            rating: 4.7,
            usage_count: 623,
            created_at: "2024-01-16T11:20:00Z"
          },
          {
            id: 14,
            title: "Database Query Optimization",
            category: "optimization",
            language: "sql",
            prompt_text: "Optimize this database query and overall database performance:\n\n```sql\n[PASTE YOUR SLOW QUERY HERE]\n```\n\n**Database context:**\n- Database: [PostgreSQL/MySQL/SQL Server/etc.]\n- Table sizes: [ROW COUNTS]\n- Current performance: [EXECUTION TIME]\n- Target performance: [DESIRED TIME]\n- Query frequency: [HOW OFTEN IT RUNS]\n\n**Schema information:**\n```sql\n[PASTE RELEVANT TABLE SCHEMAS]\n```\n\n**Please analyze and optimize:**\n1. Query execution plan analysis\n2. Index recommendations (create, modify, drop)\n3. Query rewriting for better performance\n4. Partitioning strategies if applicable\n5. Database configuration tuning\n6. Connection pooling optimization\n7. Caching strategies\n8. Monitoring and alerting setup\n\nProvide before/after performance comparisons.",
            description: "Complete database optimization covering queries, indexes, partitioning, and performance monitoring setup.",
            rating: 4.9,
            usage_count: 542,
            created_at: "2024-01-15T14:30:00Z"
          },
          {
            id: 15,
            title: "Kubernetes Deployment Strategy",
            category: "devops",
            language: "yaml",
            prompt_text: "Create a complete Kubernetes deployment strategy for this application:\n\n**Application details:**\n- Application type: [WEB APP/API/MICROSERVICE]\n- Framework: [TECHNOLOGY STACK]\n- Dependencies: [DATABASE/REDIS/etc.]\n- Environment: [DEV/STAGING/PROD]\n- Scaling requirements: [EXPECTED LOAD]\n\n**Current deployment:**\n```\n[DESCRIBE CURRENT DEPLOYMENT METHOD]\n```\n\n**Infrastructure requirements:**\n- High availability\n- Auto-scaling\n- Zero-downtime deployments\n- Environment isolation\n- Monitoring and logging\n\n**Please create:**\n1. Deployment manifests (Deployment, Service, Ingress)\n2. ConfigMaps and Secrets management\n3. Horizontal Pod Autoscaler (HPA) configuration\n4. Resource limits and requests\n5. Health checks (liveness, readiness)\n6. Multi-environment setup (dev/staging/prod)\n7. CI/CD pipeline integration\n8. Monitoring and logging setup\n9. Backup and disaster recovery\n10. Security policies and RBAC\n\n**Include:**\n- Helm charts for templating\n- ArgoCD for GitOps deployment\n- Prometheus monitoring setup\n- Grafana dashboards\n- Log aggregation with ELK/Fluentd",
            description: "Enterprise-grade Kubernetes deployment with auto-scaling, monitoring, and GitOps workflows.",
            rating: 4.8,
            usage_count: 445,
            created_at: "2024-01-14T09:15:00Z"
          },
          {
            id: 30,
            title: "Build RESTful API with Express.js",
            category: "backend",
            language: "javascript",
            prompt_text: "Create a RESTful API using Express.js with the following requirements:\n\n**API Requirements:**\n- Resource: [DESCRIBE YOUR RESOURCE]\n- Operations: [CRUD OPERATIONS NEEDED]\n- Authentication: [JWT/OAuth/BASIC]\n- Database: [MONGODB/POSTGRESQL/MYSQL]\n- Validation: [INPUT VALIDATION REQUIREMENTS]\n\n**Please implement:**\n1. Express.js server setup with middleware\n2. RESTful routes (GET, POST, PUT, DELETE)\n3. Database connection and models\n4. Input validation and sanitization\n5. Error handling middleware\n6. Authentication/authorization\n7. API documentation structure\n8. Testing setup\n9. Environment configuration\n10. Security best practices\n\n**Include:**\n- Proper HTTP status codes\n- Response formatting\n- Logging and monitoring\n- Rate limiting\n- CORS configuration\n- API versioning strategy",
            description: "Complete RESTful API implementation with Express.js, including authentication, validation, and best practices.",
            rating: 4.8,
            usage_count: 445,
            created_at: "2024-01-13T16:20:00Z"
          },
          {
            id: 31,
            title: "React Native App Development",
            category: "mobile",
            language: "javascript",
            prompt_text: "Help me build a React Native app with the following features:\n\n**App Requirements:**\n- App type: [SOCIAL/ECOMMERCE/UTILITY/GAME]\n- Target platforms: [IOS/ANDROID/BOTH]\n- Key features: [LIST MAIN FEATURES]\n- Backend integration: [API/REALM/FIREBASE]\n\n**Please implement:**\n1. React Native project setup\n2. Navigation structure (Stack/Tab/Drawer)\n3. State management (Redux/Context/State)\n4. UI components and styling\n5. API integration and data fetching\n6. Local storage and caching\n7. Push notifications setup\n8. Platform-specific code\n9. Performance optimization\n10. Testing strategy\n\n**Include:**\n- Component architecture\n- Error boundaries\n- Loading states\n- Offline functionality\n- Deep linking\n- App store preparation",
            description: "Complete React Native app development guide with modern patterns and best practices.",
            rating: 4.7,
            usage_count: 389,
            created_at: "2024-01-12T11:45:00Z"
          },
          {
            id: 32,
            title: "Machine Learning Model Implementation",
            category: "ai-ml",
            language: "python",
            prompt_text: "Help me implement a machine learning model for this problem:\n\n**Problem Description:**\n- Task type: [CLASSIFICATION/REGRESSION/CLUSTERING]\n- Data type: [TEXT/IMAGE/NUMERICAL/TIME-SERIES]\n- Dataset size: [APPROXIMATE SIZE]\n- Performance requirements: [ACCURACY/SPEED/BOTH]\n\n**Please implement:**\n1. Data preprocessing and feature engineering\n2. Model selection and architecture\n3. Training pipeline with validation\n4. Hyperparameter tuning\n5. Model evaluation metrics\n6. Deployment strategy\n7. Monitoring and retraining\n8. API integration\n9. Performance optimization\n10. Documentation and reproducibility\n\n**Include:**\n- Data visualization\n- Cross-validation\n- Feature importance analysis\n- Model interpretability\n- A/B testing framework\n- Production deployment",
            description: "Complete ML model implementation with preprocessing, training, evaluation, and deployment.",
            rating: 4.9,
            usage_count: 234,
            created_at: "2024-01-11T14:30:00Z"
          },
          {
            id: 33,
            title: "Database Schema Design",
            category: "database",
            language: "sql",
            prompt_text: "Design a database schema for this application:\n\n**Application Requirements:**\n- Application type: [WEB/MOBILE/DESKTOP]\n- Main entities: [LIST KEY ENTITIES]\n- Relationships: [DESCRIBE RELATIONSHIPS]\n- Scale requirements: [SMALL/MEDIUM/LARGE]\n- Performance needs: [READ/WRITE HEAVY]\n\n**Please design:**\n1. Entity-Relationship Diagram (ERD)\n2. Normalized table structures\n3. Primary and foreign keys\n4. Indexes for performance\n5. Constraints and validations\n6. Stored procedures/functions\n7. Views for common queries\n8. Migration scripts\n9. Backup and recovery strategy\n10. Security and access control\n\n**Include:**\n- Data types and sizes\n- Referential integrity\n- Audit trails\n- Soft deletes\n- Performance considerations\n- Scalability planning",
            description: "Comprehensive database schema design with normalization, indexing, and best practices.",
            rating: 4.6,
            usage_count: 567,
            created_at: "2024-01-10T09:15:00Z"
          },
          {
            id: 34,
            title: "GraphQL API Development",
            category: "api",
            language: "javascript",
            prompt_text: "Build a GraphQL API with the following requirements:\n\n**API Requirements:**\n- Data sources: [DATABASES/APIS/FILES]\n- Query complexity: [SIMPLE/COMPLEX]\n- Real-time features: [SUBSCRIPTIONS NEEDED?]\n- Authentication: [REQUIRED?]\n\n**Please implement:**\n1. GraphQL schema definition\n2. Resolvers for queries and mutations\n3. Type definitions and interfaces\n4. Input validation and error handling\n5. Authentication and authorization\n6. Data fetching and batching\n7. Caching strategy\n8. Performance optimization\n9. Testing setup\n10. Documentation with GraphQL Playground\n\n**Include:**\n- N+1 query prevention\n- Field-level permissions\n- Rate limiting\n- Error formatting\n- Introspection\n- Schema stitching",
            description: "Complete GraphQL API implementation with schema design, resolvers, and performance optimization.",
            rating: 4.7,
            usage_count: 298,
            created_at: "2024-01-09T16:45:00Z"
          },
          {
            id: 35,
            title: "AWS Serverless Architecture",
            category: "cloud",
            language: "javascript",
            prompt_text: "Design a serverless architecture on AWS for this application:\n\n**Application Requirements:**\n- Application type: [WEB/API/BATCH PROCESSING]\n- Traffic patterns: [STEADY/VARIABLE/SPIKY]\n- Data processing: [REAL-TIME/BATCH]\n- Storage needs: [FILE/DATABASE/CACHE]\n\n**Please design:**\n1. Lambda functions architecture\n2. API Gateway configuration\n3. DynamoDB table design\n4. S3 bucket structure\n5. CloudFront CDN setup\n6. Event-driven patterns\n7. Monitoring and logging\n8. Security and IAM\n9. Cost optimization\n10. Deployment pipeline\n\n**Include:**\n- VPC configuration\n- Environment separation\n- Auto-scaling policies\n- Error handling\n- Dead letter queues\n- Performance optimization",
            description: "Complete AWS serverless architecture with Lambda, API Gateway, and best practices.",
            rating: 4.8,
            usage_count: 345,
            created_at: "2024-01-08T12:20:00Z"
          },
          {
            id: 36,
            title: "Smart Contract Development",
            category: "blockchain",
            language: "solidity",
            prompt_text: "Develop a smart contract for this use case:\n\n**Contract Requirements:**\n- Use case: [DEFI/NFT/GAMING/GOVERNANCE]\n- Token standard: [ERC-20/ERC-721/ERC-1155]\n- Functionality: [DESCRIBE MAIN FUNCTIONS]\n- Security level: [STANDARD/HIGH]\n\n**Please implement:**\n1. Smart contract architecture\n2. State variables and functions\n3. Access control mechanisms\n4. Event emissions\n5. Error handling\n6. Gas optimization\n7. Security best practices\n8. Testing framework\n9. Deployment scripts\n10. Documentation and audit\n\n**Include:**\n- Reentrancy protection\n- Integer overflow checks\n- Access control patterns\n- Upgradeable contracts\n- Emergency stops\n- Gas optimization",
            description: "Secure smart contract development with Solidity, including testing and deployment.",
            rating: 4.5,
            usage_count: 178,
            created_at: "2024-01-07T10:30:00Z"
          },
          {
            id: 37,
            title: "Unity Game Development",
            category: "game-dev",
            language: "csharp",
            prompt_text: "Help me develop a Unity game with these features:\n\n**Game Requirements:**\n- Genre: [ACTION/PUZZLE/STRATEGY/RPG]\n- Platform: [PC/MOBILE/CONSOLE]\n- Core mechanics: [DESCRIBE MAIN GAMEPLAY]\n- Multiplayer: [SINGLE/MULTI/BOTH]\n\n**Please implement:**\n1. Game architecture and design patterns\n2. Player controller and movement\n3. Game state management\n4. UI system and menus\n5. Audio system integration\n6. Physics and collision detection\n7. AI and pathfinding\n8. Save/load system\n9. Performance optimization\n10. Build and deployment\n\n**Include:**\n- Scriptable objects\n- Event systems\n- Pooling for performance\n- Scene management\n- Input handling\n- Mobile optimization",
            description: "Complete Unity game development with C#, including architecture and optimization.",
            rating: 4.6,
            usage_count: 234,
            created_at: "2024-01-06T14:15:00Z"
          },
          {
            id: 38,
            title: "Data Visualization Dashboard",
            category: "data-viz",
            language: "javascript",
            prompt_text: "Create a data visualization dashboard with these requirements:\n\n**Dashboard Requirements:**\n- Data type: [SALES/ANALYTICS/MONITORING]\n- Chart types: [BAR/LINE/PIE/SCATTER]\n- Interactivity: [FILTERS/DRILL-DOWN/REAL-TIME]\n- Framework: [D3.JS/CHART.JS/PLOTLY]\n\n**Please implement:**\n1. Dashboard layout and design\n2. Data processing and transformation\n3. Chart components and configurations\n4. Interactive features and filters\n5. Real-time data updates\n6. Responsive design\n7. Performance optimization\n8. Export functionality\n9. User preferences\n10. Accessibility features\n\n**Include:**\n- Color schemes and themes\n- Animation and transitions\n- Mobile responsiveness\n- Print-friendly layouts\n- Data export options\n- Keyboard navigation",
            description: "Interactive data visualization dashboard with modern frameworks and best practices.",
            rating: 4.7,
            usage_count: 456,
            created_at: "2024-01-05T11:45:00Z"
          },
          {
            id: 39,
            title: "Workflow Automation Script",
            category: "automation",
            language: "python",
            prompt_text: "Create an automation script for this workflow:\n\n**Workflow Requirements:**\n- Process type: [FILE PROCESSING/DATA EXTRACTION/REPORTING]\n- Frequency: [DAILY/WEEKLY/ON-DEMAND]\n- Input sources: [FILES/APIS/DATABASES]\n- Output format: [REPORTS/EMAILS/API CALLS]\n\n**Please implement:**\n1. Script architecture and structure\n2. Input validation and error handling\n3. Data processing logic\n4. Output generation and formatting\n5. Logging and monitoring\n6. Configuration management\n7. Scheduling and triggers\n8. Error recovery\n9. Performance optimization\n10. Documentation and maintenance\n\n**Include:**\n- Command-line interface\n- Configuration files\n- Progress tracking\n- Email notifications\n- Backup procedures\n- Testing framework",
            description: "Robust automation script with error handling, logging, and scheduling capabilities.",
            rating: 4.8,
            usage_count: 389,
            created_at: "2024-01-04T16:30:00Z"
          },
          {
            id: 40,
            title: "Microservices Architecture",
            category: "backend",
            language: "general",
            prompt_text: "Design a microservices architecture for this application:\n\n**Application Requirements:**\n- Domain: [E-COMMERCE/FINANCE/HEALTHCARE]\n- Scale: [SMALL/MEDIUM/LARGE]\n- Team structure: [MONOLITHIC/TEAM-BASED]\n- Technology stack: [SPECIFY PREFERRED STACK]\n\n**Please design:**\n1. Service decomposition strategy\n2. API gateway configuration\n3. Service communication patterns\n4. Data consistency strategies\n5. Deployment and orchestration\n6. Monitoring and observability\n7. Security and authentication\n8. Testing strategies\n9. CI/CD pipeline\n10. Disaster recovery\n\n**Include:**\n- Service boundaries\n- Event-driven patterns\n- Circuit breakers\n- Distributed tracing\n- Health checks\n- Load balancing",
            description: "Complete microservices architecture with service design, communication, and deployment strategies.",
            rating: 4.9,
            usage_count: 234,
            created_at: "2024-01-03T13:20:00Z"
          },
          {
            id: 41,
            title: "Flutter Mobile App",
            category: "mobile",
            language: "dart",
            prompt_text: "Build a Flutter app with these features:\n\n**App Requirements:**\n- App type: [SOCIAL/ECOMMERCE/UTILITY]\n- Target platforms: [IOS/ANDROID/BOTH]\n- Key features: [LIST MAIN FEATURES]\n- Backend integration: [FIREBASE/API]\n\n**Please implement:**\n1. Flutter project structure\n2. State management (Provider/Bloc/Riverpod)\n3. Navigation and routing\n4. UI components and theming\n5. API integration\n6. Local storage\n7. Push notifications\n8. Platform-specific code\n9. Performance optimization\n10. Testing and deployment\n\n**Include:**\n- Widget architecture\n- Custom animations\n- Responsive design\n- Offline functionality\n- App store preparation\n- Performance profiling",
            description: "Complete Flutter app development with modern patterns and cross-platform optimization.",
            rating: 4.7,
            usage_count: 298,
            created_at: "2024-01-02T10:15:00Z"
          },
          {
            id: 42,
            title: "Deep Learning Model Training",
            category: "ai-ml",
            language: "python",
            prompt_text: "Train a deep learning model for this task:\n\n**Task Requirements:**\n- Task type: [IMAGE CLASSIFICATION/OBJECT DETECTION/NLP]\n- Framework: [TENSORFLOW/PYTORCH]\n- Dataset: [DESCRIBE DATASET]\n- Hardware: [CPU/GPU/TPU]\n\n**Please implement:**\n1. Data preprocessing pipeline\n2. Model architecture design\n3. Training configuration\n4. Validation and testing\n5. Hyperparameter optimization\n6. Model evaluation\n7. Deployment strategy\n8. Performance monitoring\n9. Model versioning\n10. Documentation\n\n**Include:**\n- Data augmentation\n- Transfer learning\n- Model interpretability\n- A/B testing\n- Production deployment\n- Continuous training",
            description: "Complete deep learning model training with modern frameworks and deployment strategies.",
            rating: 4.8,
            usage_count: 189,
            created_at: "2024-01-01T15:45:00Z"
          },
          {
            id: 43,
            title: "PostgreSQL Performance Tuning",
            category: "database",
            language: "sql",
            prompt_text: "Optimize PostgreSQL database performance:\n\n**Database Context:**\n- Database size: [SMALL/MEDIUM/LARGE]\n- Workload type: [OLTP/OLAP/MIXED]\n- Performance issues: [SLOW QUERIES/HIGH CPU/MEMORY]\n- Current configuration: [DEFAULT/CUSTOM]\n\n**Please optimize:**\n1. Query performance analysis\n2. Index optimization\n3. Configuration tuning\n4. Partitioning strategies\n5. Connection pooling\n6. Query caching\n7. Maintenance procedures\n8. Monitoring setup\n9. Backup optimization\n10. Scaling strategies\n\n**Include:**\n- Query execution plans\n- Index recommendations\n- Configuration parameters\n- Partitioning schemes\n- Performance monitoring\n- Capacity planning",
            description: "Comprehensive PostgreSQL performance optimization with tuning and monitoring.",
            rating: 4.6,
            usage_count: 445,
            created_at: "2023-12-31T12:30:00Z"
          },
          {
            id: 44,
            title: "API Rate Limiting Implementation",
            category: "api",
            language: "general",
            prompt_text: "Implement rate limiting for this API:\n\n**API Requirements:**\n- API type: [REST/GRAPHQL/WEBHOOK]\n- Rate limits: [REQUESTS PER MINUTE/HOUR]\n- Storage: [REDIS/MEMORY/DATABASE]\n- Strategy: [TOKEN BUCKET/LEAKY BUCKET/FIXED WINDOW]\n\n**Please implement:**\n1. Rate limiting algorithm\n2. Storage mechanism\n3. Middleware integration\n4. Response headers\n5. Error handling\n6. Monitoring and metrics\n7. Configuration management\n8. Testing strategy\n9. Documentation\n10. Performance optimization\n\n**Include:**\n- Rate limit headers\n- Retry-after logic\n- IP-based limiting\n- User-based limiting\n- Burst handling\n- Graceful degradation",
            description: "Robust API rate limiting implementation with multiple strategies and monitoring.",
            rating: 4.7,
            usage_count: 567,
            created_at: "2023-12-30T09:15:00Z"
          },
          {
            id: 45,
            title: "Kubernetes Deployment Strategy",
            category: "cloud",
            language: "yaml",
            prompt_text: "Design a Kubernetes deployment strategy:\n\n**Application Requirements:**\n- Application type: [WEB/API/BATCH]\n- Scale requirements: [SMALL/MEDIUM/LARGE]\n- High availability: [REQUIRED?]\n- Multi-environment: [DEV/STAGING/PROD]\n\n**Please design:**\n1. Pod and service definitions\n2. Deployment strategies\n3. Service mesh integration\n4. Ingress configuration\n5. Resource management\n6. Monitoring and logging\n7. Security policies\n8. Backup and recovery\n9. CI/CD integration\n10. Cost optimization\n\n**Include:**\n- Rolling updates\n- Blue-green deployments\n- Canary releases\n- Resource quotas\n- Network policies\n- Persistent storage",
            description: "Complete Kubernetes deployment strategy with scaling, monitoring, and best practices.",
            rating: 4.8,
            usage_count: 234,
            created_at: "2023-12-29T14:20:00Z"
          },
          {
            id: 46,
            title: "NFT Smart Contract",
            category: "blockchain",
            language: "solidity",
            prompt_text: "Create an NFT smart contract:\n\n**NFT Requirements:**\n- Standard: [ERC-721/ERC-1155]\n- Metadata: [ON-CHAIN/OFF-CHAIN]\n- Royalties: [REQUIRED?]\n- Marketplace: [INTEGRATED/EXTERNAL]\n\n**Please implement:**\n1. NFT contract structure\n2. Minting functionality\n3. Metadata handling\n4. Royalty system\n5. Access control\n6. Marketplace integration\n7. Gas optimization\n8. Security features\n9. Testing framework\n10. Deployment scripts\n\n**Include:**\n- Batch minting\n- URI management\n- Royalty distribution\n- Access control\n- Emergency functions\n- Gas optimization",
            description: "Complete NFT smart contract with minting, metadata, and marketplace integration.",
            rating: 4.5,
            usage_count: 298,
            created_at: "2023-12-28T11:45:00Z"
          },
          {
            id: 47,
            title: "Unreal Engine Game Development",
            category: "game-dev",
            language: "cpp",
            prompt_text: "Develop a game using Unreal Engine:\n\n**Game Requirements:**\n- Genre: [FPS/RPG/STRATEGY/PUZZLE]\n- Platform: [PC/CONSOLE/MOBILE]\n- Graphics level: [LOW/MEDIUM/HIGH]\n- Multiplayer: [SINGLE/MULTI/BOTH]\n\n**Please implement:**\n1. Project setup and structure\n2. Blueprint and C++ integration\n3. Game framework setup\n4. Character and controller\n5. UI system\n6. Audio integration\n7. AI and behavior trees\n8. Networking\n9. Performance optimization\n10. Build and packaging\n\n**Include:**\n- Game mode setup\n- Level streaming\n- Material system\n- Animation blueprints\n- Networking replication\n- Platform-specific features",
            description: "Complete Unreal Engine game development with Blueprint and C++ integration.",
            rating: 4.6,
            usage_count: 178,
            created_at: "2023-12-27T16:30:00Z"
          },
          {
            id: 48,
            title: "Real-time Analytics Dashboard",
            category: "data-viz",
            language: "javascript",
            prompt_text: "Build a real-time analytics dashboard:\n\n**Dashboard Requirements:**\n- Data source: [WEBSOCKETS/API/EVENT STREAM]\n- Update frequency: [SECONDS/MINUTES]\n- Chart types: [REAL-TIME CHARTS]\n- Framework: [REACT/VUE/ANGULAR]\n\n**Please implement:**\n1. Real-time data connection\n2. Dashboard layout\n3. Live chart updates\n4. Data processing\n5. Performance optimization\n6. Error handling\n7. User interactions\n8. Export functionality\n9. Mobile responsiveness\n10. Accessibility\n\n**Include:**\n- WebSocket integration\n- Chart animations\n- Data buffering\n- Performance monitoring\n- Offline handling\n- Real-time alerts",
            description: "Real-time analytics dashboard with live data updates and interactive visualizations.",
            rating: 4.7,
            usage_count: 345,
            created_at: "2023-12-26T13:15:00Z"
          },
          {
            id: 49,
            title: "CI/CD Pipeline Automation",
            category: "automation",
            language: "yaml",
            prompt_text: "Create a comprehensive CI/CD pipeline:\n\n**Pipeline Requirements:**\n- Repository: [GITHUB/GITLAB/BITBUCKET]\n- Application: [WEB/API/MOBILE]\n- Testing: [UNIT/INTEGRATION/E2E]\n- Deployment: [KUBERNETES/AWS/LOCAL]\n\n**Please implement:**\n1. Build automation\n2. Testing pipeline\n3. Code quality checks\n4. Security scanning\n5. Deployment stages\n6. Environment management\n7. Rollback procedures\n8. Monitoring integration\n9. Notification system\n10. Documentation\n\n**Include:**\n- Multi-stage builds\n- Parallel testing\n- Artifact management\n- Environment promotion\n- Automated rollbacks\n- Performance testing",
            description: "Complete CI/CD pipeline with testing, security, and automated deployment.",
            rating: 4.8,
            usage_count: 456,
            created_at: "2023-12-25T10:45:00Z"
          },
          {
            id: 50,
            title: "Event-Driven Architecture",
            category: "backend",
            language: "general",
            prompt_text: "Design an event-driven architecture:\n\n**System Requirements:**\n- Domain: [E-COMMERCE/FINANCE/LOGISTICS]\n- Event types: [USER ACTIONS/SYSTEM EVENTS]\n- Scale: [SMALL/MEDIUM/LARGE]\n- Technology: [KAFKA/RABBITMQ/AWS SQS]\n\n**Please design:**\n1. Event schema design\n2. Event producer setup\n3. Event consumer patterns\n4. Message routing\n5. Event storage\n6. Error handling\n7. Monitoring and observability\n8. Testing strategies\n9. Performance optimization\n10. Disaster recovery\n\n**Include:**\n- Event sourcing\n- CQRS patterns\n- Dead letter queues\n- Event versioning\n- Schema evolution\n- Event replay",
            description: "Complete event-driven architecture with event sourcing and CQRS patterns.",
            rating: 4.7,
            usage_count: 234,
            created_at: "2023-12-24T15:20:00Z"
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 79,
          totalPages: 4
        }
      };
      
      res.writeHead(200);
      res.end(JSON.stringify(mockPrompts, null, 2));
      return;
    }
    
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const newPrompt = {
            id: Math.floor(Math.random() * 1000) + 100,
            ...data,
            rating: 0,
            usage_count: 0,
            created_at: new Date().toISOString()
          };
          
          res.writeHead(201);
          res.end(JSON.stringify({ message: 'Prompt created successfully', prompt: newPrompt }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
  }

  // Static file serving
  if (pathname === '/') {
    pathname = '/docs/index.html';
  } else if (!pathname.startsWith('/docs/')) {
    pathname = '/docs' + pathname;
  }

  const filePath = path.join(__dirname, pathname);
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 CodePrompt Hub running at http://localhost:${port}`);
  console.log('📊 API endpoints available:');
  console.log('  GET  /api/prompts - Fetch prompts');
  console.log('  POST /api/prompts - Create prompt');
  console.log('📁 Static files served from /docs/');
});

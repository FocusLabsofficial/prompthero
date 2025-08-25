# CodePrompt Hub - Database Migration Guide

This guide will help you migrate from the current mock data setup to a real PostgreSQL database on Vercel.

## 🗄️ **Current Setup**
- **Data Source**: Static JSON in `api/prompts.js` and `docs/js/prompt-hub.js`
- **User Data**: Browser localStorage only
- **No Persistence**: All interactions are temporary

## 🚀 **Migration Benefits**
- ✅ **Real-time data persistence**
- ✅ **User accounts and authentication**
- ✅ **Cross-device synchronization**
- ✅ **Analytics and usage tracking**
- ✅ **Community features (ratings, bookmarks)**
- ✅ **Admin panel for content management**

## 📋 **Migration Steps**

### **Step 1: Set Up Vercel Postgres**

1. **Install Vercel Postgres** (in Vercel Dashboard):
   ```bash
   # Go to your Vercel project dashboard
   # Navigate to Storage tab
   # Click "Create Database" → "Postgres"
   ```

2. **Get Database URL**:
   - Copy the `DATABASE_URL` from Vercel dashboard
   - Add it to your environment variables

### **Step 2: Install Dependencies**

```bash
npm install pg
```

### **Step 3: Create Database Schema**

1. **Run the schema file**:
   ```bash
   # Connect to your Vercel Postgres database
   # Execute the contents of database/schema.sql
   ```

2. **Verify tables created**:
   ```sql
   \dt  -- List all tables
   \d prompts  -- Describe prompts table
   ```

### **Step 4: Migrate Existing Data**

1. **Set environment variable**:
   ```bash
   export DATABASE_URL="your_vercel_postgres_url"
   ```

2. **Run migration script**:
   ```bash
   node database/migrate-data.js
   ```

3. **Verify data migration**:
   ```sql
   SELECT COUNT(*) FROM prompts;  -- Should show migrated prompts
   SELECT COUNT(*) FROM categories;  -- Should show 18 categories
   ```

### **Step 5: Update API Endpoints**

1. **Replace mock API** with database-driven API:
   ```javascript
   // Update api/prompts.js to use database/db.js
   const { getPrompts, createPrompt } = require('../database/db');
   ```

2. **Add new API endpoints**:
   - `POST /api/ratings` - Rate prompts
   - `POST /api/bookmarks` - Toggle bookmarks
   - `POST /api/likes` - Toggle likes
   - `GET /api/categories` - Get categories

### **Step 6: Update Frontend**

1. **Replace mock data loading**:
   ```javascript
   // Update docs/js/prompt-hub.js
   // Replace samplePrompts with API calls
   ```

2. **Add authentication**:
   - User registration/login
   - Session management
   - Protected routes

### **Step 7: Deploy Changes**

```bash
vercel --prod
```

## 🗂️ **Database Schema Overview**

### **Tables Created**:
- **`users`** - User accounts and profiles
- **`categories`** - Prompt categories (18 total)
- **`prompts`** - All coding prompts with metadata
- **`ratings`** - User ratings and comments
- **`bookmarks`** - User bookmarked prompts
- **`likes`** - User liked prompts
- **`usage_tracking`** - Analytics and usage data

### **Key Features**:
- **UUID primary keys** for security
- **Automatic triggers** for statistics updates
- **Proper indexing** for performance
- **Foreign key constraints** for data integrity
- **Soft deletes** support

## 🔧 **API Endpoints (After Migration)**

### **GET /api/prompts**
```javascript
// Query parameters:
{
  category: "debugging",     // Filter by category
  language: "javascript",    // Filter by language
  search: "react",          // Search in title/description
  sort: "rating",           // Sort by: rating, usage, newest
  limit: 20,               // Pagination limit
  offset: 0                // Pagination offset
}
```

### **POST /api/prompts**
```javascript
{
  title: "New Prompt Title",
  description: "Prompt description",
  prompt_text: "Full prompt text...",
  category_id: "uuid",
  language: "javascript",
  tags: ["react", "frontend"]
}
```

### **POST /api/ratings**
```javascript
{
  prompt_id: "uuid",
  rating: 5,              // 1-5 stars
  comment: "Great prompt!" // Optional
}
```

### **POST /api/bookmarks**
```javascript
{
  prompt_id: "uuid",
  action: "toggle"        // Add/remove bookmark
}
```

## 🛠️ **Development Setup**

### **Local Development**:
1. **Install PostgreSQL locally** or use Docker
2. **Set up local database**:
   ```bash
   createdb codeprompt_hub
   psql codeprompt_hub < database/schema.sql
   ```
3. **Set environment variables**:
   ```bash
   export DATABASE_URL="postgresql://localhost/codeprompt_hub"
   export NODE_ENV="development"
   ```

### **Testing**:
```bash
# Test database connection
node -e "require('./database/db').testConnection()"

# Run migration
node database/migrate-data.js

# Test API endpoints
curl http://localhost:3000/api/prompts
```

## 📊 **Performance Considerations**

### **Database Optimization**:
- **Connection pooling** (20 max connections)
- **Query optimization** with proper indexes
- **Caching strategy** for frequently accessed data
- **Pagination** for large result sets

### **Monitoring**:
- **Query performance** tracking
- **Connection pool** monitoring
- **Error logging** and alerting
- **Usage analytics** collection

## 🔒 **Security Features**

### **Data Protection**:
- **SQL injection prevention** with parameterized queries
- **Input validation** and sanitization
- **Rate limiting** on API endpoints
- **CORS configuration** for cross-origin requests

### **User Privacy**:
- **GDPR compliance** with data deletion
- **Anonymized analytics** collection
- **Secure session management**
- **Password hashing** (when auth is added)

## 🚨 **Rollback Plan**

If migration fails, you can:

1. **Keep current mock data** as fallback
2. **Gradual migration** - migrate one feature at a time
3. **Feature flags** - toggle between mock and real data
4. **Database backup** before migration

## 📞 **Support**

If you encounter issues during migration:

1. **Check Vercel logs** for database connection errors
2. **Verify environment variables** are set correctly
3. **Test database connection** locally first
4. **Review migration script** output for errors

## 🎯 **Next Steps After Migration**

1. **Add user authentication** (NextAuth.js, Auth0, etc.)
2. **Implement admin panel** for content management
3. **Add real-time features** (WebSockets, Server-Sent Events)
4. **Set up monitoring** and analytics
5. **Optimize performance** with caching
6. **Add search functionality** (Elasticsearch, Algolia)

---

**Ready to migrate?** Follow the steps above to transform your CodePrompt Hub from mock data to a fully functional database-driven application! 🚀

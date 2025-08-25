#!/bin/bash

# CodePrompt Hub Setup Script

echo "🚀 Setting up CodePrompt Hub..."

# Set environment variables
export DATABASE_URL="postgresql://$(whoami)@localhost:5432/codeprompt_hub"

echo "✅ Environment variables set"
echo "📊 Database URL: $DATABASE_URL"

# Check if PostgreSQL is running
if brew services list | grep -q "postgresql@14.*started"; then
    echo "✅ PostgreSQL is running"
else
    echo "🔄 Starting PostgreSQL..."
    brew services start postgresql@14
fi

# Check if database exists, create if not
if psql -lqt | cut -d \| -f 1 | grep -qw codeprompt_hub; then
    echo "✅ Database 'codeprompt_hub' exists"
else
    echo "🗄️ Creating database 'codeprompt_hub'..."
    createdb codeprompt_hub
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: source setup.sh"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"

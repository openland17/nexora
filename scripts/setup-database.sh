#!/bin/bash

# Database Setup Script for Nexora
# This script helps set up the database for both development and production

set -e

echo "🚀 Nexora Database Setup"
echo "========================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL environment variable is not set"
    echo ""
    echo "For local development, set:"
    echo "  export DATABASE_URL='file:./prisma/dev.db'"
    echo ""
    echo "For production, set:"
    echo "  export DATABASE_URL='mysql://user:password@host:3306/database'"
    echo ""
    read -p "Do you want to continue with default SQLite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    export DATABASE_URL="file:./prisma/dev.db"
fi

echo "📦 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Pushing database schema..."
npx prisma db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "  - Run 'npx prisma studio' to view your database"
echo "  - Or start your dev server with 'npm run dev'"
echo ""


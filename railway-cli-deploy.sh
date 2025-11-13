#!/bin/bash

echo "🚂 Railway CLI Deployment"
echo "========================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli || {
        echo "❌ Failed to install Railway CLI"
        echo "Please install manually: npm install -g @railway/cli"
        exit 1
    }
fi

# Navigate to backend
cd backend || exit 1

echo "🔐 Please login to Railway..."
railway login

echo "🔗 Linking to your Railway project..."
echo "Choose: Link to existing project"
railway link

echo "📊 Current variables:"
railway variables

echo ""
echo "⚙️  Setting required variables..."
read -p "Enter JWT_SECRET (or press Enter to generate): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    echo "Generated JWT_SECRET: $JWT_SECRET"
fi
railway variables set JWT_SECRET="$JWT_SECRET"

read -p "Enter FRONTEND_URL (e.g., https://your-app.vercel.app): " FRONTEND_URL
railway variables set FRONTEND_URL="$FRONTEND_URL"

read -p "Enter RAZORPAY_KEY_ID: " RAZORPAY_KEY_ID
railway variables set RAZORPAY_KEY_ID="$RAZORPAY_KEY_ID"

read -p "Enter RAZORPAY_KEY_SECRET: " RAZORPAY_KEY_SECRET
railway variables set RAZORPAY_KEY_SECRET="$RAZORPAY_KEY_SECRET"

read -p "Enter EMAIL_HOST (default: smtp.gmail.com): " EMAIL_HOST
EMAIL_HOST=${EMAIL_HOST:-smtp.gmail.com}
railway variables set EMAIL_HOST="$EMAIL_HOST"

read -p "Enter EMAIL_PORT (default: 587): " EMAIL_PORT
EMAIL_PORT=${EMAIL_PORT:-587}
railway variables set EMAIL_PORT="$EMAIL_PORT"

read -p "Enter EMAIL_USER: " EMAIL_USER
railway variables set EMAIL_USER="$EMAIL_USER"

read -p "Enter EMAIL_PASSWORD: " EMAIL_PASSWORD
railway variables set EMAIL_PASSWORD="$EMAIL_PASSWORD"

railway variables set NODE_ENV="production"
railway variables set PORT="5000"

echo ""
echo "🗄️  Adding PostgreSQL..."
railway add -d postgresql || echo "⚠️  PostgreSQL may already exist"

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "🔗 Getting your deployment URL..."
railway domain

echo ""
echo "📋 Check deployment status:"
echo "   railway status"
echo ""
echo "📊 View logs:"
echo "   railway logs"
echo ""
echo "🌐 Open in browser:"
echo "   railway open"

cd ..

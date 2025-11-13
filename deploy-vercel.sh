#!/bin/bash

# Real Estate Portal - Vercel Deployment Script
# This script deploys the frontend to Vercel

echo "🚀 Real Estate Portal - Vercel Deployment"
echo "=========================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
vercel whoami || {
    echo "Please login to Vercel:"
    vercel login
}

# Navigate to frontend directory
cd frontend || exit 1

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Set environment variables
echo "⚙️  Setting environment variables..."
echo "Please provide your backend URL from Railway:"

read -p "VITE_API_URL (Railway backend URL): " VITE_API_URL
vercel env add VITE_API_URL production <<< "$VITE_API_URL"

read -p "VITE_GA_MEASUREMENT_ID (Google Analytics): " VITE_GA_MEASUREMENT_ID
vercel env add VITE_GA_MEASUREMENT_ID production <<< "$VITE_GA_MEASUREMENT_ID"

read -p "VITE_RAZORPAY_KEY_ID: " VITE_RAZORPAY_KEY_ID
vercel env add VITE_RAZORPAY_KEY_ID production <<< "$VITE_RAZORPAY_KEY_ID"

read -p "VITE_AGORA_APP_ID (optional): " VITE_AGORA_APP_ID
if [ ! -z "$VITE_AGORA_APP_ID" ]; then
    vercel env add VITE_AGORA_APP_ID production <<< "$VITE_AGORA_APP_ID"
fi

# Redeploy with environment variables
echo "🔄 Redeploying with environment variables..."
vercel --prod

echo ""
echo "🎉 Frontend deployed successfully!"
echo "📋 Next steps:"
echo "  1. Update Railway FRONTEND_URL with Vercel URL"
echo "  2. Set up custom domain if needed"
echo "  3. Test the application"
echo "  4. Submit sitemap to Google Search Console"

cd ..

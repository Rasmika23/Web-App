#!/bin/bash
# Deployment script for Vercel

echo "🚀 Deploying to Vercel..."

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Deploy to Vercel
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your API will be available at the URL shown above"
echo "📝 Don't forget to:"
echo "   1. Add environment variables in Vercel dashboard"
echo "   2. Update frontend API URL to your Vercel URL"

# Cloudinary Setup for Image Uploads

## Overview
The blog submission system now supports image uploads using Cloudinary. Images are automatically compressed to WebP format and optimized for web use.

## Setup Instructions

### 1. Create a Cloudinary Account
1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up for a free account
3. Get your credentials from the Dashboard

### 2. Environment Variables
Add these to your `.env.local` file:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Note**: The system uses unsigned uploads with transformation parameters for automatic optimization.

### 3. Features
- **Automatic Compression**: Images are compressed to WebP format
- **Size Limit**: Maximum 1MB per image
- **Automatic Cleanup**: Old images are deleted when replaced
- **Fallback**: System works without Cloudinary (no image upload)

### 4. Testing
1. Start your development server
2. Go to blog submission form
3. Try uploading an image
4. Check that it compresses and uploads correctly

### 5. Troubleshooting
- If you see "Image upload service not configured", add the environment variables
- If upload fails, check your Cloudinary credentials
- Images will still work without Cloudinary (using placeholder images)

## Image Specifications
- **Format**: WebP (automatic conversion)
- **Max Size**: 1MB after compression
- **Dimensions**: Auto-resized to max 1200x800
- **Quality**: Optimized for web use 
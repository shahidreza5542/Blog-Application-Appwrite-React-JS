# Deployment Guide

## Environment Variables Setup

When deploying to Vercel, Netlify, or any other platform, make sure to set these environment variables:

```
VITE_APPWRITE_PROJECT_ID=68dd1321000ff8ca3f65
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_DB_ID=68de6d520003b0b5a475
VITE_APPWRITE_PROFILE_COLLECTION_ID=9213506847
VITE_APPWRITE_STORAGE_ID=68dd32cf000876f0679e
VITE_APPWRITE_BLOG_COLLECTION_ID=5BxL8kPq9W
VITE_APPWRITE_COMMENT_COLLECTION_ID=
```

## Appwrite Console Setup

### 1. Add Your Domain to Appwrite

1. Go to your Appwrite Console
2. Select your project
3. Go to "Settings" > "Domains"
4. Add your deployment domain (e.g., `https://your-app.vercel.app`)

### 2. Update Collection Permissions

For each collection (Profile, Blog, Storage), set these permissions:

#### Profile Collection (ID: 9213506847)
- Role: `users`
- Permissions: `create`, `read`, `update`, `delete`

#### Blog Collection (ID: 5BxL8kPq9W)
- Role: `users` 
- Permissions: `create`, `read`, `update`, `delete`
- Role: `role:all`
- Permissions: `read` (for public blog viewing)

#### Storage Bucket (ID: 68dd32cf000876f0679e)
- Role: `users`
- Permissions: `create`, `read`, `update`, `delete`
- Role: `role:all`
- Permissions: `read` (for public image viewing)

### 3. Common Issues and Solutions

#### "Failed to fetch" Error
- Check if your deployment domain is added to Appwrite
- Verify environment variables are set correctly
- Check browser console for CORS errors

#### Permission Errors
- Ensure collections have proper permissions set
- Check if user is authenticated before making requests

#### Network Timeout
- Appwrite endpoint might be slow
- Add retry logic for critical requests

## Testing After Deployment

1. Test user registration
2. Test user login
3. Test blog creation
4. Test image upload
5. Test blog viewing (both authenticated and public)

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Check Appwrite console logs
3. Verify all environment variables are set
4. Test API endpoints directly in Appwrite console

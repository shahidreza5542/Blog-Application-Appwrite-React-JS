# Appwrite Permissions Fix

## Issue
Users are getting "missing scopes (["collections.read"])" error when trying to read blog posts.

## Root Cause
The Appwrite collection permissions are not properly configured to allow users to read documents.

## Solution

### 1. Fix Collection Permissions in Appwrite Console

1. **Go to Appwrite Console** → Your Project → Databases → Your Database
2. **Select Blog Collection** (the one storing blog posts)
3. **Go to Settings Tab** → **Permissions**
4. **Add Read Permission for Users:**
   - Click "Add Permission"
   - Select "Users" role
   - Check "Read" permission
   - Save changes

### 2. Alternative: Update Permissions via Code

If you want to set permissions programmatically, add this to your blog creation:

```javascript
// When creating a blog post, set proper permissions
const blogData = await appWriteDB.createDocument(
  ENVObj.VITE_APPWRITE_DB_ID,
  ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
  ID.unique(),
  {
    title: "Your Blog Title",
    content: "Your content...",
    // ... other fields
  },
  [
    Permission.read(Role.any()), // Allow anyone to read
    Permission.update(Role.user(userId)), // Only author can update
    Permission.delete(Role.user(userId))  // Only author can delete
  ]
)
```

### 3. Current Permissions Should Be:

**Blog Collection Permissions:**
- ✅ **Read**: `users` (or `any` for public blogs)
- ✅ **Create**: `users` 
- ✅ **Update**: `users` (document level)
- ✅ **Delete**: `users` (document level)

**Profile Collection Permissions:**
- ✅ **Read**: `users`
- ✅ **Create**: `users`
- ✅ **Update**: `users` (document level)
- ✅ **Delete**: `users` (document level)

### 4. Verify Fix

After updating permissions:
1. Try accessing a blog post
2. Check browser console for errors
3. Verify users can read blog content

### 5. Security Note

- Use `Role.any()` only for public content
- Use `Role.users()` for content that requires authentication
- Use `Role.user(userId)` for user-specific permissions

## Code Changes Made

The app now handles permission errors gracefully:
- Shows a proper permission error page
- Provides helpful error messages
- Continues working even with permission issues

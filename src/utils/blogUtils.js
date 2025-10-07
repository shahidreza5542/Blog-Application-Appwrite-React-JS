import { appWriteDB } from '../lib/appwrite'
import { ENVObj } from '../lib/constant'
import { Query, Permission, Role } from 'appwrite'

// Alternative blog fetching with better error handling
export const fetchBlogBySlug = async (slug) => {
  try {
    console.log('🔍 Attempting to fetch blog with slug:', slug)
    
    // Method 1: Try with listDocuments (current approach)
    try {
      const result = await appWriteDB.listDocuments(
        ENVObj.VITE_APPWRITE_DB_ID,
        ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
        [Query.equal("slug", slug)]
      )
      
      if (result.documents && result.documents.length > 0) {
        console.log('✅ Blog found via listDocuments')
        return { success: true, blog: result.documents[0] }
      }
    } catch (listError) {
      console.log('❌ listDocuments failed:', listError.message)
      
      // If it's a permission error, return specific error
      if (listError.message?.includes('missing scopes') || listError.code === 401) {
        return { 
          success: false, 
          error: 'permission', 
          message: 'Permission denied. Please check collection permissions in Appwrite Console.' 
        }
      }
    }
    
    // If no blog found
    return { 
      success: false, 
      error: 'not_found', 
      message: 'Blog post not found' 
    }
    
  } catch (error) {
    console.error('💥 Unexpected error in fetchBlogBySlug:', error)
    return { 
      success: false, 
      error: 'unknown', 
      message: error.message || 'Failed to fetch blog' 
    }
  }
}

// Function to check if user has proper permissions
export const checkCollectionPermissions = async () => {
  try {
    // Try to list documents with limit 1 to test permissions
    const test = await appWriteDB.listDocuments(
      ENVObj.VITE_APPWRITE_DB_ID,
      ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
      [Query.limit(1)]
    )
    
    console.log('✅ Collection permissions are working')
    return { hasPermission: true }
    
  } catch (error) {
    console.error('❌ Collection permission test failed:', error.message)
    return { 
      hasPermission: false, 
      error: error.message,
      needsPermissionFix: error.message?.includes('missing scopes') || error.code === 401
    }
  }
}

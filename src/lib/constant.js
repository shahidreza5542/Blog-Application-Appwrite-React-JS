import slugify from "slugify"
import {v4 as uuid} from 'uuid'
export const ENVObj = {
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID || '68dd1321000ff8ca3f65',
    VITE_APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    VITE_APPWRITE_DB_ID: import.meta.env.VITE_APPWRITE_DB_ID || '68de6d520003b0b5a475',
    VITE_APPWRITE_PROFILE_COLLECTION_ID: import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID || '9213506847',
    VITE_APPWRITE_STORAGE_ID: import.meta.env.VITE_APPWRITE_STORAGE_ID || '68dd32cf000876f0679e',
    VITE_APPWRITE_BLOG_COLLECTION_ID: import.meta.env.VITE_APPWRITE_BLOG_COLLECTION_ID || '5BxL8kPq9W',
    VITE_APPWRITE_COMMENT_COLLECTION_ID: import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID || '',
}

export const generateSlug = (str)=> slugify(str+"--------"+"----------"+new Date().getTime()+"-------"+uuid(),{
    lower:true,
    trim:true,
    replacement:''
    
})
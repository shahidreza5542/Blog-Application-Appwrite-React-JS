import slugify from "slugify"
import {v4 as uuid} from 'uuid'
export const ENVObj={
    VITE_APPWRITE_PROJECT_ID:import.meta.env.VITE_APPWRITE_PROJECT_ID,
    VITE_APPWRITE_ENDPOINT:import.meta.env.VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_DB_ID:import.meta.env.VITE_APPWRITE_DB_ID,
    VITE_APPWRITE_PROFILE_COLLECTION_ID:import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID,
    VITE_APPWRITE_STORAGE_ID:import.meta.env.VITE_APPWRITE_STORAGE_ID,
    VITE_APPWRITE_BLOG_COLLECTION_ID:import.meta.env.VITE_APPWRITE_BLOG_COLLECTION_ID,
    VITE_APPWRITE_COMMENT_COLLECTION_ID:import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID,
    
}

export const generateSlug = (str)=> slugify(str+"--------"+"----------"+new Date().getTime()+"-------"+uuid(),{
    lower:true,
    trim:true,
    replacement:''
    
})
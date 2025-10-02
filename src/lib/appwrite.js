import { Client, Account, Databases, Storage, Query} from 'appwrite';
import { ENVObj } from './constant';

export const client = new Client();

// Only initialize Appwrite client in browser environment
if (typeof window !== 'undefined') {
  try {
    client
      .setEndpoint(ENVObj.VITE_APPWRITE_ENDPOINT)
      .setProject(ENVObj.VITE_APPWRITE_PROJECT_ID);
    
    console.log('Appwrite client initialized:', {
      endpoint: ENVObj.VITE_APPWRITE_ENDPOINT,
      project: ENVObj.VITE_APPWRITE_PROJECT_ID
    });
  } catch (error) {
    console.error('Failed to initialize Appwrite client:', error);
  }
} else {
  console.log('Skipping Appwrite initialization during build');
}

export const appwriteAccount = new Account(client);
 export const appWriteDB = new Databases(client);
export const appWriteStorage = new Storage(client)


//  exist document in profile 

export const checkExistProfile = async (userId) => {
  try {
    const data = await appWriteDB.listDocuments(
      ENVObj.VITE_APPWRITE_DB_ID,
      ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,
      [
        Query.equal("user", userId),
        Query.limit(1) // Only get the first match
      ]
    )
    return data.documents[0] || null
  } catch (error) {
    console.log("Profile check error:", error)
    if (error.code === 401 || error.code === 404) {
      // Return null for permission or not found errors
      return null
    }
    throw error // Re-throw other errors
  }
}
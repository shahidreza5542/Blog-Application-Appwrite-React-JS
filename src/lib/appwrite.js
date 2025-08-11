import { Client, Account, Databases, Storage, Query} from 'appwrite';
import { ENVObj } from './constant';

export const client = new Client();

client
    .setEndpoint(ENVObj.VITE_APPWRITE_ENDPOINT)
    .setProject(ENVObj.VITE_APPWRITE_PROJECT_ID); // Replace with your project ID

export const appwriteAccount = new Account(client);
 export const appWriteDB = new Databases(client);
export const appWriteStorage = new Storage(client)


//  exist document in profile 

export const checkExistProfile = async(user)=>{

  const {documents} =     await appWriteDB.listDocuments(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,[
    Query.equal('user',user)
  ])

  if(documents.length<1){
    return null
  }
 
  
          const existUser = documents.find((cur,i)=>{
  return cur.user == user
          })
  
          return existUser
          

}
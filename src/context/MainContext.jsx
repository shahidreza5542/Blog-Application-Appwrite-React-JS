import React, { createContext, useContext, useEffect, useState } from 'react'
import LoaderComponent from '../components/LoaderComponent'
import { appwriteAccount, appWriteDB, checkExistProfile } from '../lib/appwrite'
import { useDispatch, useSelector } from 'react-redux'
import { AuthSlicePath, removeUser, setUser } from '../redux/slices/Auth.slice'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ENVObj } from '../lib/constant'
import { Query } from 'appwrite'

export const MainContext = createContext()


export const useMainContext = ()=> useContext(MainContext)

export const MainContextProvider = ({children}) => {


  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch() 
const navigate = useNavigate() 
const [checkOnce,SetCheckOnece] = useState(true)
    const authuser = useSelector(AuthSlicePath)

 const [blogs,setBlogs] = useState([]) 
 const [allBlogs,setAllBlogs] = useState([]) 
    const fetchAllHomeBlogs = async() => {
        try {
            console.log('📚 Fetching blogs...')
            
            const data = await appWriteDB.listDocuments(
                ENVObj.VITE_APPWRITE_DB_ID, 
                ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID, 
                [ 
                    Query.equal("status", true),
                    Query.limit(15), // Reduced to 15 for faster loading
                    Query.orderDesc('$createdAt'),
                    Query.select([
                        'description',
                        'image', 
                        'slug',
                        'status',
                        'title',
                        'tags',
                        'user',
                        '$createdAt'
                    ])
                ]
            )

            setAllBlogs(data.documents)
            console.log(`✅ Loaded ${data.documents.length} blogs`)
            
        } catch (error) {
            console.log('fetchAllHomeBlogs error:', error)
            
            // Only show error for non-permission issues
            if (error.code !== 401) {
                console.warn('⚠️ Blog fetch failed, continuing with empty state')
                setAllBlogs([]) // Set empty array instead of showing error
            }
        } 
    }

    const fetchAllBlog = async() => {
        try {
            const data = await appWriteDB.listDocuments(ENVObj.VITE_APPWRITE_DB_ID, ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID, [
                Query.equal('user', authuser.$id),
                Query.select([
                    'description',
                    'image',
                    'slug',
                    'status',
                    'title',
                    'tags'
                ])
            ])

            setBlogs(data.documents)
        } catch (error) {
            console.log('fetchAllBlog error:', error)
            // Only show error if it's not a permission issue
            if (error.code !== 401) {
                toast.error(error.message)
            }
        } 
    }


 
 
  const logoutHandler= async()=>{
      try {
         await appwriteAccount.deleteSession('current');
         dispatch(removeUser())
      setBlogs([])

         navigate("/")
         toast.success("Logout Success")
      } catch (error) {
        toast.error(error.message)
      }
  }

  const fetchUser = async () => {
    try {
      if (checkOnce) {
        setLoading(true)
      }
      
      console.log('🔄 Fetching user from Appwrite...')
      
      // Remove timeout - let it complete naturally
      const user = await appwriteAccount.get()
      console.log('✅ User fetched successfully:', user.name || user.email)
      
      // Set user immediately without waiting for profile
      dispatch(setUser({
        ...user,
        profile: {
          bio: '',
          name: user.name || 'Anonymous User',
          user: user.$id
        }
      }))
      
      // Fetch profile in background (non-blocking)
      checkExistProfile(user.$id)
        .then(profile => {
          if (profile) {
            dispatch(setUser({
              ...user,
              profile: {
                ...profile,
                name: profile.name || user.name || 'Anonymous User'
              }
            }))
            console.log('✅ Profile updated:', profile.name)
          }
        })
        .catch(profileError => {
          console.log('Profile fetch failed (non-critical):', profileError)
        })
   
    } catch (error) {
      console.log('fetchUser error:', error)
      
      // Handle different error types
      if (error.message?.includes('fetch') || error.name === 'TypeError') {
        console.warn('⚠️ Network error during user fetch, continuing without user')
        // Don't show error toast - just continue without user
      } else if (error.code === 401 || error.type === 'general_unauthorized_scope') {
        console.log('No valid session found')
        dispatch(removeUser())
        setBlogs([])
      } else {
        console.warn('User fetch failed, continuing without user:', error.message)
      }
    } finally {
      setLoading(false)
      SetCheckOnece(false)
    }
  }
  useEffect(() => {
    // Only run API calls in browser environment, not during build
    if (typeof window !== 'undefined') {
      fetchUser()
      fetchAllHomeBlogs()
    } else {
      // During build time, just set loading to false
      setLoading(false)
      SetCheckOnece(false)
    }
  }, [])




  // Show simple loading only for initial load
  if(loading && checkOnce){
    return <LoaderComponent/>
  }
  return (
    <MainContext.Provider value={{logoutHandler,fetchUser,fetchAllBlog,blogs,allBlogs,fetchAllHomeBlogs}}>{children}</MainContext.Provider>
  )
} 
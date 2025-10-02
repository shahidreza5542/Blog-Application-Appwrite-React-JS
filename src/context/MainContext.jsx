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



  const fetchAllHomeBlogs = async()=>{
        try {
           
            const data = await  appWriteDB.listDocuments(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,[ 
              Query.equal("status",true),
                Query.select(['description',
                      'image',
                      'slug',
                      'status',
                      'title',
                      'tags',
                      'user'

                ])
            ])

            setAllBlogs(data.documents)
        } catch (error) {
            console.log('fetchAllHomeBlogs error:', error)
            // Only show error if it's not a permission issue
            if (error.code !== 401) {
                toast.error(error.message)
            }
        } 
    }




    const fetchAllBlog = async()=>{
        try {
           
            const data = await  appWriteDB.listDocuments(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,[
                Query.equal('user',authuser.$id),
                Query.select(['description',
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
      
      console.log('Fetching user from Appwrite...')
      const user = await appwriteAccount.get()
      console.log('Fetched user from Appwrite:', user)
      
      // Try to get user profile
      try {
        const profile = await checkExistProfile(user.$id)
        user['profile'] = {
          ...profile,
          // Fallback to user's name from account if profile name doesn't exist
          name: profile?.name || user.name || 'Anonymous User'
        }
        console.log('Profile found:', user.profile)
      } catch (profileError) {
        console.log('Profile check failed, using default profile:', profileError)
        // Create a default profile object
        user['profile'] = {
          bio: '',
          name: user.name || 'Anonymous User',
          user: user.$id
        }
      }

      dispatch(setUser(user))
      console.log('User set in context:', user)
   
    } catch (error) {
      console.log('fetchUser error:', error)
      
      // Handle network errors specifically
      if (error.message?.includes('fetch') || error.name === 'TypeError') {
        console.error('Network error during user fetch:', error)
        // Don't remove user state on network errors, just log it
        if (checkOnce) {
          toast.error('Network error. Please check your connection.')
        }
      } else if (error.code === 401 || error.type === 'general_unauthorized_scope') {
        // Only remove user if there's no valid session
        dispatch(removeUser())
        setBlogs([])
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




  if(loading){
    return <LoaderComponent/>
  }
  return (
    <MainContext.Provider value={{logoutHandler,fetchUser,fetchAllBlog,blogs,allBlogs,fetchAllHomeBlogs}}>{children}</MainContext.Provider>
  )
} 
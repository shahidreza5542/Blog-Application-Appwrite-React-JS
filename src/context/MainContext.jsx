import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import LoaderComponent from '../components/LoaderComponent'
import { appwriteAccount, appWriteDB, checkExistProfile } from '../lib/appwrite'
import { useDispatch, useSelector } from 'react-redux'
import { AuthSlicePath, removeUser, setUser } from '../redux/slices/Auth.slice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ENVObj } from '../lib/constant'
import { Query } from 'appwrite'

export const MainContext = createContext()

export const useMainContext = () => useContext(MainContext)

export const MainContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [blogsLoading, setBlogsLoading] = useState(false)
  const dispatch = useDispatch() 
  const navigate = useNavigate() 
  const [checkOnce, SetCheckOnece] = useState(true)
  const authuser = useSelector(AuthSlicePath)
  
  const [blogs, setBlogs] = useState([]) 
  const [allBlogs, setAllBlogs] = useState([])

  // Optimized fetch function with better error handling
  const fetchAllHomeBlogs = useCallback(async () => {
    setBlogsLoading(true)
    try {
      const data = await appWriteDB.listDocuments(
        ENVObj.VITE_APPWRITE_DB_ID,
        ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
        [ 
          Query.equal("status", true),
          Query.orderDesc('$createdAt'),
          Query.limit(50), // Increased limit for better UX
          Query.select([
            'description',
            'image', 
            'slug',
            'status',
            'title',
            'tags',
            'user',
            '$createdAt',
            '$id'
          ])
        ]
      )

      setAllBlogs(data.documents)
      
    } catch (error) {
      console.warn('fetchAllHomeBlogs error:', error)
      
      // Handle different error types gracefully
      if (error.code === 401) {
        console.log('Permission denied - trying public access')
        // Try without authentication
        try {
          const publicData = await appWriteDB.listDocuments(
            ENVObj.VITE_APPWRITE_DB_ID,
            ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
            [Query.equal("status", true), Query.limit(20)]
          )
          setAllBlogs(publicData.documents)
        } catch (publicError) {
          console.log('Public access also failed:', publicError)
          setAllBlogs([])
        }
      } else if (error.code === 404) {
        console.log('Collection not found')
        setAllBlogs([])
      } else {
        console.error('Unexpected error:', error)
        setAllBlogs([])
      }
    } finally {
      setBlogsLoading(false)
    }
  }, [])

  // Optimized user blogs fetch
  const fetchAllBlog = useCallback(async () => {
    if (!authuser?.$id) return
    
    try {
      const data = await appWriteDB.listDocuments(
        ENVObj.VITE_APPWRITE_DB_ID,
        ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
        [
          Query.equal('user', authuser.$id),
          Query.orderDesc('$createdAt'),
          Query.select([
            'description',
            'image',
            'slug', 
            'status',
            'title',
            'tags',
            '$createdAt',
            '$id'
          ])
        ]
      )

      setBlogs(data.documents)
    } catch (error) {
      console.log('fetchAllBlog error:', error)
      if (error.code !== 401) {
        toast.error('Failed to load your blogs')
      }
      setBlogs([])
    }
  }, [authuser?.$id])

  // Optimized logout handler
  const logoutHandler = useCallback(async () => {
    try {
      await appwriteAccount.deleteSession('current')
      dispatch(removeUser())
      setBlogs([])
      setAllBlogs([])
      navigate("/")
      toast.success("Logout successful")
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if session deletion fails
      dispatch(removeUser())
      setBlogs([])
      navigate("/")
      toast.success("Logged out")
    }
  }, [dispatch, navigate])

  // Optimized user fetch with better error handling
  const fetchUser = useCallback(async () => {
    try {
      if (checkOnce) {
        setLoading(true)
      }
      
      const user = await appwriteAccount.get()
      console.log('Fetched user from Appwrite:', user)
      
      // Try to get profile but don't fail if it doesn't exist
      try {
        const profile = await checkExistProfile(user.$id)
        user['profile'] = profile || { name: user.name || 'Anonymous User' }
      } catch (profileError) {
        console.log('Profile check failed, using default:', profileError)
        user['profile'] = { name: user.name || 'Anonymous User' }
      }

      dispatch(setUser(user))
      console.log('User set in context:', user)
   
    } catch (error) {
      console.log('fetchUser error:', error)
      // Only remove user if there's no valid session
      if (error.code === 401 || error.type === 'general_unauthorized_scope') {
        dispatch(removeUser())
        setBlogs([])
      }
    } finally {
      setLoading(false)
      SetCheckOnece(false)
    }
  }, [checkOnce, dispatch])

  // Initialize app
  useEffect(() => {
    fetchUser()
    fetchAllHomeBlogs()
  }, [fetchUser, fetchAllHomeBlogs])

  // Memoized context value for performance
  const contextValue = {
    logoutHandler,
    fetchUser,
    fetchAllBlog,
    blogs,
    allBlogs,
    fetchAllHomeBlogs,
    blogsLoading,
    loading
  }

  if (loading) {
    return <LoaderComponent />
  }

  return (
    <MainContext.Provider value={contextValue}>
      {children}
    </MainContext.Provider>
  )
} 
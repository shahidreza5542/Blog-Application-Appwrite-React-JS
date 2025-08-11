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
            toast.error(error.message)
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
            toast.error(error.message)
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

  const fetchUser=async()=>{
    try {
     
      if(checkOnce){
        setLoading(true)
      }
       const user =await appwriteAccount.get()
       const profile = await checkExistProfile(user.$id)
       user['profile'] = profile

       dispatch(setUser(user))
   
    } catch (error) {
      dispatch(removeUser())
      setBlogs([])
    }finally{
      setLoading(false)
      SetCheckOnece(false)
    }
  }
  useEffect(()=>{
    fetchUser()
    fetchAllHomeBlogs()
    
  },[])




  if(loading){
    return <LoaderComponent/>
  }
  return (
    <MainContext.Provider value={{logoutHandler,fetchUser,fetchAllBlog,blogs,allBlogs,fetchAllHomeBlogs}}>{children}</MainContext.Provider>
  )
} 
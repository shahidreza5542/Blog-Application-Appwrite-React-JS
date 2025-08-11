import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appWriteDB, appWriteStorage } from '../../lib/appwrite'
import { ENVObj } from '../../lib/constant'
import moment from 'moment'
import toast from 'react-hot-toast'
import { Query } from 'appwrite'

const HomeBlogCard = ({data}) => {
    const [user,setUser] = useState({})
    const [images,setImages] = useState({
        image:'',
        profileImage:''
    })

    
    const tags = data?.tags?.split(",")

  


  const fetchuser=async()=>{
    try {
         const {documents} = await appWriteDB.listDocuments(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,[
            Query.equal('user',data.user),
            Query.select(['name','image'])
         ])
         setUser(documents[0])

         
    const profileImage =  appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID,documents[0].image)
  
    
     const image = appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID,data.image)
    setImages({ image,profileImage}) 


    } catch (error) {
        toast.error(error.message)
    }
  }
  useEffect(()=>{
    fetchuser()
   
  },[])


  return (
    <>
       
    <Link  to={`/blog/${data.slug}`}> 
  <div className="relative flex flex-col my-2  bg-section shadow-sm border border-btn rounded-lg  ">
    <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
        
      <img src={images.image} alt={data.title} className='transition-all duration-300 hover:scale-105 ' />
    </div>
    <div className="p-4">
    
      <h6 className="mb-2 text-white text-xl font-psmbold">
        {data.title}
      </h6>
      <p className="text-zinc-300 leading-normal font-pregular h-16">
        {data.description?.substring(0,100)} {data.description?.length>100?'...':''}
      </p>
         <ul className="flex items-center justify-start  gap-x-1 flex-wrap">
                        {
                            tags && tags.length> 0 && tags.map((cur,i)=>{
                                return <li className='px-5 py-1 rounded-full shadow bg-main  capitalize'>{cur}</li>
                            })
                        }
                    </ul>

    </div>
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
      {images.profileImage &&  <img alt={user && user.name} src={images.profileImage} className="relative inline-block h-8 w-8 rounded-full" />}
        <div className="flex flex-col ml-3 text-sm">
          <span className="text-zinc-200 font-semibold">{user && user.name}</span>
          <span className="text-zinc-300">
                   {moment(new Date(data.$createdAt)).format("LL")}

          </span>
        </div>
      </div>
    </div>
    <p className="text-end px-4 text-xs text-zinc-400 pb-2">
        {moment(new Date(data.$createdAt)).format("LLL")}
    </p>
  </div> 
</Link>


    </>
  )
}

export default HomeBlogCard
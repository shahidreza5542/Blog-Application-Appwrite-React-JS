import React, { useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import { CgSearch } from 'react-icons/cg'
import toast from 'react-hot-toast'
import { appWriteDB } from './../../lib/appwrite';
import { ENVObj } from '../../lib/constant';
import { Query } from 'appwrite';
import { useSelector } from 'react-redux';
import { AuthSlicePath } from './../../redux/slices/Auth.slice';
import NoBlogSection from './NoBlogSection';
import { useMainContext } from '../../context/MainContext';

const AllBlogPage = () => {

    const [placeHolder,setPlaceHolder]= useState('')
    const[search,setSearch] = useState('') 
    const {fetchAllBlog,blogs } = useMainContext()
    const [loading,setLoading] = useState(true)

    




    useEffect(()=>{
        fetchAllBlog().then(()=>setLoading(false))
    },[])


    useEffect(()=>{
       const p1 = setInterval(()=>{
                if(placeHolder==="Title"){
                    setPlaceHolder("Description")
                }else{
                    setPlaceHolder("Title")
                    
                }
        },1000)
        return ()=>{
            clearInterval(p1)
        }
    })

    
    if(loading){
        return <div>loading...</div>
    }

    const filterBlogs = blogs.length>0 ? blogs.filter((cur,i)=>{
        if(!search){
            return true
        }
        const x = cur?.title?.toLowerCase()
        const y = cur?.description?.toLowerCase()
        const z = search.toLowerCase()
        return x.includes(z) || y.includes(z)
    }) : []


  return (
    <>

            <div className="container mx-auto py-10 mt-16">


                <div className="flex py-10 bg-black/10 rounded w-full flex-col gap-y-4 ">
                    <div className="pb-3  w-[96%] mx-auto lg:w-[80%]  flex justify-end  ">
                   <div className="flex items-center w-1/2 justify-center border rounded px-4">
                         <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" name="" className='w-full  outline-none   py-3   ' id="" placeholder={`Search by Blog "${placeHolder}" `} />
                         <CgSearch className='text-gray-300 text-3xl' />
                   </div>
                    </div>
                    {
                       blogs&& filterBlogs.length>0 ? filterBlogs.map((cur,i)=>{
                            return <BlogCard  data={cur} key={i} />
                        }):
                        <>
                    <NoBlogSection/>
                        </>
                    }

                </div>

            </div>
    </>
  )
}

export default AllBlogPage
import React, { useEffect, useState } from 'react'
import { useMainContext } from '../../context/MainContext'
import HomeBlogCard from './HomeBlogCard'
import { CgSearch } from 'react-icons/cg'

const HomePage = () => { 

  const {allBlogs,fetchAllHomeBlogs} = useMainContext()

  const [search,setSearch] = useState('')

  const filterBlogs = allBlogs.length <= 0? [] : allBlogs.filter((cur,i)=>{
    if(!search){
      return true
    }
    const x = cur.title?.toLowerCase()
    const y = cur.description?.toLowerCase()
    const z = cur.tags?.toLowerCase()
    const alpha = search.toLowerCase()

    return x.includes(alpha) || y.includes(alpha) || z.includes(alpha)


  })
 
    
  return (
    <>


            <div className="grid min-h-[80vh] w-[98%] lg:w-[80%] mx-auto grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3">
            <div className="pt-10 pb-4 col-span-1 lg:col-span-2 xl:col-span-3 flex items-center justify-end">
              <div className=" w-full xl:w-1/3 border py-3 px-4 rounded flex items-center justify-center hover:border-btn  ">
              <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" className=' w-full outline-none ' placeholder='Search....' />
              <CgSearch className='text-3xl ' />
              </div>
            </div>

                  {
                    allBlogs && filterBlogs.length>0 ?filterBlogs.map((cur,i)=>{
                      return <HomeBlogCard key={i}  data={cur} />
                    }):
                    <>
                       <div className="py-10 text-center col-span-1 lg:col-span-2 xl:col-span-3">
                         <h1 className='text-5xl font-pblack '> Not Found <span className='text-btn'>!</span> </h1>
                       </div>
                    </>
                  }

            </div>
    </>
  )
}

export default HomePage
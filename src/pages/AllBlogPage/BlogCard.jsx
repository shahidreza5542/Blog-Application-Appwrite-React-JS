import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { appWriteStorage } from '../../lib/appwrite'
import { ENVObj } from '../../lib/constant'
import clsx from 'clsx'
import DeleteBlogCard from './DeleteBlogCard'
import moment from 'moment/moment'

const BlogCard = ({data}) => {


    const image = appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID,data.image)

    const tags = data?.tags?.split(",")


  return (
    <div className=' w-[96%] lg:w-[80%] mx-auto bg-section py-5 px-4 rounded shadow hover:shadow-2xl cursor-pointer  border border-transparent hover:border-btn  transition-all duration-300 grid grid-cols-1 lg:grid-cols-4 gap-x-1'>
        
            <div className="col-span-1 overflow-hidden lg:h-44 ">
                <img src={image} className='w-full h-full rounded  hover:scale-110 transition-all duration-300 object-cover' alt="" />
            </div>
            
            <div className="col-span-3 lg:pl-5 flex flex-col gap-y-6 lg:gap-y-4 py-4">
                <p className="text-3xl text-start font-pbold capitalize">{data.title}</p>
                <p>{data.description}  </p>

                    <p className='  text-start'>
                    <span className={clsx('px-4 py-2 rounded-full  text-white',data.status?'bg-green-500':'bg-red-500')}>Status : {data.status ?'published':'un-published'}  </span>

                    </p>
                    <p className="text-p text-xs text-start ">
                        {moment(new Date(data.$createdAt)).format('LLL')}
                    </p>

                    <ul className="flex items-center justify-start  gap-x-1 flex-wrap">
                        {
                            tags && tags.length> 0 && tags.map((cur,i)=>{
                                return <li className='px-5 py-1 rounded-full shadow bg-main  capitalize'>{cur}</li>
                            })
                        }
                    </ul>



                    <div className="flex justify-center lg:justify-end">
                        <Link to={'/blog/update/'+data.$id} className='px-3 py-2 outline-none mx-1 rounded bg-main flex items-center cursor-pointer justify-center gap-x-3'><span>Edit</span> <FaEdit/> </Link>
                            <DeleteBlogCard data={data} />
                        <Link to={'/blog/'+data.slug} className='px-3 py-2 outline-none mx-1 rounded bg-btn'>View</Link>
                    </div>
                    


            </div>
    </div>
  )
}

export default BlogCard
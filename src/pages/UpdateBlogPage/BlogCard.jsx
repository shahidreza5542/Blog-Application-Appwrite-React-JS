import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const BlogCard = () => {





  return (
    <div className=' w-[96%] lg:w-[80%] mx-auto bg-section py-5 px-4 rounded shadow hover:shadow-2xl cursor-pointer  border border-transparent hover:border-btn  transition-all duration-300 grid grid-cols-1 lg:grid-cols-4 gap-x-1'>
            <div className="col-span-1 overflow-hidden lg:h-44 ">
                <img src="https://nyc.cloud.appwrite.io/v1/storage/buckets/687cbdb0001af20ced97/files/688307750031ed658124/preview?width=640&height=300&project=6878783100012c76bc7c&mode=admin" className='w-full h-full rounded  hover:scale-110 transition-all duration-300' alt="" />
            </div>
            <div className="col-span-3 lg:pl-5 flex flex-col gap-y-6 lg:gap-y-4 py-4">
                <p className="text-3xl text-start font-pbold">Blog Title</p>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus laboriosam perferendis minima quos sunt temporibus corporis maiores rerum quis vel. Ratione, ipsam voluptates.</p>

                    <p className=' text-center lg:text-start'>
                    <span className='px-4 py-2 rounded-full bg-green-700 text-white'>Status : Published  </span>

                    </p>
                    <div className="flex justify-center lg:justify-end">
                        <Link to={'/blog/update/1'} className='px-3 py-2 outline-none mx-1 rounded bg-main flex items-center cursor-pointer justify-center gap-x-3'><span>Edit</span> <FaEdit/> </Link>
                        <button className='px-3 py-2 outline-none flex items-center justify-center cursor-pointer gap-x-2 mx-1 rounded bg-red-500'>
                            <span>Delete</span><FaTrash/>
                        </button>
                        <Link to={'/'} className='px-3 py-2 outline-none mx-1 rounded bg-btn'>View</Link>
                    </div>


            </div>
    </div>
  )
}

export default BlogCard
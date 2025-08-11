import React from 'react'
import { Link } from 'react-router-dom'

const NoBlogSection = () => {
  return (
    <>
                <div className="my-4 w-[96%] lg:w-[80%] mx-auto">
                    <div className="py-10 bg-main" >
                        <img src="/image.png" className='w-[200px] h-[200px] rounded-full  mx-auto' alt="" />
                        <p className="text-center text-2xl font-bold">No Blog Found !</p>

    <div className="flex items-center justify-center py-3">
                        <Link to={'/add-blog'} className="px-3 rounded py-2 bg-btn mx-auto">Add Blog</Link>

    </div>
                    </div>
                </div>
    </>
  )
}

export default NoBlogSection
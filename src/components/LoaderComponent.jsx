import React, { useEffect, useState } from 'react'
import { FaFreeCodeCamp } from 'react-icons/fa'



const LoaderComponent = () => {


  const [progress,setProgress] = useState(0)

  useEffect(()=>{
    let interval = setInterval(()=>{
      if(progress>100){
        return
      }
      setProgress(progress+1)
    },100)
    return ()=>{
      clearInterval(interval)
    }
  })

  return (
    <div className="flex items-center justify-center min-h-screen flex-col">

       <div className="">
         <div   title='Blogi' className='font-pbold  text-5xl lg:text-7xl flex items-center justify-center gap-x-1'>
              <FaFreeCodeCamp className='text-btn' />  <span>Blogi</span> <span className='w-2 h-2 rounded-full bg-btn animate-bounce'></span>
    </div>
    <div className=" overflow-hidden w-full bg-black/40 my-4 ">
      <div 
      style={{
        width:`${progress}%`
      }}
      className='bg-btn   py-1 rounded-l-full rounded-b-full'></div>
    </div>
       </div>
    </div>
  )
}

export default LoaderComponent
import React from 'react'
import { Link } from 'react-router-dom'
import { FaLaptopCode } from "react-icons/fa6";

const Logo = () => {
  return (
    <Link to={'/'} title='Blogi' className='font-pbold text-2xl flex items-center justify-center gap-x-1'>
              <FaLaptopCode className='text-btn text-3xl mr-1 font-pbold' />  <span>Blogi</span> <span className='w-2 h-2 rounded-full bg-btn animate-bounce'></span>
    </Link>
  )
}

export default Logo
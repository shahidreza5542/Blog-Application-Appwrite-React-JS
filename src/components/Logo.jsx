import React from 'react'
import { Link } from 'react-router-dom'
import { FaFreeCodeCamp } from "react-icons/fa";

const Logo = () => {
  return (
    <Link to={'/'} title='Blogi' className='font-pbold text-2xl flex items-center justify-center gap-x-1'>
              <FaFreeCodeCamp className='text-btn' />  <span>Blogi</span> <span className='w-2 h-2 rounded-full bg-btn animate-bounce'></span>
    </Link>
  )
}

export default Logo
import clsx from 'clsx'
import React from 'react'
import { CgSpinner } from 'react-icons/cg'
import { FaArrowRight } from 'react-icons/fa'

const CustomLoaderButton = ({
    type='submit',
    isLoading=false,
    className,
    text
}) => {
  return (
    <button type={type} disabled={isLoading} className={clsx(className,'w-full bg-btn flex items-center justify-center gap-x-1 outline-none cursor-pointer disabled:cursor-auto transition-all duration-100 disabled:bg-rose-800 hover:bg-btn-hover text-white py-2 rounded ')}>
            <span>{text}</span>
            {
              isLoading?  <CgSpinner className='animate-spin' /> :<FaArrowRight/>
            }
    </button>
  )
}

export default CustomLoaderButton
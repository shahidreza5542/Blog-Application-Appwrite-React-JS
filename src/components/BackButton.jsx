import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
    const navigate = useNavigate()
  return (
    <>
        <button  type='button' onClick={()=>navigate(-1)} className='flex items-center justify-center gap-x-2 bg-main px-3 py-2 rounded'>
            <FaArrowLeft/> <span>Back</span>
        </button>
    </>
  )
}

export default BackButton
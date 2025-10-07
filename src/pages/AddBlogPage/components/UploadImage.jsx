import React, { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
import { AiOutlineCloudUpload } from "react-icons/ai";
import {MdClose} from 'react-icons/md'
import toast from 'react-hot-toast'

export default function UploadImage({value,setValue}) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    
    // Security check: validate file type and size
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files (JPEG, PNG, WebP, GIF) are allowed')
        return
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      // Check for suspicious file names
      const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.vbs']
      const fileName = file.name.toLowerCase()
      if (suspiciousExtensions.some(ext => fileName.includes(ext))) {
        toast.error('File type not allowed for security reasons')
        return
      }
      
      setValue(file)
    }
  }, [setValue]) 

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false
  })

  return (
    <>
       {
        value && typeof value !== 'string' ? <>
                 <div className="w-full py-4 ">
                       <div className="relative h-[50vh]">
                        <img src={URL.createObjectURL(value)} alt=""  className='h-full w-full object-contain'/>
                                <button onClick={()=>setValue(null)} className='text-3xl p-3 absolute right-0 bg-btn text-white rounded-full top-0'>
                                        <MdClose/>
                                </button>
                       </div>
                      
                       
                 </div>
        </>
        :
         <div {...getRootProps()} className='w-full my-3 py-10 border-2 lg:border-4 border-dashed border-btn flex flex-col items-center rounded  text-sm lg:text-base'>
      <input {...getInputProps()} />
      {
        isDragActive ?
         <>
         <AiOutlineCloudUpload className='text-6xl text-btn' />
          <p>Drop the files here ...</p>
         </> :

          <>
         <AiOutlineCloudUpload className='text-6xl text-btn' />

            <p>Drag 'n' drop some files here, or click to select files</p>
          </>
      }
    </div>
       }
        </>
  )
}
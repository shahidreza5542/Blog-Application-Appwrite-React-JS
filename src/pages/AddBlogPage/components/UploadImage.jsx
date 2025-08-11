import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { AiOutlineCloudUpload } from "react-icons/ai";
import {MdClose} from 'react-icons/md'

export default function UploadImage({value,setValue}) {
  const onDrop = useCallback(acceptedFiles => {
    if(acceptedFiles.length>0){
        setValue(acceptedFiles[0])
    }
    // Do something with the files
  }, []) 


  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept:{ 
    'image/*': ["*"],
    },
    multiple:false
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
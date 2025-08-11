import React from 'react'
import { FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { appWriteDB, appWriteStorage } from '../../lib/appwrite'
import { ENVObj } from '../../lib/constant'
import { useMainContext } from '../../context/MainContext'

const DeleteBlogCard = ({data}) => {

      const {fetchAllBlog } = useMainContext()
  const deleteBlogHandler =()=>{
  Swal.fire({
    background:'#1d1d21',
    color:'white',
    icon:'question',
  title: "Do you want to Delete Blog?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "Delete",
  denyButtonText: `Don't Delete`
}).then(async(result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {

    try {
    await  appWriteStorage.deleteFile(ENVObj.VITE_APPWRITE_STORAGE_ID,data.image)

      await appWriteDB.deleteDocument(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,data.$id)
      await fetchAllBlog()

    } catch (error) {
       Swal.fire({
      icon:'error',
       title: 'Error!',
  text: error.message,
  confirmButtonText:'OK',
  timer:1000,
    background:'#1d1d21',
  color:'white'
    })
    return
    }

       

    Swal.fire({
      icon:'success',
       title: 'Deleted!',
  text: 'Blog Delete Successful',
  confirmButtonText:'OK',
  timer:1000,
    background:'#1d1d21',
  color:'white'
    })
    // Swal.fire("Deleted!", "", "success");
  } else if (result.isDenied) {
    Swal.fire("Blog Not Delete", "", "info");
  }
});
  }

  return (
    <>
          <button onClick={deleteBlogHandler} className='px-3 py-2 outline-none flex items-center justify-center cursor-pointer gap-x-2 mx-1 rounded bg-red-500'>
                            <span>Delete</span><FaTrash/>
                        </button>

    </>
  )
}

export default DeleteBlogCard
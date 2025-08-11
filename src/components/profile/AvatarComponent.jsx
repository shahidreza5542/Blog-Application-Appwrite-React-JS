import React, { useEffect, useRef, useState } from 'react'
import { CiCamera } from "react-icons/ci";
import { appwriteAccount, appWriteDB, appWriteStorage, checkExistProfile } from '../../lib/appwrite';
import { ENVObj } from '../../lib/constant';
import { ID } from 'appwrite';
import toast from 'react-hot-toast';
import { useMainContext } from '../../context/MainContext';
import { useSelector } from 'react-redux';
import { AuthSlicePath } from '../../redux/slices/Auth.slice';
import { useLocation } from 'react-router-dom';

const AvatarComponent = () => {

    const [image,setImage] = useState(null) 
    const authuser = useSelector(AuthSlicePath)
    const [profileImage,setProfileImage] = useState('')
    const iamgeRef = useRef()
    const {fetchUser} = useMainContext()
    const location = useLocation()


    const fetchImage=async()=>{
      try {
        // if(!authuser?.profile?.image) return 
        const fileDB = await appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID,authuser?.profile?.image)
        setProfileImage(fileDB)
        
      } catch (error) {
        // toast.error("")
      }
    }



    useEffect(()=>{
      fetchImage()
    },[location])


    const ImagePicker =()=>{
 
       if (iamgeRef.current) {
        iamgeRef.current.value =   null
      }
iamgeRef.current.click()

 

    }

    const uploadImage=async(e)=>{
      //upload image here 
try {
        if((e.target.files.length<0)){
        return 
      }
setImage(e.target.files[0])

const file = await appWriteStorage.createFile(ENVObj.VITE_APPWRITE_STORAGE_ID,ID.unique(),e.target.files[0])

const existUser =await checkExistProfile(authuser.$id)
if(existUser){
await appWriteDB.updateDocument(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,existUser.$id,{
  image:file.$id
})

        // const fileDB = await appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID,existUser.$id)
        // if(fileDB){
        //   await appwriteAccount.updatePrefs({
        //     avatarUrl: fileDB 
        //   })
        // }



}else{
await appWriteDB.createDocument(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,ID.unique(),{
  image:file.$id,
  user:authuser.$id
})
}


toast.success("Avatar Updated")



await fetchUser()

} catch (error) {
  toast.error(error.message)
}

    }

  return (
    <>
   
 <div className="flex items-center justify-center pt-10 pb-3">
    <div className="w-[250px] h-[250px] rounded-full border-2 border-white  p-2 relative">
           <img src={
            profileImage ? profileImage:
            image? URL.createObjectURL(image) :"/vite.svg"} alt="" className='w-full h-full rounded-full overflow-hidden hover:scale-110 transition-all duration-300' />
           <form action="">
          <input ref={iamgeRef}  onChange={uploadImage} type="file" accept='image/*' className='hidden' />


            <button onClick={ImagePicker} type='button' className='text-4xl absolute  right-2  bottom-5   bg-btn text-white rounded-full  p-1 xl:p-2   '>
<CiCamera className='' />
            </button>
           </form>
    </div>
 </div>
    </>
  )
}

export default AvatarComponent
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import { ImCross } from 'react-icons/im'
import CustomLoaderButton from '../CustomLoaderButton'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { AuthSlicePath } from '../../redux/slices/Auth.slice'
import { appwriteAccount, appWriteDB, checkExistProfile } from '../../lib/appwrite'
import { ENVObj } from '../../lib/constant'
import { ID } from 'appwrite'
import { useMainContext } from '../../context/MainContext'
const BasicInformation = () => {

    const authUser = useSelector(AuthSlicePath)
    const {fetchUser} = useMainContext()

    const initialValues = {
        name:authUser?.name ||'', 
        bio:authUser?.profile?.bio ||''
    }
    const validationSchema= yup.object({
        name:yup.string().required("Name is Required"),
        bio:yup.string().required("Bio is Required")
    })

    const onSUbmitHandler = async(values,helpers)=>{
        try {
           if(values.name !==authUser.name){
            //update name from auth profile
            await appwriteAccount.updateName(values.name)
           }

       const existUser =await checkExistProfile(authUser.$id)
       
        
        if(existUser){
      await appWriteDB.updateDocument(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,existUser.$id,{
        
        bio:values.bio,
        name:values.name
      
       })
       toast.success("Profile Updated !")

            return
        }
   

       await appWriteDB.createDocument(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,ID.unique(),{
        user:authUser.$id,
        bio:values.bio,
        image:''
       })

       toast.success("Profile Updated !")


        } catch (error) {
            toast.error(error.message)
        }finally{
           await fetchUser()
        }
    }

  return (
    <>
    <Formik
    onSubmit={onSUbmitHandler}
    validationSchema={validationSchema}
    initialValues={initialValues}
    >
        <Form className=' w-[96%] md:w-1/2 lg:w-1/3 py-3 px-3 mx-auto mt-16'>
            <div className="mb-3">
                <label htmlFor="name">Name</label>
                <Field type="text" name="name" className='w-full placeholder:font-psmbold py-2 bg-black/40 rounded px-2 outline-none focus:border-b focus:rounded-none border-btn transition-all duration-300' placeholder='Enter Your Name' id="name" />
                          <ErrorMessage name='name' render={(str)=><p className='text-red-500 flex items-center justify-start gap-x-2'> <ImCross/>  <span>{str}</span> </p>} />
              
            </div>


             <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input value={authUser.email}  readOnly disabled  className='w-full placeholder:font-psmbold py-2 bg-black/40 rounded px-2 outline-none focus:border-b focus:rounded-none border-btn transition-all duration-300' placeholder='Enter Your Email' id="email" /> 
              
            </div>

              <div className="mb-3">
                <label htmlFor="bio">Bio</label>
              <Field as="textarea" rows={2} type="text" name="bio" className='w-full placeholder:font-psmbold py-2 bg-black/40 rounded px-2 outline-none focus:border-b focus:rounded-none border-btn transition-all duration-300' placeholder='Enter Your Bio' id="bio" />
                          <ErrorMessage name='bio' render={(str)=><p className='text-red-500 flex items-center justify-start gap-x-2'> <ImCross/>  <span>{str}</span> </p>} />
              
            </div>
            <div className="mb-3">
                <CustomLoaderButton text={'Update Profile'}  />
            </div>
        </Form>
    </Formik>
    </>
  )
}

export default BasicInformation
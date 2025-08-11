import React, { useState } from 'react'
import Logo from '../components/Logo'
import CustomLoaderButton from '../components/CustomLoaderButton'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import {toast} from 'react-hot-toast'
import { Formik,Form,Field,ErrorMessage } from 'formik'
import { ImCross } from "react-icons/im";
import { appwriteAccount, appWriteDB } from '../lib/appwrite'
import { ID } from 'appwrite'
import { useDispatch } from 'react-redux'
import { removeUser, setUser } from '../redux/slices/Auth.slice'
import { useMainContext } from '../context/MainContext'
import { ENVObj } from '../lib/constant'
import { Helmet } from 'react-helmet'

const RegisterPage = () => {
  const [isHide,setisHide] = useState(true)
  const [loading,setLoading] = useState(false)
  const { fetchUser}  = useMainContext()
  const validationSchema = yup.object({
    name:yup.string().required("Name is Required"),
    email:yup.string().email("Email must be valid").required("EMail is Required"),
    password:yup.string().min(8,"password should be grater than 8 characters").required("Password is Required")
  })

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const initialValues={
    name:'',
    email:'',
    password:''
  }

  const onSubmitHandler = async(values,helpers)=>{
    try{
      setLoading(true)
      try {
        const old_user = await appwriteAccount.get()
        if(old_user){
          await appwriteAccount.deleteSession('current');
                          dispatch(removeUser())
          
        }
      } catch (error) {
        
      }
      
      //register new user
    const user=  await appwriteAccount.create(ID.unique(),values.email,values.password,values.name);

    // profile document 
    await appWriteDB.createDocument(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,ID.unique(),{
      bio:'',
      name:values.name,
      user:user.$id
    })

   
        //ye kaam karna hain
        await appwriteAccount.createEmailPasswordSession(values.email,values.password)
         
        await  fetchUser()
        
        toast.success("Register Success")

        navigate("/")


    }catch(e){
      if(e.type=="user_already_exists"){
        toast.error("User Alredy Exist")

      }else if(e.type=="general_rate_limit_exceeded"){
        toast.error("Something Wrong From Backend So kindly ruk jao bhai...😋")
      }
      
      else{

        toast.error(e.message)
      }
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
     <Helmet>
         <meta charSet="utf-8" />
                <title>Blogi | Regsiter Page</title>
                <link rel="canonical" href={window.location.href} /> 
      </Helmet>
      <section className="min-h-[60vh] flex items-center justify-center">
     
     <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmitHandler}
     >
       <Form action="" className=' w-[96%] sm:w-[90%] md:w-1/2 lg:w-1/3 my-5 mx-auto py-5 px-4 border border-btn rounded'>
            <Logo/>

          <div className="mb-3">
            <label htmlFor="name">Name <span className='text-red-500'>*</span></label>
            <Field id='name' name="name" type="text" className="w-full  py-1 lg:py-2  px-4 rounded border border-white placeholder:font-psmbold outline-none" placeholder='Enter Your Name' />
            <ErrorMessage name='name' render={(str)=><p className='text-red-500 flex items-center justify-start gap-x-2'> <ImCross/>  <span>{str}</span> </p>} />
          </div>

 <div className="mb-3">
            <label htmlFor="email">Email <span className='text-red-500'>*</span></label>
            <Field id='email' name='email' type="email" className="w-full  py-1 lg:py-2  px-4 rounded border border-white placeholder:font-psmbold outline-none" placeholder='Enter Your Email' />
            <ErrorMessage name='email' render={(str)=><p className='text-red-500 flex items-center justify-start gap-x-2'> <ImCross/>  <span>{str}</span> </p>} />

          </div>

          <div className="mb-3">
            <label htmlFor="password">Password <span className='text-red-500'>*</span></label>
           <div className="w-full flex items-center gap-x-2 rounded border border-white px-3">
             <Field id='password' name='password' type={isHide?"password":'text'} className="w-full  bg-transparent py-1 lg:py-2  px-2  placeholder:font-psmbold outline-none" placeholder='Enter Your Password' />
          
          <button type='button' onClick={()=>setisHide(!isHide)}>
            {
              isHide ?<FaEye className='text-2xl' />:
            <FaEyeSlash className='text-2xl' />
            }
          </button>

           </div>
            <ErrorMessage name='password' render={(str)=><p className='text-red-500 flex items-center justify-start gap-x-2'> <ImCross/>  <span>{str}</span> </p>} />

          </div>
          <div className="mb-3">
            <CustomLoaderButton isLoading={loading} className={''} text={'Register'} />
          </div>
          <div className="mb-3">
            <p className="text-end text-[#ffff]">
              Already Have An Account ? <Link to={'/login'} className='text-btn'>Login</Link>
            </p>
          </div>
      </Form>
      </Formik>

      </section>
      </>
  )
}

export default RegisterPage
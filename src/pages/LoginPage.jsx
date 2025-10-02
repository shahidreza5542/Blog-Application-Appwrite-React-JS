import React, { useState } from 'react'
import Logo from '../components/Logo'
import CustomLoaderButton from '../components/CustomLoaderButton'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import {toast} from 'react-hot-toast'
import { Formik,Form,Field,ErrorMessage } from 'formik'
import { ImCross } from "react-icons/im";
import { appwriteAccount } from '../lib/appwrite' 
import { useDispatch } from 'react-redux'
import { removeUser, setUser } from '../redux/slices/Auth.slice'
import { useMainContext } from '../context/MainContext'
import { Helmet } from 'react-helmet'

const LoginPage = () => {
  const [isHide,setisHide] = useState(true)
  const [loading,setLoading] = useState(false)
  const {fetchUser} = useMainContext()
  const validationSchema = yup.object({ 
    email:yup.string().email("Email must be valid").required("EMail is Required"),
    password:yup.string().min(8,"password should be grater than 8 characters").required("Password is Required")
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const initialValues={ 
    email:'',
    password:''
  }

  const onSubmitHandler = async(values, helpers) => {
    try {
      setLoading(true)
      
      console.log('Login attempt started...')
      console.log('Environment check:', {
        endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
        projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID
      })
      
      // Clear any existing sessions first
      try {
        const old_user = await appwriteAccount.get()
        if (old_user) {
          console.log('Clearing existing session...')
          await appwriteAccount.deleteSession('current')
          dispatch(removeUser())
        }
      } catch (error) {
        console.log('No existing session to clear')
      }
 
      // Create new session
      console.log('Creating new session...')
      const session = await appwriteAccount.createEmailPasswordSession(
        values.email, 
        values.password
      )
      console.log('Session created successfully:', session)
      
      // Fetch user data
      console.log('Fetching user data...')
      await fetchUser()
      
      // Navigate after successful login
      setTimeout(() => {
        navigate("/")
        toast.success("Login Success")
      }, 100)
      
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle specific error types
      if (error.type === "user_invalid_credentials") {
        toast.error("Invalid email or password")
      } else if (error.type === "general_rate_limit_exceeded") {
        toast.error("Too many attempts. Please try again later.")
      } else if (error.type === "general_unauthorized_scope") {
        toast.error("Authentication failed. Please check your credentials.")
      } else if (error.message?.includes('fetch')) {
        toast.error("Network error. Please check your internet connection and try again.")
      } else if (error.code === 401) {
        toast.error("Authentication failed. Please try again.")
      } else {
        toast.error(error.message || "Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Helmet>
         <meta charSet="utf-8" />
                <title>Blogi | Login Page</title>
                <link rel="canonical" href={window.location.href} /> 
      </Helmet>
      <section className="min-h-[60vh] flex items-center justify-center">
     
     <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmitHandler}
     >
       <Form action="" className='w-[96%] sm:w-[90%] md:w-1/2 lg:w-1/3 my-5 mx-auto py-5 px-4 border border-btn rounded'>
            <Logo/>

    

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
            <CustomLoaderButton isLoading={loading} className={''} text={'Login'} />
          </div>
          <div className="mb-3">
            <p className="text-end text-[#ffff]">
              Don't Have An Account ? <Link to={'/register'} className='text-btn'>Register</Link>
            </p>
          </div>
      </Form>
      </Formik>

      </section>
      </>
  )
}

export default LoginPage
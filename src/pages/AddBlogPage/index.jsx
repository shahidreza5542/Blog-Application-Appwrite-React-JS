import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import UploadImage from './components/UploadImage'
import MarkdownEditor from './components/MarkdownEditror'
import CustomLoaderButton from '../../components/CustomLoaderButton'
import { appWriteDB, appWriteStorage } from '../../lib/appwrite'
import { ENVObj, generateSlug } from '../../lib/constant'
import { ID } from 'appwrite'
import { useSelector } from 'react-redux'
import { AuthSlicePath } from './../../redux/slices/Auth.slice';
import { useMainContext } from '../../context/MainContext'

const AddBlogPage = () => {
  const [loading,setLoading] = useState(false)
  const authuser = useSelector(AuthSlicePath)
  const {fetchAllHomeBlogs} = useMainContext()

  const initialValues = {
    title:'',
    image:null,
    description:'',
    content:'',
    tags:''
  }
  const validationSchema = yup.object({
    title:yup.string().required("Title is Required"),
    image:yup.mixed().required("Image is Required"),
    description:yup.string().required("Description is Required"),
    content:yup.string().required("Content is Required"),
    tags:yup.string().required("Tags is Required")
  })

  const onSubmitHandler = async(values,helpers)=>{
    try {
      setLoading(true)
      
      console.log('AddBlog: Starting blog creation...')
      console.log('AuthUser:', authuser)
      console.log('Form values:', values)
      
      // Check if user is authenticated
      if (!authuser || !authuser.$id) {
        throw new Error('User not authenticated')
      }
      
      // file upload
      console.log('AddBlog: Uploading image...')
      const file = await appWriteStorage.createFile(ENVObj.VITE_APPWRITE_STORAGE_ID,ID.unique(),values.image)
      console.log('AddBlog: Image uploaded:', file)

      values['image'] = file.$id
      values['slug'] = generateSlug(values.title)
      values['created_at'] = new Date()
      values['updated_at'] = new Date()
      values['user'] = authuser.$id
      values['status'] = true // Add status field

      console.log('AddBlog: Creating document with values:', values)
      
      // Try creating the blog document with only required fields
      const blogData = {
        title: values.title,
        description: values.description,
        content: values.content,
        tags: values.tags,
        image: values.image,
        slug: values.slug,
        user: values.user,
        status: values.status
      }
      
      console.log('Final blog data to send:', blogData)
      
      await appWriteDB.createDocument(
        ENVObj.VITE_APPWRITE_DB_ID,
        ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
        ID.unique(),
        blogData
      )

      toast.success("Blog Added !")
      
      console.log('AddBlog: Refreshing blogs...')
      await fetchAllHomeBlogs()
      helpers.resetForm()

    } catch (error) {
      console.log('AddBlog error:', error)
      
      if (error.code === 401) {
        toast.error('Permission denied. Please check Appwrite collection permissions in console.')
      } else if (error.type === 'general_unauthorized_scope') {
        toast.error('Unauthorized access. Please check your Appwrite permissions.')
      } else {
        toast.error(error.message)
      }
    }finally{
      setLoading(false)
    }
  }
  return (
    <>
            <div className="my-10 flex items-center justify-center min-h-[60vh] mt-16">

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
              >
                {({values,setFieldValue})=>(
                  <Form className=' w-full xl:w-[80%] bg-section py-10 px-3 rounded shadow'>
                      <div className="mb-3">
                        <label htmlFor="title">Title </label>
                        <Field name="title" type="text" className='w-full py-2 bg-main rounded border-section border  outline-none px-4' placeholder='Enter Blog Title' id="title" />
                        <ErrorMessage component={'p'} className='text-red-500 ' name='title' />
                      </div>
                          <div className="mb-3">
                        <label htmlFor="description">Description </label>
                        <Field as="textarea" rows={3} name="description" type="text" className='w-full py-2 bg-main rounded border-section border  outline-none px-4' placeholder='Enter Blog Description' id="title" />
                        <ErrorMessage component={'p'} className='text-red-500 ' name='description' />
                      </div>
                              <div className="mb-3">
                        <label htmlFor="image">Image </label>
                          <UploadImage value={values.image} setValue={(image)=>setFieldValue('image',image)} />
                        <ErrorMessage component={'p'} className='text-red-500 ' name='image' />
                      </div>
                          <div className="mb-3">
                        <label htmlFor="tags">Tags </label> 
                        <Field    name="tags" type="text" className='w-full py-2 bg-main rounded border-section border  outline-none px-4' placeholder='Enter Blog Tags' id="tags" />

                        <ErrorMessage component={'p'} className='text-red-500 ' name='tags' />
                      </div>

                         <div className="mb-3">
                        <label htmlFor="content">Content </label> 
                        <MarkdownEditor value={values.content} setValue={(value)=>setFieldValue('content',value)} />

                        <ErrorMessage component={'p'} className='text-red-500 ' name='content' />
                      </div>
                      <div className="mb-3">
                        <CustomLoaderButton text={'Add Blog'} isLoading={loading} />
                      </div>
                </Form>
                )}
              </Formik>
            </div>
    </>
  )
}

export default AddBlogPage
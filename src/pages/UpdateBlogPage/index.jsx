import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
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
import BackButton from '../../components/BackButton'
import { useParams } from 'react-router-dom'

const UpdateBlogPage = () => {
  const [loading,setLoading] = useState(false)
  const [Loder,setLoder] = useState(true)
  const authuser = useSelector(AuthSlicePath)
  const [blog,setBlog] = useState({})

  const params= useParams()
  const fetchBlogData =async(id)=>{
    try {
      setLoder(true)
      const data  = await appWriteDB.getDocument(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,id)
      setBlog(data);
      
    } catch (error) {
      toast.error(error.message)
    }finally{
      setLoder(false)
    }
  }

  useEffect(()=>{
    if(params.id){
      fetchBlogData(params.id)
    }
  },[params])

  if(Loder){
    return <div>loading...</div>
  }
  const previewIamge = appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID,blog.image)

  const initialValues = {
    title:blog.title||'',
    image:null,
    description:blog.description || '',
    content:blog.content||'',
    tags:blog.tags||'',
    status:blog.status ||false
  }
  const validationSchema = yup.object({
    title:yup.string().required("Title is Required"),
    // image:yup.mixed().required("Image is Required"),
    description:yup.string().required("Description is Required"),
    content:yup.string().required("Content is Required"),
    tags:yup.string().required("Tags is Required")
  })

  const onSubmitHandler = async(values,helpers)=>{
    try {
      setLoading(true)
      // file update
      if(values.image){
 
        await appWriteStorage.deleteFile(ENVObj.VITE_APPWRITE_STORAGE_ID,blog.image)

        const file =   await appWriteStorage.createFile(ENVObj.VITE_APPWRITE_STORAGE_ID,ID.unique(),values.image)
        values['image'] = file.$id
      }else{
        delete values['image']
      }


    values['slug'] = generateSlug(values.title) 
    values['updated_at'] = new Date()
    values['user'] = authuser.$id

     await appWriteDB.updateDocument(ENVObj.VITE_APPWRITE_DB_ID,ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,blog.$id,values)

 



 
   toast.success("Blog Update !")
  
 await fetchBlogData(params.id)

 
    } catch (error) {
      toast.error(error.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
            <div className="my-10 flex  flex-col items-center justify-center min-h-[60vh] mt-16">
               
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
              >
                {({values,setFieldValue})=>(
                  <Form className=' w-full xl:w-[80%] bg-section py-10 px-3 rounded shadow'>
                     <div className="w-full pb-4">
                    <BackButton/>
                </div>
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                              <div className="col-span-1"><UploadImage value={values.image} setValue={(image)=>setFieldValue('image',image)} /></div>

                              <div className="col-span-1 lg:px-10">
                                <img src={previewIamge} alt={blog.title} />
                              </div>
                        </div>
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
                        <label htmlFor="status" className='flex items-center gap-x-3'>
                            <Field type="checkbox" name="status" className="w-5 h-5 caret-btn accent-btn " /> <span>Status</span>
                        </label>
                      </div>



                      <div className="mb-3">
                        <CustomLoaderButton text={'Update Blog'} isLoading={loading} />
                      </div>
                </Form>
                )}
              </Formik>
            </div>
    </>
  )
}

export default UpdateBlogPage
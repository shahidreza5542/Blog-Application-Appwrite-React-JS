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
import { AuthSlicePath } from './../../redux/slices/Auth.slice'
import { useMainContext } from '../../context/MainContext'
import { RiAiGenerate } from "react-icons/ri"
import OpenAI from 'openai'

const AddBlogPage = () => {
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const authuser = useSelector(AuthSlicePath)
  const { fetchAllHomeBlogs } = useMainContext()
  const [title, setTitle] = useState('')

  const initialValues = {
    title: '',
    image: null,
    description: '',
    content: '',
    tags: ''
  }

  const validationSchema = yup.object({
    title: yup.string().required("Title is Required"),
    image: yup.mixed().required("Image is Required"),
    description: yup.string().required("Description is Required"),
    content: yup.string().required("Content is Required"),
    tags: yup.string().required("Tags is Required")
  })

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true)
      if (!authuser || !authuser.$id) throw new Error('User not authenticated')

      const file = await appWriteStorage.createFile(ENVObj.VITE_APPWRITE_STORAGE_ID, ID.unique(), values.image)
      values.image = file.$id
      values.slug = generateSlug(values.title)
      values.created_at = new Date()
      values.updated_at = new Date()
      values.user = authuser.$id
      values.status = true

      await appWriteDB.createDocument(
        ENVObj.VITE_APPWRITE_DB_ID,
        ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
        ID.unique(),
        {
          title: values.title,
          description: values.description,
          content: values.content,
          tags: values.tags,
          image: values.image,
          slug: values.slug,
          user: values.user,
          status: values.status
        }
      )

      toast.success("Blog Added!")
      await fetchAllHomeBlogs()
      helpers.resetForm()
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const openAIRequest = async (prompt) => {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
      dangerouslyAllowBrowser: true
    })

    try {
      const completion = await openai.chat.completions.create({
        model: "alibaba/tongyi-deepresearch-30b-a3b:free",
        messages: [{ role: "user", content: prompt }]
      })
      return completion.choices[0].message.content
    } catch {
      toast.error("AI request failed!")
      return ""
    }
  }

  const handleAIGenerateAll = async (setFieldValue, values) => {
    if (!values.title?.trim()) {
      toast.error("Empty title")
      return
    }

    setAiLoading(true)

    const aiContent = await openAIRequest(
      `Write a high-quality, SEO-friendly, human-like article in Markdown format based on the title:\n"${values.title.trim()}"\nInclude headings, subheadings, bullet points, and natural flow. Do NOT wrap in code blocks.`
    )
    setFieldValue('content', values.content ? values.content + "\n\n" + aiContent : aiContent)

    const aiDescription = await openAIRequest(
      `Write a concise, SEO-friendly description for a blog titled:\n"${values.title.trim()}"\nPlain text only.`
    )
    setFieldValue('description', aiDescription)
    toast.success("AI generated content and description!")

    setAiLoading(false)
  }

  return (
    <div className="my-10 flex items-center justify-center min-h-[60vh] mt-16">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        {({ values, setFieldValue }) => (
          <Form className='w-full xl:w-[80%] bg-section py-10 px-3 rounded shadow'>
            <div className="mb-3">
              <label htmlFor="title">Title</label>
              <Field
                name="title"
                type="text"
                className='w-full py-2 bg-main rounded border-section border outline-none px-4'
                placeholder='Enter Blog Title'
                value={values.title}
                onChange={(e) => {
                  setFieldValue('title', e.target.value)
                  setTitle(e.target.value)
                }}
              />
              <ErrorMessage component={'p'} className='text-red-500' name='title' />
            </div>

            <div className="mb-3">
              <div className='flex justify-between items-center'>
                <label htmlFor="description">Description & Content AI</label>
                <button
                  type='button'
                  disabled={aiLoading}
                  onClick={() => handleAIGenerateAll(setFieldValue, values)}
                >
                  <RiAiGenerate className={`text-2xl ${aiLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <Field
                as="textarea"
                rows={3}
                name="description"
                className='w-full py-2 bg-main rounded border-section border outline-none px-4'
                placeholder='Enter Blog Description'
              />
              <ErrorMessage component={'p'} className='text-red-500' name='description' />
            </div>

            <div className="mb-3">
              <label htmlFor="image">Image</label>
              <UploadImage value={values.image} setValue={(image) => setFieldValue('image', image)} />
              <ErrorMessage component={'p'} className='text-red-500' name='image' />
            </div>

            <div className="mb-3">
              <label htmlFor="tags">Tags</label>
              <Field
                name="tags"
                type="text"
                className='w-full py-2 bg-main rounded border-section border outline-none px-4'
                placeholder='Enter Blog Tags'
              />
              <ErrorMessage component={'p'} className='text-red-500' name='tags' />
            </div>

            <div className="mb-3">
              <label htmlFor="content">Content</label>
              <MarkdownEditor
                value={values.content}
                setValue={(value) => setFieldValue('content', value)}
              />
              <ErrorMessage component={'p'} className='text-red-500' name='content' />
            </div>

            <div className="mb-3">
              <CustomLoaderButton text={'Add Blog'} isLoading={loading} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddBlogPage

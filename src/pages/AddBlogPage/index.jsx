import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import toast, { LoaderIcon } from 'react-hot-toast'
import { IoReloadOutline } from "react-icons/io5";
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
import { TbLoader } from "react-icons/tb";

const AddBlogPage = () => {
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const authuser = useSelector(AuthSlicePath)
  const { fetchAllHomeBlogs } = useMainContext()
  const [title, setTitle] = useState('')

  // Form initial values
  const initialValues = {
    title: '',
    image: null,
    description: '',
    content: '',
    tags: ''
  }

  // Form validation schema
  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    image: yup.mixed().required("Image is required"),
    description: yup.string().required("Description is required"),
    content: yup.string().required("Content is required"),
    tags: yup.string().required("Tags are required")
  })

  // Form submit handler
  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true)
      if (!authuser || !authuser.$id) throw new Error('User not authenticated')

      // Upload image to Appwrite storage
      const file = await appWriteStorage.createFile(
        ENVObj.VITE_APPWRITE_STORAGE_ID,
        ID.unique(),
        values.image
      )
      values.image = file.$id
      values.slug = generateSlug(values.title)
      values.created_at = new Date()
      values.updated_at = new Date()
      values.user = authuser.$id
      values.status = true

      // Save blog to Appwrite DB
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

      toast.success("Blog Added Successfully!")
      await fetchAllHomeBlogs()
      helpers.resetForm()
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  // OpenAI request function
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
    } catch (error) {
      console.error(error)
      toast.error("AI request failed!")
      return ""
    }
  }

  // AI generate description and content
  const handleAIGenerateAll = async (setFieldValue, values) => {
    if (!values.title?.trim()) {
      toast.error("Please enter a title first")
      return
    }

    setAiLoading(true)

    // Updated AI prompt for SEO-friendly, human-like, long content
    const contentPrompt = `
Write a detailed, high-quality, human-like, and SEO-friendly blog article based on this title:
"${values.title.trim()}"

Requirements:
- Minimum 6000 characters
- Use natural, readable flow like a human writer
- Include headings (H1, H2), subheadings, bullet points, numbered lists
- Include examples, tips, and practical insights
- Avoid wrapping content in code blocks
- Make content AdSense-friendly and original
`

    const descriptionPrompt = `
Write a concise, SEO-friendly, human-readable description for a blog titled:
"${values.title.trim()}"
- Keep it engaging and natural
- Plain text only
`

    const aiContent = await openAIRequest(contentPrompt)
    setFieldValue('content', values.content ? values.content + "\n\n" + aiContent : aiContent)

    const aiDescription = await openAIRequest(descriptionPrompt)
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

            {/* Title Input */}
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
              <ErrorMessage component='p' className='text-red-500' name='title' />
            </div>

            {/* Description Input with AI button */}
            <div className="mb-3">
              <div className='flex justify-between items-center'>
                <label htmlFor="description">Description & Content AI</label>
                <button
                  type='button'
                  disabled={aiLoading}
                  onClick={() => handleAIGenerateAll(setFieldValue, values)}
                >
                  {!aiLoading ?
                    <RiAiGenerate className='text-2xl' /> :
                    <TbLoader className='text-2xl animate-spin' />
                  }
                </button>
              </div>
              <Field
                as="textarea"
                rows={3}
                name="description"
                className='w-full py-2 bg-main rounded border-section border outline-none px-4'
                placeholder='Enter Blog Description'
              />
              <ErrorMessage component='p' className='text-red-500' name='description' />
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label htmlFor="image">Image</label>
              <UploadImage
                value={values.image}
                setValue={(image) => setFieldValue('image', image)}
              />
              <ErrorMessage component='p' className='text-red-500' name='image' />
            </div>

            {/* Tags Input */}
            <div className="mb-3">
              <label htmlFor="tags">Tags</label>
              <Field
                name="tags"
                type="text"
                className='w-full py-2 bg-main rounded border-section border outline-none px-4'
                placeholder='Enter Blog Tags'
              />
              <ErrorMessage component='p' className='text-red-500' name='tags' />
            </div>

            {/* Content Editor */}
            <div className="mb-3">
              <label htmlFor="content">Content</label>
              <MarkdownEditor
                value={values.content}
                setValue={(value) => setFieldValue('content', value)}
              />
              <ErrorMessage component='p' className='text-red-500' name='content' />
            </div>

            {/* Submit Button */}
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

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import Error404 from '../../components/Error404'
import LoaderComponent from '../../components/LoaderComponent'
import { appWriteDB, appWriteStorage } from '../../lib/appwrite'
import { ENVObj } from '../../lib/constant'
import { Query } from 'appwrite'
import MdPreviewComponent from './MdPreviewComponent'
import moment from 'moment'
import CommentSection from './CommentSection'
import { Helmet } from "react-helmet-async"

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
]

const SingleBlogPage = () => {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blog, setBlog] = useState(null)
  const [translatedContent, setTranslatedContent] = useState('')
  const [selectedLang, setSelectedLang] = useState('')

  const fetchBlog = async () => {
    try {
      const blog = await appWriteDB.listDocuments(
        ENVObj.VITE_APPWRITE_DB_ID, 
        ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID, 
        [Query.equal("slug", params.slug), Query.equal("status", true)]
      )
      if (!blog.documents || blog.documents.length === 0) {
        setError(true)
        return
      }
      const blogData = blog.documents[0]

      try {
        const { documents } = await appWriteDB.listDocuments(
          ENVObj.VITE_APPWRITE_DB_ID, 
          ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID, 
          [Query.equal('user', blogData.user)]
        )
        blogData['userProfile'] = documents.length > 0 ? documents[0] : null
      } catch {
        blogData['userProfile'] = null
      }

      setBlog(blogData)
      document.title = blogData.title || 'Blog Post'
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.slug) fetchBlog()
  }, [params])

  // 🔹 Translate full page content (description + blog content)
  const handleTranslate = async (langCode) => {
    if (!blog) return

    setSelectedLang(langCode)

    try {
      const textToTranslate = `${blog.description}\n\n${blog.content}` // full content
      const encodedText = encodeURIComponent(textToTranslate)
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodedText}`
      )
      const data = await res.json()
      if (data?.[0]) {
        const translatedText = data[0].map(item => item[0]).join(' ')
        setTranslatedContent(translatedText)
        toast.success(`Page translated to ${languages.find(l => l.code === langCode)?.label}`)
      }
    } catch (err) {
      console.error(err)
      toast.error('Translation failed!')
    }
  }

  if (loading) return <LoaderComponent />
  if (error || !blog) return <Error404 />

  const image = blog?.image ? appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID, blog.image) : null
  const profileimage = blog.userProfile?.image ? appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID, blog.userProfile.image) : null
  const tags = blog?.tags ? blog.tags.split(",") : []
  const userName = blog.userProfile?.name || "Anonymous User"

  return (
    <section className='py-10 w-full mt-16'>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{blog?.title || 'Blog Post'}</title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content={blog?.description || 'Blog post content'} />
      </Helmet>

      {image && (
        <div className="w-full lg:h-[450px] mb-3 flex justify-center items-center rounded-2xl">
          <img src={image} alt={blog?.title || 'Blog image'} className='w-[95%] h-full object-cover object-top rounded-2xl' />
        </div>
      )}

      <div className="w-[96%] lg:w-[80%] mx-auto">
        {/* Title + Translate Dropdown */}
        <div className="mb-3 py-5 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
          <h1 className="text-start font-pblack text-3xl">{blog?.title || 'Untitled Post'}</h1>
          <select
            className="bg-btn hover:bg-btn-hover text-white px-4 py-2 rounded-md"
            value={selectedLang}
            onChange={(e) => handleTranslate(e.target.value)}
          >
            <option value="" disabled>Translate Page</option>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        {/* Author Info */}
        <div className="flex items-center px-4 py-2 mt-5">
          {profileimage && <img alt={userName} src={profileimage} className="relative inline-block h-8 w-8 rounded-full" />}
          <div className="flex flex-col ml-3 text-sm">
            <span className="text-text font-semibold">{userName}</span>
            <span className="text-p">
              {blog?.$createdAt ? moment(new Date(blog.$createdAt)).format("LL") : 'Unknown date'}
            </span>
          </div>
        </div>

        {/* Description + Blog Content */}
        <div className="mb-3 w-full">
          <MdPreviewComponent data={translatedContent || `${blog?.description}\n\n${blog?.content}`} />
        </div>

        {/* Tags */}
        <ul className="flex items-center gap-x-3 gap-y-3 flex-wrap">
          {tags && tags.length > 0 && tags.map((cur, i) => (
            <li key={i} className='px-3 py-1 rounded-full bg-section hover:bg-main shadow-2xl cursor-pointer text-lg lg:text-xl'>
              #{cur.trim()}
            </li>
          ))}
        </ul>

        {/* Comments */}
        <div className="py-10">
          <CommentSection id={blog?.$id} />
        </div>
      </div>
    </section>
  )
}

export default SingleBlogPage

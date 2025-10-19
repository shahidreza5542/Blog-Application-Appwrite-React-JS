// ✅ SingleBlogPage.js (Fixed, SEO + Appwrite Guest Compatible)
import React, { useEffect, useState } from 'react'
import toast, { LoaderIcon } from 'react-hot-toast'
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
import OpenAI from 'openai'
import { FaLanguage, FaFileAlt } from 'react-icons/fa'

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
  const [summarizeModal, setSummarizeModal] = useState(false)
  const [summaryText, setSummaryText] = useState('')
  const [summarizing, setSummarizing] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // ✅ Safe fetch with guest permission handling
  const fetchBlog = async () => {
    try {
      setLoading(true)
      setError(false)

      console.log("Fetching blog for slug:", params.slug)

      const res = await appWriteDB.listDocuments(
        ENVObj.VITE_APPWRITE_DB_ID,
        ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
        [Query.equal("slug", params.slug), Query.equal("status", true)]
      )

      if (!res || !res.documents || res.documents.length === 0) {
        console.warn("No blog found for slug:", params.slug)
        setError(true)
        return
      }

      const blogData = res.documents[0]

      try {
        const userRes = await appWriteDB.listDocuments(
          ENVObj.VITE_APPWRITE_DB_ID,
          ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,
          [Query.equal('user', blogData.user)]
        )
        blogData['userProfile'] = userRes.documents.length > 0 ? userRes.documents[0] : null
      } catch (e) {
        console.warn("User profile fetch failed:", e)
        blogData['userProfile'] = null
      }

      setBlog(blogData)
      document.title = blogData.title || 'Blog Post'
    } catch (err) {
      console.error("Fetch blog failed:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!params?.slug) return
    fetchBlog()
  }, [params?.slug])

  // ✅ Translation Function
  const handleTranslate = async (langCode) => {
    if (!blog) return
    setSelectedLang(langCode)
    setDropdownOpen(false)
    try {
      const textToTranslate = `${blog.description}\n\n${blog.content}`
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
      console.error("Translation error:", err)
      toast.error('Translation failed!')
    }
  }

  // ✅ Summarization Function
  const handleSummarize = async () => {
    if (!blog) return
    setSummarizing(true)
    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
        dangerouslyAllowBrowser: true,
      })

      const completion = await openai.chat.completions.create({
        model: "alibaba/tongyi-deepresearch-30b-a3b:free",
        messages: [
          {
            role: "user",
            content: `Summarize the following blog content in 3-4 sentences:\n\n${blog.description}\n\n${blog.content}`
          }
        ],
      })

      setSummaryText(completion.choices[0].message.content)
      setSummarizeModal(true)
    } catch (err) {
      console.error("Summarization error:", err)
      toast.error('Summarization failed!')
    } finally {
      setSummarizing(false)
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
      {/* ✅ SEO and Structured Data */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>{blog?.title || 'Blog Post'}</title>
        <link rel="canonical" href={`https://devhive.qzz.io/blog/${params.slug}`} />
        <meta name="description" content={blog?.description || 'Blog post content'} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog?.title,
            description: blog?.description,
            author: userName,
            datePublished: moment(new Date(blog.$createdAt)).format("YYYY-MM-DD"),
            image: image || '',
            url: `https://devhive.qzz.io/blog/${params.slug}`,
          })}
        </script>
      </Helmet>

      {image && (
        <div className="w-full lg:h-[450px] mb-3 flex justify-center items-center rounded-2xl">
          <img
            src={image}
            alt={blog?.title || 'Blog image'}
            className="w-[95%] h-full object-cover object-top rounded-2xl"
          />
        </div>
      )}

      <div className="w-[96%] lg:w-[80%] mx-auto">
        {/* Title + Translate + Summarize */}
        <div className="mb-3 py-5 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
          <h1 className="text-start font-pblack text-3xl text-[var(--color-text)]">
            {blog?.title || 'Untitled Post'}
          </h1>
          <div className="flex gap-2 relative">
            {/* Translate icon */}
            <button
              className="bg-[var(--color-section)] hover:bg-green-700 text-[var(--color-text)] p-3 rounded-md flex items-center justify-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaLanguage className="w-5 h-5" />
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 top-full mt-2 w-32 bg-[var(--color-section)] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
                {languages.map(lang => (
                  <li
                    key={lang.code}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleTranslate(lang.code)}
                  >
                    {lang.label}
                  </li>
                ))}
              </ul>
            )}

            {/* Summarize icon */}
            <button
              onClick={handleSummarize}
              className="bg-[var(--color-section)] hover:bg-green-700 text-[var(--color-text)] p-3 rounded-md flex items-center justify-center"
              disabled={summarizing}
            >
              {!summarizing ? (
                <FaFileAlt className="w-5 h-5" />
              ) : (
                <LoaderIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center px-4 py-2 mt-5">
          {profileimage && (
            <img
              alt={userName}
              src={profileimage}
              className="relative inline-block h-8 w-8 rounded-full"
            />
          )}
          <div className="flex flex-col ml-3 text-sm">
            <span className="text-[var(--color-text)] font-semibold">{userName}</span>
            <span className="text-p text-[var(--color-text)]">
              {blog?.$createdAt ? moment(new Date(blog.$createdAt)).format("LL") : 'Unknown date'}
            </span>
          </div>
        </div>

        {/* Description + Blog Content */}
        <div className="mb-3 w-full text-[var(--color-text)]">
          <MdPreviewComponent data={translatedContent || `${blog?.description}\n\n${blog?.content}`} />
        </div>

        {/* Tags */}
        <ul className="flex items-center gap-x-3 gap-y-3 flex-wrap">
          {tags && tags.length > 0 && tags.map((cur, i) => (
            <li
              key={i}
              className="px-3 py-1 rounded-full bg-[var(--color-section)] hover:bg-main shadow-2xl cursor-pointer text-lg lg:text-xl text-[var(--color-text)]"
            >
              #{cur.trim()}
            </li>
          ))}
        </ul>

        {/* Comments */}
        <div className="py-10">
          <CommentSection id={blog?.$id} />
        </div>
      </div>

      {/* Summarize Modal */}
      {summarizeModal && (
        <div className="mt-16 fixed inset-0 flex justify-center items-center z-50 p-4 overflow-x-auto">
          <div className="bg-[var(--color-section)] p-6 rounded-xl max-w-lg w-full relative shadow-xl max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-xl font-bold text-[var(--color-text)]"
              onClick={() => setSummarizeModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-text)]">Blog Summary</h2>
            <p className="text-[var(--color-text)] whitespace-pre-wrap">{summaryText}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default SingleBlogPage

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
import { Helmet } from "react-helmet-async";
const SingleBlogPage = () => {

  const params = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blog, setBlog] = useState(null)


  const fetchBlog = async () => {
    try {
      // setLoading(true)

      const blog = await appWriteDB.listDocuments(ENVObj.VITE_APPWRITE_DB_ID, ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID, [
        Query.equal("slug", params.slug),
        Query.equal("status", true)
      ])
      // Check if blog exists
      if (!blog.documents || blog.documents.length === 0) {
        console.log('Blog not found')
        setError(true)
        return
      }

      const blogData = blog.documents[0]

      // Get user profile for additional info
      try {
        const { documents } = await appWriteDB.listDocuments(ENVObj.VITE_APPWRITE_DB_ID, ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID, [
          Query.equal('user', blogData.user)
        ])
        if (documents.length > 0) {
          blogData['userProfile'] = documents[0]
        } else {
          blogData['userProfile'] = null
        }
      } catch (profileError) {
        console.log('Profile fetch failed:', profileError)
        blogData['userProfile'] = null
      }

      setBlog(blogData)
      document.title = blogData.title || 'Blog Post'



    } catch (error) {
      console.log('SingleBlogPage fetch error:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (params.slug) {

      fetchBlog()
    }
  }, [params])

  if (loading) {
    return <LoaderComponent />
  }
  if (error || !blog) {
    return <Error404 />
  }

  // Ensure blog object exists before accessing properties
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
      <div className=" w-[96%] lg:w-[80%] mx-auto">
        <div className="mb-3 py-10">
          <h1 className="text-start font-pblack text-3xl">{blog?.title || 'Untitled Post'}</h1>


          <div className="flex items-center px-4 py-2  mt-5 ">
            {profileimage && <img alt={userName} src={profileimage} className="relative inline-block h-8 w-8 rounded-full" />}
            <div className="flex flex-col ml-3 text-sm">
              <span className="text-text font-semibold">{userName}</span>
              <span className="text-p">
                {blog?.$createdAt ? moment(new Date(blog.$createdAt)).format("LL") : 'Unknown date'}

              </span>
            </div>
          </div>


        </div>

        <div className="mb-3">
          <p className="text-lg font-pmdium">{blog?.description || 'No description available'}</p>
        </div>

        <div className="mb-3  w-full">
          <MdPreviewComponent data={blog?.content || 'No content available'} />
        </div>


        <ul className="flex items-center gap-x-3 gap-y-3 flex-wrap">
          {
            tags && tags.length > 0 && tags.map((cur, i) => {
              return <li key={i} className='px-3 py-1 rounded-full bg-section hover:bg-main shadow-2xl cursor-pointer text-lg lg:text-xl'> #{cur.trim()}</li>
            })
          }
        </ul>



        <div className="py-10">
          <CommentSection id={blog?.$id} />
        </div>
      </div>
    </section>
  )
}

export default SingleBlogPage
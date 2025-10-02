import React, { useEffect, useState, useMemo, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'
import Error404 from '../../components/Error404'
import LoaderComponent from '../../components/LoaderComponent'
import { appWriteDB, appWriteStorage } from '../../lib/appwrite'
import { ENVObj } from '../../lib/constant'
import { Query } from 'appwrite'
import MdPreviewComponent from './MdPreviewComponent'
import moment from 'moment'
import CommentSection from './CommentSection'
import { Helmet } from "react-helmet"

const SingleBlogPage = () => {
    const params = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [blog, setBlog] = useState(null)
    const [imageError, setImageError] = useState(false)

    // Optimized fetch function with better error handling
    const fetchBlog = useCallback(async () => {
        if (!params.slug) {
            setError(true)
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(false)

            // Fetch blog with optimized query
            const blogResponse = await appWriteDB.listDocuments(
                ENVObj.VITE_APPWRITE_DB_ID,
                ENVObj.VITE_APPWRITE_BLOG_COLLECTION_ID,
                [
                    Query.equal("slug", params.slug),
                    Query.equal("status", true),
                    Query.limit(1)
                ]
            )

            if (!blogResponse.documents || blogResponse.documents.length === 0) {
                setError(true)
                return
            }

            const blogData = blogResponse.documents[0]

            // Try to get user profile but don't fail if it doesn't work
            try {
                const { documents } = await appWriteDB.listDocuments(
                    ENVObj.VITE_APPWRITE_DB_ID,
                    ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,
                    [
                        Query.equal('user', blogData.user),
                        Query.limit(1)
                    ]
                )
                blogData['userProfile'] = documents.length > 0 ? documents[0] : null
            } catch (profileError) {
                console.warn('Profile fetch failed:', profileError)
                blogData['userProfile'] = null
            }

            setBlog(blogData)
            document.title = blogData.title || 'Blog Post'

        } catch (error) {
            console.error('SingleBlogPage fetch error:', error)
            setError(true)
            
            // Handle different error types
            if (error.code === 401) {
                console.log('Permission denied for blog access')
            } else if (error.code === 404) {
                console.log('Blog not found')
            } else {
                toast.error('Failed to load blog post')
            }
        } finally {
            setLoading(false)
        }
    }, [params.slug])

    useEffect(() => {
        fetchBlog()
    }, [fetchBlog])

    // Memoized computed values for performance
    const { image, profileImage, tags, userName, formattedDate } = useMemo(() => {
        if (!blog) return {}
        
        const image = blog.image 
            ? appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID, blog.image)
            : 'https://via.placeholder.com/1200x600/1f2937/9ca3af?text=No+Image'
        
        const profileImage = blog.userProfile?.image 
            ? appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID, blog.userProfile.image) 
            : null
        
        const tags = blog.tags?.split(",").filter(tag => tag.trim()) || []
        const userName = blog.userProfile?.name || "Anonymous User"
        const formattedDate = blog.$createdAt ? moment(blog.$createdAt).format("MMMM DD, YYYY") : ""
        
        return { image, profileImage, tags, userName, formattedDate }
    }, [blog])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoaderComponent />
            </div>
        )
    }

    if (error || !blog) {
        return <Error404 />
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{blog.title}</title>
                <link rel="canonical" href={window.location.href} />
                <meta name="description" content={blog.description} />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={blog.description} />
                <meta property="og:image" content={image} />
                <meta property="og:type" content="article" />
            </Helmet>

            <article className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Hero Image Section */}
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                    <img 
                        src={image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                        onError={(e) => {
                            if (!imageError) {
                                e.target.onerror = null
                                e.target.src = 'https://via.placeholder.com/1200x600/1f2937/9ca3af?text=Image+Not+Found'
                                setImageError(true)
                            }
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all duration-300 group"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Content Container */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                    {/* Article Header */}
                    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border border-gray-700/50">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center space-x-4 mb-6">
                            {profileImage ? (
                                <img 
                                    src={profileImage}
                                    alt={userName}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-500/50"
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.style.display = 'none'
                                    }}
                                />
                            ) : (
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            
                            <div>
                                <p className="text-lg font-semibold text-white">{userName}</p>
                                <p className="text-sm text-gray-400">{formattedDate}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6">
                            {blog.description}
                        </p>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {tags.map((tag, i) => (
                                    <span 
                                        key={i}
                                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200"
                                    >
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Article Content */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border border-gray-700/30">
                        <div className="prose prose-lg sm:prose-xl prose-invert max-w-none">
                            <MdPreviewComponent data={blog.content} />
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/30">
                        <CommentSection id={blog.$id} />
                    </div>
                </div>

                {/* Bottom Spacing */}
                <div className="h-20"></div>
            </article>
        </>
    )
}

export default SingleBlogPage
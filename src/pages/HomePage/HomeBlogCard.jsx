import React, { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { appWriteStorage } from '../../lib/appwrite'
import { ENVObj } from '../../lib/constant'
import moment from 'moment'

const HomeBlogCard = memo(({ data }) => {
  const { image, tags, formattedDate, truncatedDescription, userInitial } = useMemo(() => {
    const image = data?.image 
      ? appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID, data.image)
      : 'https://via.placeholder.com/800x450/1f2937/9ca3af?text=No+Image'
    
    const tags = data?.tags?.split(",").filter(tag => tag.trim()).slice(0, 3) || []
    
    const formattedDate = data?.$createdAt 
      ? moment(data.$createdAt).fromNow()
      : 'Unknown date'
    
    const truncatedDescription = data?.description 
      ? data.description.length > 120 
        ? data.description.substring(0, 120) + '...'
        : data.description
      : 'No description available'
    
    const userInitial = data?.user ? data.user.charAt(0).toUpperCase() : 'A'
    
    return { image, tags, formattedDate, truncatedDescription, userInitial }
  }, [data])

  return (
    <Link 
      to={`/blog/${data.slug}`} 
      className="group block w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <article className="relative h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300">
        
        {/* Image */}
        <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
          <img 
            src={image}
            alt={data.title || 'Blog post'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://via.placeholder.com/800x450/1f2937/9ca3af?text=Image+Not+Found'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-[10px] sm:text-xs font-medium bg-green-500/90 text-white rounded-full backdrop-blur-sm">
              Published
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-5">
          
          {/* Title */}
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors duration-300">
            {data.title || 'Untitled Post'}
          </h3>
          
          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-1">
            {truncatedDescription}
          </p>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {tags.map((tag, i) => (
                <span 
                  key={i}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs md:text-sm font-medium bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 hover:bg-indigo-500/30 hover:text-white transition-colors duration-200"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-700/50">
            
            {/* User */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                {userInitial}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-medium text-gray-200">
                  Anonymous User
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {formattedDate}
                </span>
              </div>
            </div>
            
            {/* Read More */}
            <div className="flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
              <span className="text-xs sm:text-sm font-medium mr-1">Read</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

          </div>
        </div>
      </article>
    </Link>
  )
})

export default HomeBlogCard

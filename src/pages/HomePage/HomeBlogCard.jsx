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
    
  }, [data])

  return (
    <Link 
      to={`/blog/${data.slug}`} 
      className="group block w-full h-full transform transition-all duration-200 hover:scale-[1.01] hover:shadow-xl"
    >
      <article className="relative h-full flex flex-col bg-section rounded-xl overflow-hidden border border-btn/20 hover:border-btn/60 transition-all duration-200 shadow-lg">
        
        {/* Image Container */}
        <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden">
          <img 
            src={image}
            alt={data.title || 'Blog post'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `https://via.placeholder.com/800x450/${encodeURIComponent('1d1d21')}/${encodeURIComponent('fd366e')}?text=No+Image`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-main/80 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-[10px] sm:text-xs font-medium bg-btn text-white rounded-full backdrop-blur-sm font-psmbold">
              Published
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 sm:p-4">
          
          {/* Title */}
          <h3 className="text-base sm:text-lg font-psmbold text-white mb-2 line-clamp-2 group-hover:text-btn transition-colors duration-200">
            {data.title || 'Untitled Post'}
          </h3>
          
          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed mb-3 line-clamp-2 flex-1 font-pregular">
            {truncatedDescription}
          </p>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 2).map((tag, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-btn/20 text-btn rounded-full border border-btn/30 hover:bg-btn/30 transition-colors duration-200 font-psmbold"
                >
                  #{tag.trim()}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-2 py-0.5 text-[10px] text-white/50 font-pregular">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            
            {/* User */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-btn to-btn-hover flex items-center justify-center text-white font-bold text-xs font-psmbold">
                {userInitial}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white font-psmbold">
                  Anonymous User
                </span>
                <span className="text-[10px] text-white/60 font-pregular">
                  {formattedDate}
                </span>
              </div>
            </div>
            
            {/* Read More */}
            <div className="flex items-center text-btn group-hover:text-btn-hover transition-colors duration-200">
              <span className="text-xs font-medium mr-1 font-psmbold">Read</span>
              <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

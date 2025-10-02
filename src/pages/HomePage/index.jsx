import React, { useEffect, useState } from 'react'
import { useMainContext } from '../../context/MainContext'
import HomeBlogCard from './HomeBlogCard'
import SkeletonLoader from '../../components/SkeletonLoader'
import { CgSearch } from 'react-icons/cg'

const HomePage = () => { 

  const {allBlogs, fetchAllHomeBlogs} = useMainContext()
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Check loading state when blogs change
  useEffect(() => {
    if (allBlogs.length > 0) {
      setIsLoading(false)
    }
  }, [allBlogs])

  // Auto-hide loading after 3 seconds even if no blogs
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const filterBlogs = allBlogs.length <= 0 ? [] : allBlogs.filter((cur, i) => {
    if (!search || search.trim() === '') {
      return true
    }
    
    const searchTerm = search.toLowerCase().trim()
    const title = cur.title?.toLowerCase() || ''
    const description = cur.description?.toLowerCase() || ''
    const tags = cur.tags?.toLowerCase() || ''
    
    const matches = title.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   tags.includes(searchTerm)
    
    return matches
  })
 
  return (
    <div className="min-h-screen bg-black mt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-full max-w-md border border-gray-600 py-3 px-4 rounded-lg flex items-center bg-section hover:border-btn transition-colors duration-200">
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              type="text" 
              className="w-full bg-transparent outline-none text-white placeholder-gray-400" 
              placeholder="Search blogs..." 
            />
            <CgSearch className="text-2xl text-gray-400" />
          </div>
          
          {/* Debug info */}
          {search && (
            <div className="mt-2 text-sm text-gray-400">
              Searching for: "{search}" | Found: {filterBlogs.length} results | Total blogs: {allBlogs.length}
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {allBlogs && filterBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterBlogs.map((cur, i) => (
                  <HomeBlogCard key={cur.$id || i} data={cur} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {search ? 'No Results Found' : 'No Blogs Available'}
                  <span className="text-btn">!</span>
                </h1>
                {search && (
                  <p className="text-gray-400 mt-4">
                    Try searching with different keywords
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default HomePage
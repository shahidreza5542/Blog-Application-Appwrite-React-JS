import React from 'react'

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-section rounded-xl p-4 border border-btn">
            {/* Image skeleton */}
            <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
            
            {/* Title skeleton */}
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
            
            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
            
            {/* Tags skeleton */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-700 rounded-full w-16"></div>
              <div className="h-6 bg-gray-700 rounded-full w-20"></div>
            </div>
            
            {/* Author skeleton */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="ml-3">
                <div className="h-4 bg-gray-700 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonLoader

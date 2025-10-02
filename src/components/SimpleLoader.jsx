import React from 'react'
import { FaFreeCodeCamp } from "react-icons/fa6"

const SimpleLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] flex-col">
      <div className="text-center">
        <div className="font-pbold text-4xl lg:text-5xl flex items-center justify-center gap-x-2 text-white mb-4">
          <FaFreeCodeCamp className="text-btn animate-pulse" />
          <span>Devio</span>
          <span className="w-2 h-2 rounded-full bg-btn animate-bounce"></span>
        </div>
        <p className="text-gray-400 text-sm">Loading content...</p>
      </div>
    </div>
  )
}

export default SimpleLoader

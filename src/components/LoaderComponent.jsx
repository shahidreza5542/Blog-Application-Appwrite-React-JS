import React, { useEffect, useState } from 'react'
import { FaFreeCodeCamp } from 'react-icons/fa'

const LoaderComponent = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5 // fast increment
      })
    }, 30) // smooth and fast

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen flex-col bg-black">
      <div className="text-center">
        <div
          title="Blogi"
          className="font-pbold text-5xl lg:text-7xl flex items-center justify-center gap-x-2 text-white"
        >
          <FaFreeCodeCamp className="text-btn" />
          <span>Blogi</span>
          <span className="w-2 h-2 rounded-full bg-btn animate-bounce"></span>
        </div>

        {/* Progress Bar */}
        <div className="overflow-hidden w-full max-w-md bg-black/40 rounded-full my-4 mx-auto">
          <div
            style={{ width: `${progress}%` }}
            className="bg-btn py-1 rounded-l-full rounded-b-full transition-all duration-300"
          ></div>
        </div>

        <p className="text-white text-sm mt-2">{progress}%</p>
      </div>
    </div>
  )
}

export default LoaderComponent

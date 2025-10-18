import React, { useEffect, useState } from 'react'
import { FaLaptopCode } from "react-icons/fa6";

const LoaderComponent = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Faster initial loading, slower near end
        const increment = prev < 70 ? 8 : prev < 90 ? 3 : 1
        return Math.min(prev + increment, 100)
      })
    }, 50) // Balanced speed

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen flex-col bg-main">
      <div className="text-center">
        <div
          title="DevHive"
          className="font-pbold text-5xl lg:text-7xl flex items-center justify-center gap-x-2 text-text"
        >
          <FaLaptopCode className="text-btn" />
          <span>DevHive</span>
          <span className="w-2 h-2 rounded-full bg-btn animate-bounce"></span>
        </div>

        {/* Progress Bar */}
        <div className="overflow-hidden w-full max-w-md bg-black/40 rounded-full my-4 mx-auto">
          <div
            style={{ width: `${progress}%` }}
            className="bg-btn py-1 rounded-l-full rounded-b-full transition-all duration-300"
          ></div>
        </div>

        <p className="text-p text-sm mt-2">{progress}%</p>
      </div>
    </div>
  )
}

export default LoaderComponent

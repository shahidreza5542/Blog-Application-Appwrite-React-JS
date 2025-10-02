import React from 'react'
import { Link } from 'react-router-dom'
import { FaLock, FaHome } from 'react-icons/fa'

const PermissionError = ({ message = "Access Denied" }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-6">
          <FaLock className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-lg mb-4">{message}</p>
          <p className="text-gray-500 text-sm">
            You don't have permission to view this content. Please contact the administrator.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-btn hover:bg-btn/80 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FaHome />
            Go to Homepage
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>If you believe this is an error, please:</p>
            <ul className="mt-2 space-y-1">
              <li>• Check if you're logged in</li>
              <li>• Verify your account permissions</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionError

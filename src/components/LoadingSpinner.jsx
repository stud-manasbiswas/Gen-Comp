import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-900 border-solid rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-purple-500 border-solid rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
        <p className="text-gray-400 mt-4 text-lg">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
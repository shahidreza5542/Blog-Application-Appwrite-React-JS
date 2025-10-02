import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appWriteDB, appWriteStorage } from '../../lib/appwrite'
import { ENVObj } from '../../lib/constant'
import moment from 'moment'
import toast from 'react-hot-toast'
import { Query } from 'appwrite'

const HomeBlogCard = ({ data }) => {
  const [user, setUser] = useState({})
  const [images, setImages] = useState({
    image: '',
    profileImage: ''
  })

  const tags = data?.tags?.split(",")

  const fetchUser = async () => {
    try {
      const image = appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID, data.image)
      try {
        const { documents } = await appWriteDB.listDocuments(
          ENVObj.VITE_APPWRITE_DB_ID,
          ENVObj.VITE_APPWRITE_PROFILE_COLLECTION_ID,
          [Query.equal('user', data.user)]
        )

        if (documents.length > 0) {
          setUser(documents[0])
          const profileImage = documents[0].image
            ? appWriteStorage.getFileView(ENVObj.VITE_APPWRITE_STORAGE_ID, documents[0].image)
            : null
          setImages({ image, profileImage })
        } else {
          setImages({ image, profileImage: null })
        }
      } catch (profileError) {
        console.log('Profile fetch failed:', profileError)
        setImages({ image, profileImage: null })
        setUser({ name: 'Anonymous User' })
      }
    } catch (error) {
      console.log('HomeBlogCard fetch error:', error)
      if (error.code !== 401) toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <Link to={`/blog/${data.slug}`}>
      <div className="group relative flex flex-col bg-section border border-btn rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden  md:max-w-md w-[80%] mx-auto">
        
        {/* Image */}
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            src={images.image}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h3 className="text-white text-lg sm:text-xl font-bold mb-2 sm:mb-3 line-clamp-2">
            {data.title}
          </h3>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-3">
            {data.description?.substring(0, 120)}
            {data.description?.length > 120 ? '...' : ''}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-3">
              {tags.map((cur, i) => (
                <li
                  key={i}
                  className="px-3 py-1 bg-btn text-white rounded-full text-xs sm:text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity duration-200 capitalize"
                >
                  {cur}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700/30">
          <div className="flex items-center">
            {images.profileImage ? (
              <img
                src={images.profileImage}
                alt={user?.name || 'Anonymous'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-btn flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="ml-3 flex flex-col text-sm">
              <span className="text-white font-semibold">{user?.name || 'Anonymous User'}</span>
              <span className="text-zinc-400 text-xs sm:text-sm">
                {moment(new Date(data.$createdAt)).format('LL')}
              </span>
            </div>
          </div>

          <span className="text-zinc-400 text-xs sm:text-sm">
            {moment(new Date(data.$createdAt)).format('LT')}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default HomeBlogCard

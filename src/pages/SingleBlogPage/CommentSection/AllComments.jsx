import React, { useEffect, useState } from 'react'
import ChatCard from './ChatCard'
import { CgSpinner } from 'react-icons/cg';
import toast from 'react-hot-toast';
import { appWriteDB } from './../../../lib/appwrite';
import { ENVObj } from '../../../lib/constant';
import { Query } from 'appwrite';

const AllComments = ({ isUpdate, id }) => {


  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState([])


  const fetchAllComments = async () => {
    try {
      setLoading(true)

      const { documents } = await appWriteDB.listDocuments(ENVObj.VITE_APPWRITE_DB_ID, ENVObj.VITE_APPWRITE_COMMENT_COLLECTION_ID, [
        Query.equal("blog", id)
      ])
      setChats(documents)

    } catch (error) {
      // toast.error(error.message)
    } finally {
      setLoading(false)

    }
  }

  useEffect(() => {
    fetchAllComments()
  }, [isUpdate])

  return (
    <>
      <h1 className='font-pbold text-4xl py-4'>Comments </h1>
      {loading ? <>

        <div className="flex   w-full md:1/2 lg:w-1/3 items-center justify-center py-10">
          <CgSpinner className='text-8xl animate-spin' />
        </div>
      </> : <div className="flex flex-col gap-y-3">
        {
          chats.length > 0 ? chats.map((cur, i) => {
            return <ChatCard chat={cur} key={i} />
          })
            :
            <></>
        }
      </div>}

    </>
  )
}

export default AllComments



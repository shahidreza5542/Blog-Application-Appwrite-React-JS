import moment from 'moment/moment';
import React, { useEffect, useState } from 'react'
import { CiUser } from "react-icons/ci";
import { appWriteDB } from '../../../lib/appwrite';
import { ENVObj } from '../../../lib/constant';
import toast from 'react-hot-toast';
import { Query } from 'appwrite';

const ChatCard = ({ chat }) => {



  return (
    <div className='w-full py-3 rounded-xl h-auto shadow px-3 flex mt-1 items-start bg-black/20 md:W-1/2 lg:w-1/3'>
      <CiUser className='text-4xl' />
      <div className=" w-full ">
        <span className='px-5 py-2 rounded-full font-pmdium flex'>@{chat?.user ?? "User"}</span>
        <p className='p-2 py-4 w-full'><span className='font-bold text-btn'>Comment:</span> {chat.msg}</p>
        <p className="text-end text-xs text-p">{moment(chat.$createdAt).toNow()}</p>
      </div>


    </div>
  )
}

export default ChatCard
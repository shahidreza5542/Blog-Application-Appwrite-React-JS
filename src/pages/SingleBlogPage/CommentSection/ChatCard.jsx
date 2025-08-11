import moment from 'moment/moment';
import React, { useEffect, useState } from 'react'
import { CiUser } from "react-icons/ci";
import { appWriteDB } from '../../../lib/appwrite';
import { ENVObj } from '../../../lib/constant';
import toast from 'react-hot-toast';
import { Query } from 'appwrite';

const ChatCard = ({chat}) => { 

 

  return (
    <div className='w-full py-4 rounded shadow px-3 flex items-start bg-black/20 md:W-1/2 lg:w-1/3'>
 
                  <CiUser className='text-6xl' /> 
                  <div className=" w-full">
                <span className='px-5 py-2 rounded-full font-pmdium bg-black/40'>@{ chat?.user ?? "User"}</span>
                <p className='p-2 py-4 w-full'>{chat.msg}</p>
                  <p className="text-end text-xs text-gray-300">{moment(chat.$createdAt).toNow()}</p>
                  </div>
              

    </div>
  )
}

export default ChatCard
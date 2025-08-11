import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { Link } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { useMainContext } from '../context/MainContext';
import { SiBlogger } from "react-icons/si";


export default function CustomProfileButton() {
  const {logoutHandler} = useMainContext()
  return (
    
      <Menu >
        <MenuButton className=" flex items-center justify-center outline-none gap-x-1">
  <FaRegUserCircle className='text-2xl' />
          <ChevronDownIcon className="size-4 fill-white/60" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm/6 text-main transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
       
         <MenuItem>
            <Link to={'/add-blog'} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-main/20 cursor-pointer">
              <SiBlogger className="size-4 fill-btn" />
              Add Blog
              
            </Link>
          </MenuItem>
            <MenuItem>
            <Link to={'/all-blog'} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-main/20 cursor-pointer">
              <PencilIcon className="size-4 fill-btn" />
              All Blogs
              
            </Link>
          </MenuItem>
     
          <div className="my-1 h-px bg-gray-200" />

          <MenuItem>
            <Link to={'/profile'} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-main/20 cursor-pointer">
              <CiUser className="size-4 fill-btn" />
              Profile
              
            </Link>
          </MenuItem>
          <MenuItem>
            <button onClick={logoutHandler} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-main/20 cursor-pointer">
              <IoIosLogOut className="size-4 fill-btn" />
              Logout 
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
 
  )
}

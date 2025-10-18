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
import { AuthSlice } from '../redux/slices/Auth.slice';
import { appwriteAccount, checkExistProfile } from '../lib/appwrite';
import { useState } from 'react';

export default function CustomProfileButton() {
  const { logoutHandler } = useMainContext()
  const [isAdmin, setIsAdmin] = useState(false)



  const fetchProfile = async () => {
    try {
      const user = await appwriteAccount.get(); // Logged-in user
      const profile = await checkExistProfile(user.$id);

      if (profile) {
        console.log("Profile exists:", profile);
        console.log("Is Admin:", profile.admin);
        setIsAdmin(profile.admin)
      } else {
        console.log("Profile does not exist, create one.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  fetchProfile();



  return (

    <Menu >
      <MenuButton className=" flex items-center justify-center outline-none gap-x-1">
        <FaRegUserCircle className='text-2xl' />
        <ChevronDownIcon className="size-4 fill-text" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-52  rounded-xl border mt-5 border-white/5 z-20 md:origin-top-right origin-center bg-[var(--color-main)] p-1 text-sm/6 text-text transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >

        {isAdmin&&
          <div>
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
          </div>
        }

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

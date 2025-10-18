import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/16/solid'
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { Link } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { useMainContext } from '../context/MainContext';
import { SiBlogger } from "react-icons/si";
import { appwriteAccount, checkExistProfile } from '../lib/appwrite';
import { useState, useEffect } from 'react';

export default function CustomProfileButton() {
  const { logoutHandler } = useMainContext()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await appwriteAccount.get(); 
        const profile = await checkExistProfile(user.$id);
        if (profile) setIsAdmin(profile.admin);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, [])

  return (
    <Menu>
      <MenuButton className="flex items-center justify-center outline-none gap-x-1">
        <FaRegUserCircle className='text-2xl' />
      </MenuButton>

      <MenuItems
        className="w-52 rounded-xl border mt-5 border-white/5 z-20
                   origin-center md:origin-top-right
                   bg-[var(--color-main)] p-2 text-sm text-text
                   transition duration-150 ease-out focus:outline-none
                   data-closed:scale-95 data-closed:opacity-0
                   absolute md:absolute left-1/2 md:left-auto
                   top-1/2 md:top-full -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0"
      >
        {isAdmin &&
          <>
            <MenuItem>
              <Link to="/add-blog"
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-2
                           bg-[var(--color-main)]/20 hover:bg-[var(--color-main)]/30 cursor-pointer transition"
              >
                <SiBlogger className="w-5 h-5 text-[var(--color-btn)]" />
                Add Blog
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/all-blog"
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-2
                           bg-[var(--color-main)]/20 hover:bg-[var(--color-main)]/30 cursor-pointer transition"
              >
                <PencilIcon className="w-5 h-5 text-[var(--color-btn)]" />
                All Blogs
              </Link>
            </MenuItem>
          </>
        }

        <div className="my-1 h-px bg-gray-200" />

        <MenuItem>
          <Link to="/profile"
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-2
                       bg-[var(--color-main)]/20 hover:bg-[var(--color-main)]/30 cursor-pointer transition"
          >
            <CiUser className="w-5 h-5 text-[var(--color-btn)]" />
            Profile
          </Link>
        </MenuItem>

        <MenuItem>
          <button
            onClick={logoutHandler}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-2
                       bg-[var(--color-main)]/20 hover:bg-[var(--color-main)]/30 cursor-pointer transition"
          >
            <IoIosLogOut className="w-5 h-5 text-[var(--color-btn)]" />
            Logout
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

import clsx from 'clsx'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useSelector } from 'react-redux'
import { AuthSlicePath } from '../redux/slices/Auth.slice'
import { useMainContext } from '../context/MainContext'
import CustomProfileButton from './CustomProfileButton'
import ThemeToggle from './ThemeToggle'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

const Navbar = () => {
  const user = useSelector(AuthSlicePath)
  const { logoutHandler } = useMainContext()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className='w-full bg-section py-3 fixed top-0 z-20'>
      <nav className='w-[95%] lg:w-[90%] xl:w-[80%] mx-auto flex justify-between items-center'>
        <Logo />

        {/* Mobile menu toggle */}
        <div className='lg:hidden'>
          <button onClick={() => setMobileOpen(!mobileOpen)} className='p-2 rounded-md focus:outline-none'>
            {mobileOpen ? <HiOutlineX className='text-2xl' /> : <HiOutlineMenu className='text-2xl' />}
          </button>
        </div>

        {/* Menu */}
        <ul className={clsx(
          'flex flex-col justify-center items-center lg:flex-row lg:items-center lg:gap-x-4 lg:static lg:max-h-full lg:w-auto lg:justify-between absolute top-full left-0 w-full bg-section overflow-hidden',
          mobileOpen ? 'max-h-96 py-4' : 'max-h-0'
        )}>
          <li className='px-3 py-2 lg:p-0'>
            <NavbarLink to='/' title='Home' />
          </li>
          <li className='px-3 py-2 lg:p-0'>
            <NavbarLink to='/about' title='About' />
          </li>
          <li className='px-3 py-2 lg:p-0'>
            <ThemeToggle />
          </li>
          <li className='px-3 py-2 lg:p-0'>
            {user ? <CustomProfileButton /> :
              <Link to='/login' className='bg-btn px-4 py-2 hover:bg-btn-hover transition-all duration-300 rounded'>Login</Link>
            }
          </li>

        </ul>
      </nav>
    </header>
  )
}

export default Navbar

const NavbarLink = ({ to, title }) => {
  const { pathname } = useLocation()
  return (
    <Link
      to={to}
      className={clsx(
        'px-2 py-1 font-medium transition-all duration-300 block text-center lg:inline-block',
        pathname === to && 'bg-btn rounded'
      )}
      title={title}
    >
      {title}
    </Link>
  )
}

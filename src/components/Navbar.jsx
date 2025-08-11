import clsx from 'clsx'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useSelector } from 'react-redux'
import { AuthSlicePath } from '../redux/slices/Auth.slice'
import { useMainContext } from '../context/MainContext'
import CustomProfileButton from './CustomProfileButton'

const Navbar = () => {

  const user = useSelector(AuthSlicePath)
  const {logoutHandler} = useMainContext()

  return (
    <header className='w-full bg-section py-5'>
        <nav className='w-[96%] lg:w-[90%] xl:[80%] mx-auto flex justify-between items-center'>
            <Logo/>

            <ul className="flex items-center gap-x-1 text-sm lg:text-base">
                <li>
                            <NavbarLink to={'/'} title={'Home'} />
                </li>
                  <li>
                            <NavbarLink to={'/about'} title={'About'} />
                </li>
                  {/* <li>
                            <NavbarLink to={'/add-blog'} title={'Add Blog'} />
                </li> */}
                <li>
                  {user ? <>
                  <CustomProfileButton/>
                  {/* <button onClick={logoutHandler} title='Logout' className='bg-btn px-4 py-2 hover:bg-btn-hover  cursor-pointer transition-all duration-300 outline-none rounded'>Logout</button> */}
                  </>:  <Link to={'/login'} className='bg-btn px-4 py-2 hover:bg-btn-hover transition-all duration-300 outline-none rounded'>Login</Link>}
                </li>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar

const NavbarLink =({to,title})=>{

    const {pathname} = useLocation()

    return <Link to={to} className={clsx('px-2 py-1 font-medium transition-all duration-300',pathname==to &&'bg-btn rounded ')} title={title}>{title}</Link>
}
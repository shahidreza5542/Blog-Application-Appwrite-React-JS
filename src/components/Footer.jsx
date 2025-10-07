import React from 'react'
import Logo from './Logo'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='py-5 bg-section mt-10'>
        <Logo/>
        <p className="text-center">ⓒ <span className='font-pbold text-btn'>{new Date().getFullYear()}</span>  Devhive. All rights reserved.</p>
        <p className='text-center text-sm mt-2'><span className='p-1'><Link to={'/terms'}>Terms</Link></span> <span className='p-1'><Link to={'/privacy'}>Privacy</Link></span></p>
    </div>
  )
}

export default Footer
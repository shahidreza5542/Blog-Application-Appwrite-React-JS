import React from 'react'
import Logo from './Logo'

const Footer = () => {
  return (
    <div className='py-5 bg-section mt-10'>
        <Logo/>
        <p className="text-center">Copyright@ <span className='font-pbold text-btn'>{new Date().getFullYear()}</span> </p>
    </div>
  )
}

export default Footer
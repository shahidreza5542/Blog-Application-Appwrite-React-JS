import React from 'react'
import Logo from './Logo'
import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaInstagram, FaGlobe } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="py-8 bg-section mt-10 border-t border-white/10">
      <div className="w-[90%] xl:w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <Logo />

        {/* Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
          <Link to="/terms" className="hover:text-btn transition">Terms</Link>
          <Link to="/privacy" className="hover:text-btn transition">Privacy</Link>
          <a href="https://github.com/shahidreza5542" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-btn transition">
            <FaGithub /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/shahid-reza-4512b7344/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-btn transition">
            <FaLinkedin /> LinkedIn
          </a>
          <a href="https://www.instagram.com/shahid_reza_991/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-btn transition">
            <FaInstagram /> Instagram
          </a>
          <a href="https://shahid-lake.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-btn transition">
            <FaGlobe /> Portfolio
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-xs mt-4 text-gray-400">
        ⓒ <span className="font-pbold text-btn">{new Date().getFullYear()}</span> DevHive. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer

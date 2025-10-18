import React, { useEffect, useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { motion } from 'framer-motion'

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
      whileTap={{ scale: 0.9 }}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {theme === 'light' ? (
          <FiMoon className="text-gray-900 text-2xl" />
        ) : (
          <FiSun className="text-yellow-400 text-2xl" />
        )}
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle

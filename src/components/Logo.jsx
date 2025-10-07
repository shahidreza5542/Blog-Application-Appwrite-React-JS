import { Link } from 'react-router-dom'
import { FaLaptopCode } from "react-icons/fa6";

const Logo = () => {
  return (
    <Link to={'/'} title='Devio' className='font-pbold text-2xl flex items-center justify-center gap-x-1'>
              <FaLaptopCode className='text-btn' />  <span>DevHive</span> <span className='w-2 h-2 rounded-full bg-btn animate-bounce'></span>
    </Link>
  )
}

export default Logo
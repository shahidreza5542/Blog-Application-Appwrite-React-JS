import { Link } from 'react-router-dom'
import { FaLaptopCode } from "react-icons/fa6";

const Logo = () => {
  return (
    <Link 
      to="/" 
      title="DevHive" 
      className="font-pbold text-2xl flex items-center justify-center gap-x-2 hover:scale-101 transition-transform duration-200"
    >
      <FaLaptopCode className="text-btn text-3xl" />
      <span>DevHive</span>
      <span className="w-2 h-2 rounded-full bg-btn animate-bounce"></span>
    </Link>
  )
}

export default Logo

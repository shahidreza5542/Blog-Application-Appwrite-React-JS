import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AuthSlicePath } from '../redux/slices/Auth.slice'

const ProtectedLayout = () => {

    const [loading,setLoading] = useState(true)

    const user = useSelector(AuthSlicePath)

    const location = useLocation()
const navigate = useNavigate()
    useEffect(()=>{
        if(!user){
            navigate("/login")
        }else{
            setLoading(false)
        }
    },[location,user])

    if(loading){
        return <div>loading...</div>
    }

  return (
    <>
    <Outlet/>
    </>
  )
}

export default ProtectedLayout
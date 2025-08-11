import React from 'react'
import AvatarComponent from '../components/profile/AvatarComponent'
import BasicInformation from '../components/profile/BasicInformation'
import { Helmet } from 'react-helmet'

const ProfilePage = () => {
  return (
    <>
     <Helmet>
         <meta charSet="utf-8" />
                <title>Blogi | Profile Page</title>
                <link rel="canonical" href={window.location.href} /> 
      </Helmet>
    <AvatarComponent/>

    <BasicInformation/>
    
    </>
  )
}

export default ProfilePage
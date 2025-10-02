import React from 'react'
import AvatarComponent from '../components/profile/AvatarComponent'
import BasicInformation from '../components/profile/BasicInformation'
import { Helmet } from 'react-helmet-async'

const ProfilePage = () => {
  return (
    <>
     <Helmet>
         <meta charSet="utf-8" />
                <title>Devio | Profile Page</title>
                <link rel="canonical" href={window.location.href} /> 
      </Helmet>
      <div className="mt-16">
        <AvatarComponent/>
        <BasicInformation/>
      </div>
    </>
  )
}

export default ProfilePage
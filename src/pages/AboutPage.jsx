import React from 'react'
import { Helmet } from 'react-helmet'

const AboutPage = () => {
  return (
    <>
    <Helmet>
         <meta charSet="utf-8" />
                <title>Blogi | About Page</title>
                <link rel="canonical" href={window.location.href} />
                <meta name="description" content={"A Blog Website Which is Design By Code with Krishna For Blogs , Coding Techniques, Latest Technologies, Most Useable Framework Mern Stack , MEAN Stack"} />
                <meta name="keywords" content="blog application, node js blog application, react blog application, react js blog application, blog application with admin panel, coding blog, how to create a blog application, how to start a coding blog, amazing coding vlogs, coding vlog asthetic, coding vlog aesthetic, realistic coding vlog, mearn stack application, blog automation, coding vlog, blog app, coding advice, starting a blog, coding, blog app using mern stack, build blog app using mern, blog writing, react blog app, coding podcast, code blog" />
      </Helmet>
        <div className="py-10 container mx-auto min-h-[80vh]">
             <h1 className="text-start text-5xl font-pbold">About </h1>

                <p className='text-lg'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta, deleniti minus natus dignissimos incidunt beatae sint accusamus placeat voluptatibus consequuntur distinctio voluptas saepe.</p>

        </div>
    </>
  )
}

export default AboutPage
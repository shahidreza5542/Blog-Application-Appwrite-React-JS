import React from 'react'
import { Helmet } from 'react-helmet-async'

const AboutPage = () => {
    return (
        <>
            <Helmet>
                <title>DevHive | About Page</title>
                <link rel="canonical" href={window.location.href} />
                <meta name="description" content={"A Blog Website Which is Design By Code with Krishna For Blogs , Coding Techniques, Latest Technologies, Most Useable Framework Mern Stack , MEAN Stack"} />
                <meta name="keywords" content="blog application, node js blog application, react blog application, react js blog application, blog application with admin panel, coding blog, how to create a blog application, how to start a coding blog, amazing coding vlogs, coding vlog asthetic, coding vlog aesthetic, realistic coding vlog, mearn stack application, blog automation, coding vlog, blog app, coding advice, starting a blog, coding, blog app using mern stack, build blog app using mern, blog writing, react blog app, coding podcast, code blog" />
                <link rel="canonical" href={window.location.href} />


            </Helmet>
            <div className="py-8 md:py-16 container mx-auto min-h-[80vh] px-4 md:px-6 mt-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-pbold text-white mb-6 md:mb-8">
                        About <span className="text-btn">Devio</span>
                    </h1>

                    <div className="prose prose-lg max-w-none text-gray-300 space-y-6">
                        <p className="text-lg md:text-xl leading-relaxed">
                            Welcome to <span className="text-btn font-semibold">Devio</span> - your ultimate destination for
                            coding insights, technology trends, and development tutorials.
                        </p>

                        <p className="text-base md:text-lg leading-relaxed">
                            We're passionate about sharing knowledge and helping developers grow their skills.
                            Our platform covers everything from beginner-friendly tutorials to advanced
                            development techniques across various technologies including React, Node.js,
                            and modern web development frameworks.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12">
                            <div className="bg-section p-6 rounded-lg border border-btn/20">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Our Mission</h3>
                                <p className="text-gray-300">
                                    To create a community where developers can learn, share, and grow together
                                    through high-quality content and practical tutorials.
                                </p>
                            </div>

                            <div className="bg-section p-6 rounded-lg border border-btn/20">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">What We Offer</h3>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• In-depth coding tutorials</li>
                                    <li>• Latest technology trends</li>
                                    <li>• Best practices and tips</li>
                                    <li>• Community-driven content</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 md:mt-12 text-center">
                            <p className="text-base md:text-lg text-gray-400">
                                Join our community of passionate developers and start your learning journey today!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutPage
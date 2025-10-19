import React from 'react'
import { Helmet } from 'react-helmet-async'

const AboutPage = () => {
    return (
        <>
            <Helmet>
                <title>About | DevHive - Tech Tutorials, Web Development & Coding Insights</title>
                <meta
                    name="description"
                    content="DevHive is a tech blog focused on web development, coding tutorials, and the latest technology trends. Learn MERN, React, Node.js, and more through practical guides and developer insights."
                />
                <meta
                    name="keywords"
                    content="DevHive, tech blog, web development tutorials, coding blog, JavaScript tutorials, React guide, MERN stack, developer tips, frontend development, backend tutorials, Node.js, learn coding, programming blog, technology news"
                />
                <link rel="canonical" href={window.location.href} />
                <meta property="og:title" content="About DevHive - Learn Coding, Web Dev & Tech Trends" />
                <meta property="og:description" content="Explore coding tutorials, tech news, and developer insights on DevHive. Learn modern web development and stay updated with the latest in technology." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:site_name" content="DevHive" />
            </Helmet>

            <div className="py-8 md:py-16 container mx-auto min-h-[80vh] px-4 md:px-6 mt-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-pbold text-text mb-6 md:mb-8">
                        About <span className="text-[var(--color-btn)]">DevHive</span>
                    </h1>

                    <div className="prose prose-lg max-w-none text-p space-y-6">
                        <p className="text-lg md:text-xl leading-relaxed">
                            Welcome to <span className="text-[var(--color-btn)] font-semibold">DevHive</span> — a platform built for developers, by developers. 
                            Here, we share in-depth tutorials, coding guides, and the latest insights in the tech world to help you level up your skills.
                        </p>

                        <p className="text-base md:text-lg leading-relaxed">
                            At DevHive, our goal is to make learning web development easier and more practical.
                            Whether you're a beginner or an experienced developer, you'll find tutorials on modern technologies like 
                            <strong> React, Node.js, Express, MongoDB, Next.js, and other trending frameworks.</strong>
                        </p>

                        <p className="text-base md:text-lg leading-relaxed">
                            We publish <strong>tech-related blogs</strong>, <strong>developer tips</strong>, 
                            and <strong>new development tutorials</strong> covering topics such as frontend design, backend logic, 
                            and full-stack project building — everything a developer needs to stay updated and inspired.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12">
                            <div className="bg-section p-6 rounded-lg border border-btn/20">
                                <h3 className="text-xl md:text-2xl font-bold text-text mb-4">Our Mission</h3>
                                <p className="text-p">
                                    To build a growing community of passionate developers who learn, share, 
                                    and create innovative projects through open-source ideas and modern coding practices.
                                </p>
                            </div>

                            <div className="bg-section p-6 rounded-lg border border-btn/20">
                                <h3 className="text-xl md:text-2xl font-bold text-text mb-4">What We Share</h3>
                                <ul className="text-text space-y-2">
                                    <li>✨ Step-by-step coding tutorials</li>
                                    <li>🚀 Latest technology and framework updates</li>
                                    <li>💡 Development tips & productivity hacks</li>
                                    <li>🧠 Beginner to advanced-level projects</li>
                                    <li>🌐 Full-stack and AI-integrated web guides</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 md:mt-12 text-center">
                            <p className="text-base md:text-lg text-[var(--color-p)]">
                                Join our <strong>DevHive community</strong> and start exploring practical coding tutorials, tech discussions, 
                                and the latest developer trends today!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutPage

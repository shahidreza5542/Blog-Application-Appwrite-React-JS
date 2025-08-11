import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ErrorPage from './pages/ErrorPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { MainContextProvider } from './context/MainContext'
import {Toaster} from 'react-hot-toast'
import ProfilePage from './pages/ProfilePage'
import ProtectedLayout from './layouts/ProtectedLayout'
import AddBlogPage from './pages/AddBlogPage'
import AllBlogPage from './pages/AllBlogPage'
import UpdateBlogPage from './pages/UpdateBlogPage'
import SingleBlogPage from './pages/SingleBlogPage'
import AboutPage from './pages/AboutPage'
const App = () => {
  return (
    <>
       
       <MainContextProvider>
        <Toaster/>
         <Navbar/>
 

        <Routes>
          <Route path='/' Component={HomePage} />

  {/* ye routes vo hain jinko sirf or sirf logged in user hi access kar skta hain */}

   <Route Component={ProtectedLayout} >
      <Route path='/profile' Component={ProfilePage} />
      <Route path='/add-blog' Component={AddBlogPage} />
      <Route path='/all-blog' Component={AllBlogPage} />
      <Route path='/blog/update/:id' Component={UpdateBlogPage} />
   </Route>

      <Route path='/blog/:slug' Component={SingleBlogPage} />


          <Route path='/login' Component={LoginPage} />
          <Route path='/register' Component={RegisterPage} />
          <Route path='/about' Component={AboutPage} />
          <Route path='*' Component={ErrorPage} />
        </Routes>
        
        <Footer/> 
       </MainContextProvider>
    </>
  )
}

export default App
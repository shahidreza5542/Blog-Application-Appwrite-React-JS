import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { Helmet } from 'react-helmet'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
     <Helmet>
         <meta charSet="utf-8" />
                <title>Blogi | Coding Blog Application</title>
                <link rel="canonical" href={window.location.href} />
                <meta name="description" content={"A Blog Website Which is Design By Code with Krishna For Blogs , Coding Techniques, Latest Technologies, Most Useable Framework Mern Stack , MEAN Stack"} />
                <meta name="keywords" content="blog application, node js blog application, react blog application, react js blog application, blog application with admin panel, coding blog, how to create a blog application, how to start a coding blog, amazing coding vlogs, coding vlog asthetic, coding vlog aesthetic, realistic coding vlog, mearn stack application, blog automation, coding vlog, blog app, coding advice, starting a blog, coding, blog app using mern stack, build blog app using mern, blog writing, react blog app, coding podcast, code blog" />
      </Helmet>
     <BrowserRouter>
      <Provider store={store}>
        
    <App />
      </Provider>
     </BrowserRouter>
  </StrictMode>,
)

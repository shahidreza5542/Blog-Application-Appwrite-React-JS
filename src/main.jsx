import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { HelmetProvider, Helmet } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Devio | Coding Blog Application</title>
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta name="description" content="A Blog Website For Developers - Coding Techniques, Latest Technologies, MERN Stack, and Development Best Practices" />
        <meta name="keywords" content="blog application, react blog, coding blog, mern stack, web development, javascript, react tutorials, coding tips, developer blog" />
        
        {/* Preload fonts to fix slow loading */}
        <link rel="preload" href="/src/styles/fonts/Poppins-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/src/styles/fonts/Poppins-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </Helmet>
      
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)

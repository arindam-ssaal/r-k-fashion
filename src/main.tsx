//import { StrictMode } from 'react'
import { CookiesProvider } from 'react-cookie';
import { createRoot } from 'react-dom/client'


import App from './app'
import './index.css'

import { initSingleTab } from './common/singleTab';

initSingleTab();


createRoot(document.getElementById('root')!).render(
  // <StrictMode> //Ari Commented
  <CookiesProvider>
    <App />
  </CookiesProvider>
  // </StrictMode> //Ari Commented
)

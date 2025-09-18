import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { StaffAuthProvider } from "./staff/StaffAuthContext";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider> 
    <StaffAuthProvider>
    <App />
    </StaffAuthProvider>
    </AppContextProvider>
   
  </BrowserRouter>,
)

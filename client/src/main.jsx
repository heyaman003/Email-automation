import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route,BrowserRouter,Routes } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/email-automation">
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)

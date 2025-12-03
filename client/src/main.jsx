import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { setToken, registerAuthInterceptor } from './utils/auth'
import { CartProvider } from './context/CartContext'
import './styles.css'

const token = localStorage.getItem('token');
if(token) setToken(token);
registerAuthInterceptor();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
)

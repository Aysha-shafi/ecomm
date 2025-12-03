import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { getToken, logout } from './utils/auth'
import AdminCategories from './pages/AdminCategories'
import AdminProducts from './pages/AdminProducts'
import AdminCoupons from './pages/AdminCoupons'
import AdminDashboard from './pages/AdminDashboard'
import Header from './components/Header'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import PublicHome from './pages/PublicHome'
import ProductDetail from './pages/ProductDetail'

export default function App(){
  const navigate = useNavigate()
  const token = getToken()
  
  function onLogout(){ 
    logout(); 
    navigate('/'); 
  }
  
  return (
    <div className="min-h-screen"> 
      <Header />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />

      <main className="container">
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="coupons" element={<AdminCoupons />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/" element={<PublicHome />} />
        </Routes>
      </main>
    </div>
  )
}
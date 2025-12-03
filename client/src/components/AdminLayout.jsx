import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'

export default function AdminLayout(){
  const navigate = useNavigate()
  const token = getToken()
  React.useEffect(()=>{ if(!token) navigate('/admin/login') }, [token])

  

  return (
    <div style={{display:'flex', minHeight:'80vh'}}>
      <aside style={{width:240, borderRight:'1px solid #e5e7eb', padding:12}}>
        <div style={{fontWeight:700, marginBottom:12}}>Admin</div>
        <nav style={{display:'flex', flexDirection:'column', gap:8, height: '100%'}}>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/categories">Categories</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/coupons">Coupons</Link>
          </div>
        </nav>
      </aside>
      <div style={{flex:1, padding:12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2>Admin Dashboard</h2>
        </div>
        <div style={{marginTop:12}}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

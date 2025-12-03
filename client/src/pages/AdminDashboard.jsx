import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import axios from 'axios'

export default function AdminDashboard(){
  const { setLowStockProducts } = useCart()
  const [summary, setSummary] = useState({ totalProducts: 0, totalCategories: 0, totalCoupons: 0, lowStock: [] })
  const [publicCouponCount, setPublicCouponCount] = useState(null)
  const navigate = useNavigate()
  useEffect(()=>{ fetch() }, [])

  async function fetch(){
    try{
      const res = await axios.get('/api/admin/summary')
      const data = res.data || {}
      const coupons = data.totalCoupons || 0
      const activeCoupons = typeof data.totalActiveCoupons === 'number' ? data.totalActiveCoupons : undefined
      setSummary({ totalProducts: data.totalProducts || 0, totalCategories: data.totalCategories || 0, totalCoupons: coupons, totalActiveCoupons: activeCoupons, lowStock: Array.isArray(data.lowStock) ? data.lowStock : [] })
      console.log('admin summary response', data)
      if(typeof setLowStockProducts === 'function') setLowStockProducts(data.lowStock || [])
    } catch(err){
      console.error('Failed to load admin summary', err)
      if(err?.response?.status === 401){
        navigate('/login')
      } else {
        alert('Failed to load admin summary: ' + (err.response?.data?.message || err.message))
      }
    }
    try{
      const res2 = await axios.get('/api/coupons')
      setPublicCouponCount(Array.isArray(res2.data) ? res2.data.length : null)
      console.log('public coupons fetched', (res2.data || []).length)
    }catch(err2){
      console.warn('Failed to load public coupons', err2)
    }
  }

  return (
    <div>
      
      <div className="stats-cards">
        <div className="card">Total Products: {summary.totalProducts}</div>
        <div className="card">Total Categories: {summary.totalCategories}</div>
        <div className="card">Total Coupons: {(summary.totalActiveCoupons ?? summary.totalCoupons) || publicCouponCount || 0} {summary.totalActiveCoupons !== undefined && `(active: ${summary.totalActiveCoupons})`}</div>
        <div className="card">Low-stock count: {summary.lowStock.length}</div>
      </div>
     <h2 className="mt-6 mb-4 font-semibold text-lg">Low Stock Product List</h2>

<table className="mb-8">
  <thead>
    <tr>
      <th>Name</th>
      <th>Stock</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {summary.lowStock.map(product => (
      <tr key={product._id || product.id}>
        <td>{product.name}</td>
        <td>{product.inventory?.stock ?? '—'}</td>
        <td>{product.isActive ? 'Active' : 'Inactive'}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  )
}

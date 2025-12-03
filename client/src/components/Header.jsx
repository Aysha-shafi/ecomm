import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../utils/auth'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useSearchParams } from 'react-router-dom'
import { IoCart } from "react-icons/io5";


export default function Header(){
  const [categories, setCategories] = useState([])
  const { items } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const location = useLocation()
  const [searchParams] = useSearchParams()

  useEffect(()=>{ fetchCategories() }, [])
  useEffect(()=>{ 
    const q = searchParams.get('q') || ''
    setQuery(q)
  }, [searchParams])

  async function fetchCategories(){
    try{
      const res = await axios.get('/api/categories')
      setCategories(Array.isArray(res.data) ? res.data : [])
    }catch(e){ console.error('categories load failed', e); setCategories([]) }
  }

  function submit(e){ e.preventDefault(); navigate('/?q=' + encodeURIComponent(query)) }
  function onCategory(id){ navigate('/?category=' + id) }


  return (
    <>
      
      <header className="nav">
        <div className="logo"><Link to="/">MyShop</Link></div>
        <div className="flex items-center gap-2">
          <div className="categories">
            <select onChange={e=> onCategory(e.target.value)} defaultValue="">
              <option value="">All categories</option>
              {categories.map(c=> (<option value={c._id} key={c._id}>{c.name}</option>))}
            </select>
          </div>
         
        </div>

        <div className="nav-right" style={{ marginLeft:'auto', display:'flex', gap:12, alignItems:'center' }}>
  
  <Link to="/admin">Admin</Link>

  {!location.pathname.startsWith('/admin') && (
   <Link to="/cart" className="relative flex items-center">
  <IoCart className="text-2xl text-gray-700 hover:text-black transition" />

  {items.length > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
{items.reduce((total, item) => total + item.qty, 0)}

    </span>
  )}
</Link>

  )}

  {location.pathname.startsWith('/admin') && (
    <button
      onClick={() => { logout(); navigate('/admin/login') }}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
    >
      Logout
    </button>
  )}
</div>

      </header>
    </>
  )
}

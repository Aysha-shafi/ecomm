import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { IoSearchSharp } from "react-icons/io5";


export default function PublicHome(){
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(()=>{ fetchProducts() }, [])
  useEffect(()=>{ 
    setQuery(searchParams.get('q') || '')
    fetchProducts()
  }, [searchParams])

  async function fetchProducts(){
    setLoading(true)
    setError(null)
    try{
      const q = searchParams.get('q')
      const category = searchParams.get('category')
      let url = '/api/public/products?limit=12'
      if(q) url += '&q=' + encodeURIComponent(q)
      if(category) url += '&category=' + encodeURIComponent(category)
      const res = await axios.get(url)
      setProducts((res.data && Array.isArray(res.data.data)) ? res.data.data : [])
    }catch(err){
      console.error('Failed to fetch products', err)
      setError(err.response?.data?.message || err.message || 'Failed to load products')
      setProducts([])
    }finally{
      setLoading(false)
    }
  }

  async function search(e){
    e.preventDefault();
    setLoading(true)
    setError(null)
    try{
      setSearchParams({ q: query })
    }catch(err){
      console.error('Search failed', err)
      setError(err.response?.data?.message || err.message || 'Search failed')
      setProducts([])
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Products</h2>
      
        <form onSubmit={search} style={{display:'flex', gap:8, alignItems:'center'}}>
          <div style={{position:'relative', width:820}}>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search" style={{padding:'8px 40px 8px 10px',marginBottom:"20px", border:'1px solid #e5e7eb', borderRadius:6, width:'100%'}} />
            <button aria-label="Search" type="submit" style={{position:'absolute', right:6, top:'35%', transform:'translateY(-50%)', padding:8, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', color:'#111827', border:'none', cursor:'pointer'}}>
              <IoSearchSharp />
            </button>
          </div>
        </form>

      {loading && <div>Loading products…</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid">
        {(Array.isArray(products) ? products : []).map(p=> (
          <div key={p._id} className="card">
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              {p.images?.length ? (
                <Link to={'/products/' + p.slug}><img src={p.images[0]} alt={p.name} style={{width:180,height:180,objectFit:'cover', borderRadius:6}}/></Link>
              ) : (
                <div style={{width:180,height:180,display:'flex',alignItems:'center',justifyContent:'center',background:'#f3f4f6',borderRadius:6}}>No image</div>
              )}
              <Link to={'/products/' + p.slug} style={{textDecoration:'none', color:'inherit'}}>
                <h4 style={{marginTop:8}}>{p.name}</h4>
              </Link>
              <p style={{fontWeight:600}}>${p.price}</p>
              <Link to={'/products/' + p.slug} style={{marginTop:8, padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:6, textDecoration:'none'}}>View details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminProducts(){
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', sku: '', price: 0, category: '', description: '', images: [], stock: 0, isActive: true })
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{ fetchProducts(); fetchCategories(); }, [])

  async function fetchProducts(){
    try{
      const res = await axios.get('/api/products?limit=100')
      setProducts(res.data?.data || [])
    }catch(err){
      console.error('Failed to fetch products', err)
      setProducts([])
      if(err?.response?.status === 401){
        window.location.href = '/login'
      } else {
        alert('Failed to load products: ' + (err.response?.data?.message || err.message))
      }
    }
  }
  async function fetchCategories(){
    try{
      const res = await axios.get('/api/categories')
      setCategories(Array.isArray(res.data) ? res.data : [])
    }catch(err){
      console.error('Failed to load categories', err)
      setCategories([])
      alert('Failed to load categories: ' + (err.response?.data?.message || err.message))
    }
  }

  async function createProduct(e){
    e.preventDefault()
    if(!form.sku || form.sku.trim() === ''){ alert('SKU is required'); return }
    const payload = { ...form, inventory: { stock: Number(form.stock || 0) }, isActive: !!form.isActive }
    try{
      if(editingId){
        await axios.put('/api/products/' + editingId, payload)
      } else {
        await axios.post('/api/products', payload)
      }
      setForm({ name: '', sku: '', price: 0, category: '', description: '', images: [], stock: 0, isActive: true })
      setEditingId(null)
      fetchProducts()
    }catch(err){
      console.error('Create product failed', err)
      alert('Failed to create product: ' + (err.response?.data?.message || err.message))
    }
  }

  async function uploadImages(e){
    const files = Array.from(e.target.files)
    const fd = new FormData()
    files.forEach(f=> fd.append('images', f))
    setUploading(true)
    try{
      const res = await axios.post('/api/uploads/products', fd)
      setForm({...form, images: [...form.images, ...(res.data.urls || [])]})
    }catch(err){
      console.error('Image upload failed', err)
      alert('Image upload failed: ' + (err.response?.data?.message || err.message))
    }finally{
      setUploading(false)
    }
  }

  async function deleteProduct(id){
    if(!confirm('Delete this product?')) return;
    try{
      await axios.delete('/api/products/' + id)
      fetchProducts()
    }catch(err){
      console.error('Delete product failed', err)
      alert('Failed to delete product: ' + (err.response?.data?.message || err.message))
    }
  }

  function startEdit(p){
    setEditingId(p._id)
    setForm({ name: p.name, sku: p.sku || '', price: p.price, category: p.category?._id || (p.category?._id || ''), description: p.description || '', images: p.images || [], stock: p.inventory?.stock || 0, isActive: !!p.isActive })
  }
  function cancelEdit(){ setEditingId(null); setForm({ name: '', sku: '', price: 0, category: '', description: '', images: [], stock: 0, isActive: true }) }

  return (
    <div className="container">
      <h2>Products</h2>
      <form onSubmit={createProduct}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
        <input placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku: e.target.value})} required />
        <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price: parseFloat(e.target.value)})} required />
        <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form, stock: parseInt(e.target.value || null)})} />
<div className="flex items-center gap-2 mt-2 mb-2">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={form.isActive}
      onChange={e => setForm({ ...form, isActive: e.target.checked })}
      className="w-4 h-4"
    />
    Active
  </label>
</div>
        <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})}> 
          <option value="">-- Select Category --</option>
          {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />

        <div>
          <label>Images (multiple)</label>
          <input type="file" multiple onChange={uploadImages} />
        </div>

        <div className="image-preview">
          {uploading ? <em>Uploading...</em> : form.images.map((u,i)=>(<img key={i} src={u} alt="preview" />))}
        </div>

<button
  type="submit"
  className="mt-4 mb-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
>
  {editingId ? 'Save' : 'Create Product'}
</button>
        {editingId && <button type="button" onClick={cancelEdit} style={{marginLeft:8}}>Cancel</button>}
      </form>

      <table>
        <thead>
          <tr>
            <th>Img</th>
            <th>SKU</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Active</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p=> (
            <tr key={p._id}>
              <td>{p.images?.length ? (<img src={p.images[0]} alt={p.name} style={{width:64,height:64,objectFit:'cover'}}/>) : '—' }</td>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.category?.name}</td>
              <td>{p.inventory?.stock ?? p.inventory}</td>
              <td>{p.isActive ? 'Yes' : 'No'}</td>
              <td>{p.description ? (p.description.length > 60 ? p.description.slice(0,60)+'...' : p.description) : ''}</td>
              <td>
                <button onClick={()=>startEdit(p)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded">Edit</button>
              </td>
              <td>
                <button onClick={()=>deleteProduct(p._id)} className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminCategories(){
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(()=>{ fetchCategories() }, [])

  async function fetchCategories(){
    try{
      const res = await axios.get('/api/categories')
      setCategories(Array.isArray(res.data) ? res.data : [])
    }catch(err){
      console.error('Failed to load categories', err);
      setCategories([])
      alert('Failed to load categories: ' + (err.response?.data?.message || err.message))
      if(err?.response?.status === 401){ window.location.href = '/login' }
    }
  }

  async function createCategory(e){
    e.preventDefault();
    try{
      if(editingId){
        await axios.put('/api/categories/' + editingId, form)
      } else {
        await axios.post('/api/categories', form)
      }
      setForm({ name: '', slug: '', description: '' })
      setEditingId(null)
      fetchCategories()
    }catch(err){
      console.error('Failed to save category', err);
      alert('Failed to save category: ' + (err.response?.data?.message || err.message))
    }
  }

  function startEdit(c){
    setEditingId(c._id)
    setForm({ name: c.name, slug: c.slug, description: c.description || '' })
  }
  function cancelEdit(){ setEditingId(null); setForm({ name: '', slug: '', description: '' }) }

  async function deleteCategory(id){
    if(!confirm('Delete this category?')) return;
    try{
      await axios.delete('/api/categories/' + id)
      fetchCategories()
    }catch(err){
      console.error('Failed to delete category', err);
      alert('Failed to delete category: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="container">
      <h2>Categories</h2>
      <form onSubmit={createCategory}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
        <input placeholder="Slug" value={form.slug} onChange={e=>setForm({...form, slug: e.target.value})} />
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
<button
  type="submit"
  className="mt-4 mb-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
>
  {editingId ? 'Save' : 'Create'}
</button>
        {editingId && <button type="button" onClick={cancelEdit} style={{marginLeft:8}}>Cancel</button>}
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c=> (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>
                <button onClick={()=>startEdit(c)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded">Edit</button>
              </td>
              <td>
                <button onClick={()=>deleteCategory(c._id)} className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

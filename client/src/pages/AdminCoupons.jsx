import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminCoupons(){
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState({ code: '', discountType: 'percent', value: 0, active: true })
  const [editingId, setEditingId] = useState(null)

  useEffect(()=>{ fetchCoupons() }, [])

  async function fetchCoupons(){
    try{
      const res = await axios.get('/api/coupons')
      const data = res.data
      if (Array.isArray(data)) setCoupons(data)
      else if (Array.isArray(data.data)) setCoupons(data.data)
      else if (Array.isArray(data.coupons)) setCoupons(data.coupons)
      else setCoupons([])
    }catch(err){
      console.error('Failed to load coupons', err);
      setCoupons([])
      alert('Failed to load coupons: ' + (err.response?.data?.message || err.message))
      if(err?.response?.status === 401){ window.location.href = '/login' }
    }
  }

  async function createCoupon(e){
    e.preventDefault();
    try{
      if(editingId){
        await axios.put('/api/coupons/' + editingId, form)
      } else {
        await axios.post('/api/coupons', form)
      }
      setForm({ code: '', discountType: 'percent', value: 0, active: true })
      setEditingId(null)
      fetchCoupons()
    }catch(err){
      console.error('Failed to create coupon', err);
      alert('Failed to create coupon: ' + (err.response?.data?.message || err.message))
    }
  }

  async function deleteCoupon(id){
    if(!confirm('Delete this coupon?')) return;
    try{
      await axios.delete('/api/coupons/' + id)
      fetchCoupons()
    }catch(err){
      console.error('Failed to delete coupon', err);
      alert('Failed to delete coupon: ' + (err.response?.data?.message || err.message))
    }
  }

  function startEdit(c){
    setEditingId(c._id)
    setForm({ code: c.code, discountType: c.discountType, value: c.value, active: c.active })
  }
  function cancelEdit(){ setEditingId(null); setForm({ code: '', discountType: 'percent', value: 0, active: true }) }

  return (
    <div className="container">
      <h2>Coupons</h2>
      <form onSubmit={createCoupon}>
  <input placeholder="Code" value={form.code} onChange={e=>setForm({...form, code: e.target.value})} required />
  
  <select value={form.discountType} onChange={e=>setForm({...form, discountType: e.target.value})}>
    <option value="percent">Percent</option>
    <option value="fixed">Fixed</option>
  </select>

  <input placeholder="Value" type="number" value={form.value} onChange={e=>setForm({...form, value: parseFloat(e.target.value) })} required />

  <div className="flex items-center gap-2 mt-2">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={form.active}
        onChange={e => setForm({ ...form, active: e.target.checked })}
        className="w-4 h-4"
      />
      Active
    </label>
  </div>

  <button
    type="submit"
    className="mt-4 mb-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
  >
    {editingId ? 'Save' : 'Create'}
  </button>

  {editingId && (
    <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>
      Cancel
    </button>
  )}
</form>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
              {(Array.isArray(coupons) ? coupons : []).map(c=>(
                <tr key={c._id}>
                  <td>{c.code}</td>
                  <td>{c.discountType}</td>
                  <td>{c.value}</td>
                  <td>
                    <button onClick={()=>startEdit(c)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded">Edit</button>
                  </td>
                  <td>
                    <button onClick={()=>deleteCoupon(c._id)} className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded">Delete</button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}

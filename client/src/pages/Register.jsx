import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await axios.post('/api/auth/register', form)
      if(res.data?.token){
        const { setToken } = await import('../utils/auth')
        setToken(res.data.token)
        navigate('/admin')
        return
      }
      navigate('/login')
    }catch(err){
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="container">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-6">
Admin Register</h2>
      <form onSubmit={submit}>
        <input className='mb-4' placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
        <input className='mb-4' placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required />
        {error && <div style={{color:'red'}}>{error}</div>}
       <button
          type="submit"
          className="w-full mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-700 mt-4 text-white font-semibold rounded-lg shadow-md transition duration-200"
        >Register</button>
      </form>
     <p className="text-gray-600 mt-4 text-center">Already registered? <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold underline">Login</a></p>
    </div>
  )
}

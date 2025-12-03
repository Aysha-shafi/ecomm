import React, { useState } from 'react'
import axios from 'axios'
import { setToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
  e.preventDefault()
  try {
    const res = await axios.post('/api/auth/login', form)
    setToken(res.data.token)
    navigate('/admin')
  } catch (err) {
    const message = 'Incorrect email or password'
    alert(message)  
    console.error('Login error', err)
  }
}


  return (
    <div className="container">
      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-6">
        Admin Login
      </h2>


      <form onSubmit={submit}>
        <input className="mb-4" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 mt-4 text-white font-semibold rounded-lg shadow-md transition duration-200"
        >
          Login
        </button>

      </form>
      <p className="text-gray-600 mt-4 text-center">
        Don't have an account?{' '}
        <a
          href="/register"
          className="text-blue-600 hover:text-blue-800 font-semibold underline"
        >
          Register
        </a>
      </p>

    </div>
  )
}

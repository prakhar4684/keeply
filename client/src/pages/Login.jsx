import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Cloud, Eye, EyeOff, ArrowRight,
  AlertCircle, Loader2, LayoutDashboard
} from 'lucide-react'
import { login } from '../services/authService'
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { loginUser } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    try {
      setLoading(true)
      setError("")
      const data = await login({
        email: form.email,
        password: form.password
      })
      loginUser(data)
      navigate("/dashboard")
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-100/60 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/60 overflow-hidden">
          <div className="px-8 pt-8 pb-6">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Cloud size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Keeply ☁️</span>
            </Link>

            <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h1>
            <p className="text-sm text-gray-500 mb-7">Sign in to your secure storage workspace.</p>

            {/* ERROR */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="input-field"
              />

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* GO TO DASHBOARD BUTTON */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-colors font-bold"
              >
                <LayoutDashboard size={18} />
                Go to Landing Page
              </button>

            </form>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* REGISTER LINK */}
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-emerald-600 font-semibold hover:underline"
              >
                Login →
              </Link>
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
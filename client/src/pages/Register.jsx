import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react'
import { register } from "../services/authService"
// TODO: connect backend API - POST /api/auth/register
export default function Register() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const passwordStrength = () => {
    const p = form.password
    if (p.length === 0) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strengthConfig = [
    { label: '', color: 'bg-gray-200' },
    { label: 'Weak', color: 'bg-red-400' },
    { label: 'Fair', color: 'bg-amber-400' },
    { label: 'Good', color: 'bg-emerald-400' },
    { label: 'Strong', color: 'bg-emerald-600' },
  ]

  const strength = passwordStrength()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (error) setError('')
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    } try {

      setLoading(true)
      setError("")

      await register(form)

      setSuccess(true)

    }
    catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      )

    }
    finally {

      setLoading(false)

    }
  }

  const inputFields = [
    { icon: User, name: 'name', type: 'text', placeholder: 'Your full name', label: 'Full name', autoComplete: 'name' },
    { icon: Mail, name: 'email', type: 'email', placeholder: 'you@example.com', label: 'Email address', autoComplete: 'email' },
  ]

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/60 overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Cloud size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Keeply ☁️</span>
            </Link>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <motion.div
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200"
                >
                  <Check size={28} className="text-emerald-600" />
                </motion.div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Account Created!</h2>
                <p className="text-sm text-gray-500 mb-6">Welcome to Keeply. Your secure workspace is ready.</p>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    Go to Login <ArrowRight size={16} />
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <>
                <h1 className="text-2xl font-black text-gray-900 mb-1">Create your account</h1>
                <p className="text-sm text-gray-500 mb-7">Get 5 GB free. No credit card required.</p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5"
                  >
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {inputFields.map((field, i) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{field.label}</label>
                      <div className="relative">
                        <field.icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          placeholder={"   " + field.placeholder}
                          autoComplete={field.autoComplete}
                          className="input-field pl-10"
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* Password */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.16 }}
                  >
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="   Min. 8 characters"
                        autoComplete="new-password"
                        className="input-field pl-10 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {form.password && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2"
                      >
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map(s => (
                            <motion.div
                              key={s}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= strength ? strengthConfig[strength].color : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${strength <= 1 ? 'text-red-500' : strength <= 2 ? 'text-amber-500' : 'text-emerald-600'
                          }`}>
                          {strengthConfig[strength].label} password
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  <p className="text-xs text-gray-400">
                    By creating an account, you agree to our{' '}
                    <span className="text-emerald-600 cursor-pointer hover:underline">Terms</span> and{' '}
                    <span className="text-emerald-600 cursor-pointer hover:underline">Privacy Policy</span>.
                  </p>

                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all ${loading
                        ? 'bg-emerald-400 cursor-not-allowed text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25'
                      }`}
                  >
                    {loading ? (
                      <><Loader2 size={17} className="animate-spin" /> Creating account...</>
                    ) : (
                      <>Create Account <ArrowRight size={16} /></>
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </div>

          <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

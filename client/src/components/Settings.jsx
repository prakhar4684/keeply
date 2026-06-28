import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Pencil, Check, X, Mail, User as UserIcon,
  Shield, HardDrive, ChevronLeft, Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Same formatting logic as UserMenu — keeps storage numbers consistent app-wide
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 MB'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`
  return `${mb.toFixed(2)} MB`
}

export default function Settings() {
  // Pull real user data from context — same source UserMenu.jsx uses
  const { user, updateUser } = useAuth()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(user?.name || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  // Keep draft in sync if user data loads/changes after mount
  useEffect(() => {
    if (!editing) setDraft(user?.name || '')
  }, [user?.name, editing])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  const startEditing = () => {
    setDraft(user?.name || '')
    setError('')
    setEditing(true)
  }

  const cancelEditing = () => {
    setDraft(user?.name || '')
    setError('')
    setEditing(false)
  }

  const saveName = async () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      setError("Name can't be empty")
      return
    }
    if (trimmed.length > 40) {
      setError('Keep it under 40 characters')
      return
    }
    try {
      setSaving(true)
      setError('')
      // updateUser should call your authService rename/update endpoint
      // and update the AuthContext user object on success.
      await updateUser?.({ name: trimmed })
      setEditing(false)
    } catch (err) {
      setError(err?.message || 'Could not rename, try again')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveName()
    if (e.key === 'Escape') cancelEditing()
  }

  const usedBytes = user?.usedStorage ?? 0
  const limitBytes = user?.storageLimit ?? 0
  const pct = limitBytes > 0 ? Math.min(100, Math.round((usedBytes / limitBytes) * 100)) : 0

  return (
    <div className="min-h-full bg-gray-50/60">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/dashboard"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
        </div>

        {/* ── Profile card ───────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">
            Profile
          </p>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-sm flex-shrink-0">
              {initial}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name row — rename happens here */}
              <div className="flex items-center gap-1.5">
                <UserIcon size={12} className="text-gray-400 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Name
                </span>
              </div>

              {editing ? (
                <div className="mt-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => { setDraft(e.target.value); setError('') }}
                      onKeyDown={handleKeyDown}
                      maxLength={40}
                      disabled={saving}
                      className="flex-1 text-[15px] font-semibold text-gray-900 bg-gray-50 border border-emerald-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-200 transition-shadow disabled:opacity-60"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={saveName}
                      disabled={saving}
                      title="Save"
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex-shrink-0 disabled:opacity-60"
                    >
                      <Check size={15} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={cancelEditing}
                      disabled={saving}
                      title="Cancel"
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0 disabled:opacity-60"
                    >
                      <X size={15} />
                    </motion.button>
                  </div>
                  {error && (
                    <p className="text-[11px] text-red-500 font-medium mt-1.5">{error}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1 group">
                  <p className="text-[15px] font-semibold text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <button
                    onClick={startEditing}
                    title="Rename"
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex-shrink-0"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Email row */}
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
            <div className="w-14 flex justify-center flex-shrink-0">
              <Mail size={16} className="text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Email
              </span>
              <p className="text-[15px] font-medium text-gray-700 truncate mt-0.5">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Plan card ──────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">
            Plan
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              Current plan:{' '}
              <span className="text-emerald-600">{user?.plan || 'FREE'}</span>
            </p>
            <Link
              to="/pricing"
              className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Zap size={14} />
              Upgrade
            </Link>
          </div>
        </motion.section>

        {/* ── Storage card ───────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">
            Storage
          </p>
          <div className="flex items-center gap-3 mb-3">
            <HardDrive size={16} className="text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{formatBytes(usedBytes)}</span> of {formatBytes(limitBytes)} used
            </p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
            />
          </div>
        </motion.section>

        {/* ── Security note ──────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-100"
        >
          <Shield size={16} className="text-emerald-500 flex-shrink-0" />
          <p className="text-[13px] text-emerald-700">
            Your name and email are only visible to you.
          </p>
        </motion.section>

      </div>
    </div>
  )
}
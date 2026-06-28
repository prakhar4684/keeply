import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Settings, Zap } from "lucide-react"
import { useAuth } from "../context/AuthContext"

// val in bytes -> readable string
const fmt = (bytes) => {
  if (!bytes || bytes <= 0) return '0 MB'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`
  return `${mb.toFixed(2)} MB`
}

// storage prop: { used: bytes, total: bytes } from Dashboard API
export default function UserMenu({ storage }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { user, logoutUser } = useAuth()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [open])

  const handleLogout = () => {
    logoutUser()
    window.location.href = '/login'
  }

  const usedBytes  = storage?.used  ?? 0
  const totalBytes = storage?.total ?? 0
  const percentage = totalBytes > 0 ? Math.min((usedBytes / totalBytes) * 100, 100) : 0

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-sm font-bold shadow-md flex items-center justify-center"
      >
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50">

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <hr className="my-4" />

          {/* Plan + Storage */}
          <div>
            <p className="text-sm font-semibold">
              Plan: <span className="text-emerald-600">{user?.plan || 'FREE'}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Storage: {fmt(usedBytes)} / {fmt(totalBytes)}
            </p>
            {/* Mini progress bar */}
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${percentage > 80 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Upgrade */}
          <button
            onClick={() => navigate('/pricing')}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition"
          >
            <Zap size={16} />
            Upgrade Plan
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate('/settings')}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            <Settings size={16} />
            Settings
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
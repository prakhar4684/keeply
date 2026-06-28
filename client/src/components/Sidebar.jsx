import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, HardDrive, Trash2, Settings, LogOut, Zap } from 'lucide-react'
import StorageCard from './StorageCard'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ user, storage, activeSection, onNavigate }) {
  const navigate = useNavigate()
  const { logoutUser } = useAuth()

  const navItems = [
    { icon: HardDrive, label: 'My Drive', section: 'home' },
    { icon: Trash2,    label: 'Trash',    section: 'trash' },
  ]

  const isActive = (section) => activeSection === section
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  // storage prop: { used: bytes, total: bytes } from Dashboard API (stats)
  // Convert bytes -> GB for StorageCard
  const storageForCard = {
    used:  (storage?.used  ?? 0) / (1024 * 1024 * 1024),
    total: (storage?.total ?? 0) / (1024 * 1024 * 1024),
  }

  const handleLogout = () => {
    logoutUser()
    window.location.href = '/login'
  }

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full bg-white border-r border-gray-100 w-64 flex-shrink-0 select-none"
    >
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2.5 group w-fit">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
            <Cloud size={15} className="text-white" />
          </div>
          <span className="font-extrabold text-[17px] tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
            Keeply
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">
          Storage
        </p>

        {navItems.map((item) => {
          const active = isActive(item.section)
          return (
            <button key={item.label} onClick={() => onNavigate?.(item.section)} className="w-full text-left">
              <motion.div
                whileHover={{ x: active ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 ${
                  active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <item.icon size={17} strokeWidth={active ? 2.2 : 1.8} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                  <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                </div>
              </motion.div>
            </button>
          )
        })}

        {/* Account */}
        <div className="pt-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Account</p>
          <Link to="/settings">
            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer">
              <Settings size={17} strokeWidth={1.8} className="text-gray-400" />
              <span className="text-sm font-medium">Settings</span>
            </motion.div>
          </Link>
          <Link to="/pricing">
            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer">
              <Zap size={17} strokeWidth={1.8} className="text-gray-400" />
              <span className="text-sm font-medium">Upgrade Plan</span>
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* StorageCard — bytes converted to GB here */}
      <div className="px-3 pb-2">
        <StorageCard storage={storageForCard} />
      </div>

      {/* User profile */}
      <div className="px-3 pb-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-150 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{user?.name || 'User'}</p>
            <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">{user?.email || 'user@example.com'}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleLogout() }}
            title="Logout"
            className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-150"
          >
            <LogOut size={14} />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  )
}
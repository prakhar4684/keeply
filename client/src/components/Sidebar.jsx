import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Cloud, HardDrive, Clock, Share2, Trash2, Settings, LogOut, ChevronRight
} from 'lucide-react'
import StorageCard from './StorageCard'

// TODO: connect backend API - user, storage, onLogout from auth context
export default function Sidebar({ user, storage, onLogout, collapsed = false }) {
  const location = useLocation()

  const navItems = [
    { icon: HardDrive, label: 'My Drive', href: '/dashboard', badge: null },
    { icon: Clock, label: 'Recent', href: '/dashboard?view=recent', badge: null },
    { icon: Share2, label: 'Shared with me', href: '/dashboard?view=shared', badge: '3' },
    { icon: Trash2, label: 'Trash', href: '/trash', badge: null },
  ]

  const isActive = (href) => {
    const basePath = href.split('?')[0]
    return location.pathname === basePath && !location.search
      ? true
      : location.pathname + location.search === href
  }

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col h-full bg-white border-r border-gray-100 w-64 flex-shrink-0"
    >
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/30">
            <Cloud size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">
            Keeply <span className="text-emerald-600">☁️</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-2">
          Storage
        </p>
        {navItems.map((item) => {
          const active = item.href === '/dashboard'
            ? location.pathname === '/dashboard' && !location.search
            : location.pathname + location.search === item.href || location.pathname === item.href
          return (
            <Link key={item.label} to={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                  active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={18}
                    className={active ? 'text-emerald-600' : 'text-gray-500'}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}

        <div className="pt-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Account
          </p>
          <Link to="/pricing">
            <motion.div
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
            >
              <Settings size={18} className="text-gray-500" />
              <span className="text-sm font-medium">Settings</span>
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* Storage card */}
      <div className="p-3">
        <StorageCard storage={storage} />
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
          {/* TODO: connect backend API - logout action */}
          <button
            onClick={onLogout}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

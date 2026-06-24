import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Image, Film, Music, Archive, File, FileCode,
  MoreVertical, Download, Share2, Trash2,
} from 'lucide-react'

// TODO: connect backend API - onDownload, onShare, onDelete actions
const fileIconMap = {
  pdf:        { icon: FileText, color: 'text-red-500',    bg: 'bg-red-50' },
  image:      { icon: Image,    color: 'text-blue-500',   bg: 'bg-blue-50' },
  video:      { icon: Film,     color: 'text-purple-500', bg: 'bg-purple-50' },
  audio:      { icon: Music,    color: 'text-pink-500',   bg: 'bg-pink-50' },
  archive:    { icon: Archive,  color: 'text-amber-500',  bg: 'bg-amber-50' },
  excel:      { icon: FileText, color: 'text-green-600',  bg: 'bg-green-50' },
  word:       { icon: FileText, color: 'text-blue-600',   bg: 'bg-blue-50' },
  powerpoint: { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
  markdown:   { icon: FileCode, color: 'text-gray-600',   bg: 'bg-gray-100' },
  figma:      { icon: File,     color: 'text-purple-600', bg: 'bg-purple-50' },
  default:    { icon: File,     color: 'text-gray-500',   bg: 'bg-gray-100' },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function DropdownMenu({ actions, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -5 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-8 z-[100] w-44 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 overflow-hidden"
    >
      {actions.map((item) => (
        <button
          key={item.label}
          onMouseDown={(e) => { e.stopPropagation(); item.action() }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${item.color}`}
        >
          <item.icon size={15} />
          {item.label}
        </button>
      ))}
    </motion.div>
  )
}

export default function FileCard({
  file,
  viewMode = 'grid',
  onDownload,
  onShare,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const iconConfig = fileIconMap[file.type] || fileIconMap.default
  const Icon = iconConfig.icon

  const menuActions = [
    { icon: Download, label: 'Download',      action: () => { onDownload?.(file); setMenuOpen(false) }, color: 'text-gray-700' },
    { icon: Share2,   label: 'Share',         action: () => { onShare?.(file);    setMenuOpen(false) }, color: 'text-emerald-600' },
    { icon: Trash2,   label: 'Move to Trash', action: () => { onDelete?.(file);   setMenuOpen(false) }, color: 'text-red-500' },
  ]

  // ── List view ──────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ backgroundColor: 'rgba(5,150,105,0.03)' }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-emerald-100 transition-all cursor-pointer group relative"
      >
        <div className={`w-9 h-9 rounded-xl ${iconConfig.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className={iconConfig.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-400">{file.sizeFormatted}</p>
        </div>
        <span className="text-xs text-gray-400 hidden sm:block">{formatDate(file.updatedAt)}</span>
        {file.isShared && (
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium hidden sm:block">
            Shared
          </span>
        )}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all"
          >
            <MoreVertical size={16} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <DropdownMenu
                actions={menuActions}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // ── Grid view ──────────────────────────────────────────────────
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(5,150,105,0.1)' }}
      className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer group relative transition-all duration-200"
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-2xl ${iconConfig.bg} flex items-center justify-center mb-3`}>
        <Icon size={24} className={iconConfig.color} />
      </div>

      {/* Shared badge */}
      {file.isShared && (
        <span className="absolute top-3 right-10 text-xs bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
          Shared
        </span>
      )}

      {/* 3-dot menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
        >
          <MoreVertical size={15} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <DropdownMenu
              actions={menuActions}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>

      <p className="text-sm font-semibold text-gray-900 truncate pr-1">{file.name}</p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-gray-400">{file.sizeFormatted}</span>
        <span className="text-xs text-gray-400">{formatDate(file.updatedAt)}</span>
      </div>
    </motion.div>
  )
}

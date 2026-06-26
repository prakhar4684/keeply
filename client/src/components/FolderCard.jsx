import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Folder, MoreVertical, Pencil, Trash2, FolderOpen, Share2 } from 'lucide-react'

const colorMap = {
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100', hover: 'hover:border-emerald-200' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-100', hover: 'hover:border-blue-200' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-500', border: 'border-purple-100', hover: 'hover:border-purple-200' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500', border: 'border-orange-100', hover: 'hover:border-orange-200' },
  pink: { bg: 'bg-pink-50', icon: 'text-pink-500', border: 'border-pink-100', hover: 'hover:border-pink-200' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-500', border: 'border-teal-100', hover: 'hover:border-teal-200' },
  gray: { bg: 'bg-gray-50', icon: 'text-gray-500', border: 'border-gray-100', hover: 'hover:border-gray-200' },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function FolderDropdown({ actions, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClick)

    return () =>
      document.removeEventListener("mousedown", handleClick)

  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -5 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-8 z-[100] w-44 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((item) => (
        <button
          key={item.label}
          onClick={(e) => {

            e.preventDefault();

            e.stopPropagation();

            item.action();

          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${item.color}`}
        >
          <item.icon size={15} />
          {item.label}
        </button>
      ))}
    </motion.div>
  )
}

// TODO: connect backend API - onOpen, onRename, onShare, onDelete from folder actions
export default function FolderCard({ folder, onOpen, onRename, onShare, onDelete, viewMode = 'grid' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const colors = colorMap[folder.color] || colorMap.gray

  const menuActions = [
    { icon: FolderOpen, label: 'Open', action: () => { onOpen?.(folder); setMenuOpen(false) }, color: 'text-gray-700' },
    { icon: Share2, label: 'Share', action: () => { onShare?.(folder); setMenuOpen(false) }, color: 'text-emerald-600' },
    { icon: Pencil, label: 'Rename', action: () => { onRename?.(folder); setMenuOpen(false) }, color: 'text-gray-700' },
    { icon: Trash2, label: 'Delete', action: () => { onDelete?.(folder); setMenuOpen(false) }, color: 'text-red-500' },
  ]

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ backgroundColor: 'rgba(5,150,105,0.03)' }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-emerald-100 cursor-pointer group relative transition-all"
        onClick={(e) => {

  if (menuOpen) return;

  onOpen?.(folder);

}}
      >
        <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <Folder size={18} className={colors.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
          <p className="text-xs text-gray-400">{folder.filesCount} items</p>
        </div>
        <span className="text-xs text-gray-400 hidden sm:block">{formatDate(folder.updatedAt)}</span>
        <div className="relative">
          <button
            onClick={(e) => {

              e.preventDefault();

              e.stopPropagation();

              setMenuOpen(prev => !prev);

            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
          >
            <MoreVertical size={15} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <FolderDropdown
                actions={menuActions}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
      className={`bg-white border ${colors.border} ${colors.hover} rounded-2xl p-4 cursor-pointer group relative transition-all duration-200`}
      onClick={(e) => {

  if (menuOpen) return;

  onOpen?.(folder);

}}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Folder size={22} className={colors.icon} />
        </div>
        <div className="relative">
          <button
            onClick={(e) => {

              e.preventDefault();

              e.stopPropagation();

              setMenuOpen(prev => !prev);

            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
          >
            <MoreVertical size={15} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <FolderDropdown
                actions={menuActions}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-900 truncate">{folder.name}</p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-gray-400">{folder.filesCount} items</span>
        <span className="text-xs text-gray-400">{formatDate(folder.createdAt)}</span>
      </div>
    </motion.div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Upload, Search, Trash2 } from 'lucide-react'

const configs = {
  files: {
    icon: FolderOpen,
    title: 'No files yet',
    subtitle: 'Upload your first file to get started',
    color: 'emerald',
  },
  search: {
    icon: Search,
    title: 'No results found',
    subtitle: 'Try searching with different keywords',
    color: 'blue',
  },
  trash: {
    icon: Trash2,
    title: 'Trash is empty',
    subtitle: 'Deleted files will appear here for 30 days',
    color: 'gray',
  },
  shared: {
    icon: FolderOpen,
    title: 'Nothing shared yet',
    subtitle: 'Files shared with you will appear here',
    color: 'purple',
  },
}

const colorMap = {
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-400', btn: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-400', btn: 'bg-blue-600 text-white hover:bg-blue-700' },
  gray: { bg: 'bg-gray-50', icon: 'text-gray-400', btn: 'bg-gray-900 text-white hover:bg-gray-800' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-400', btn: 'bg-purple-600 text-white hover:bg-purple-700' },
}

export default function EmptyState({ type = 'files', onAction, actionLabel }) {
  const config = configs[type] || configs.files
  const colors = colorMap[config.color]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-20 h-20 rounded-3xl ${colors.bg} flex items-center justify-center mb-6 shadow-sm`}
      >
        <Icon size={36} className={colors.icon} />
      </motion.div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">{config.subtitle}</p>
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${colors.btn}`}
        >
          {type === 'files' && <Upload size={16} />}
          {actionLabel || 'Take Action'}
        </motion.button>
      )}
    </motion.div>
  )
}

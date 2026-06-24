import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

// TODO: connect backend API - storage from user storage API
export default function StorageCard({ storage }) {
  const used = storage?.used || 2.4
  const total = storage?.total || 50
  const percentage = Math.min((used / total) * 100, 100)
  const isNearLimit = percentage > 80

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Storage</p>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isNearLimit
            ? 'bg-amber-100 text-amber-700'
            : 'bg-emerald-100 text-emerald-700'
        }`}>
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          className={`h-full rounded-full ${
            isNearLimit
              ? 'bg-gradient-to-r from-amber-400 to-orange-500'
              : 'bg-gradient-to-r from-emerald-400 to-teal-500'
          }`}
        />
      </div>

      <p className="text-sm font-semibold text-gray-700">
        {used} GB{' '}
        <span className="font-normal text-gray-400">of {total} GB used</span>
      </p>

      <Link to="/pricing">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-sm"
        >
          <Zap size={13} />
          Upgrade Plan
        </motion.button>
      </Link>
    </div>
  )
}

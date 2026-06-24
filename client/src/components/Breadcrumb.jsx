import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'

// TODO: connect backend API - breadcrumb from folder navigation state
export default function Breadcrumb({ items = [] }) {
  const allItems = [
    { id: 'root', name: 'My Drive', path: '/dashboard' },
    ...items,
  ]

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1 flex-wrap"
    >
      {allItems.map((item, idx) => {
        const isLast = idx === allItems.length - 1
        return (
          <React.Fragment key={item.id}>
            {isLast ? (
              <span className="text-sm font-semibold text-gray-900 px-2 py-1">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-sm font-medium text-gray-400 hover:text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-all duration-150 flex items-center gap-1"
              >
                {idx === 0 && <Home size={13} />}
                {item.name}
              </Link>
            )}
            {!isLast && <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />}
          </React.Fragment>
        )
      })}
    </motion.nav>
  )
}

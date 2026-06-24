import React from 'react'
import { motion } from 'framer-motion'
import { Cloud } from 'lucide-react'

export function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-3" />
      <div className="h-4 bg-gray-100 rounded-lg mb-2" />
      <div className="h-3 bg-gray-50 rounded-lg w-2/3" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-9 h-9 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-gray-100 rounded-lg mb-1.5 w-2/3" />
        <div className="h-3 bg-gray-50 rounded-lg w-1/4" />
      </div>
      <div className="h-3 bg-gray-50 rounded-lg w-16" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-600/30"
      >
        <Cloud size={28} className="text-white" />
      </motion.div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8 animate-pulse">
        <div>
          <div className="h-7 bg-gray-100 rounded-xl w-48 mb-2" />
          <div className="h-4 bg-gray-50 rounded-lg w-32" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-100 rounded-xl w-32" />
          <div className="h-10 bg-gray-100 rounded-xl w-32" />
        </div>
      </div>
      {/* Folder grid skeleton */}
      <div className="h-4 bg-gray-100 rounded w-24 mb-4 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Files skeleton */}
      <div className="h-4 bg-gray-100 rounded w-24 mb-4 animate-pulse" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  )
}

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-gray-100 border-t-emerald-500 rounded-full"
      />
      <p className="text-sm text-gray-400 font-medium">{text}</p>
    </div>
  )
}

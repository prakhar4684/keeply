import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, X, Copy, CheckCircle2, Link2, Lock, Clock, Eye } from 'lucide-react'

// TODO: connect backend API
// Share flow:
// 1. POST /api/files/:id/share → get share token
// 2. Build share URL with token
// 3. GET /api/share/:token → public access without auth

export default function ShareModal({ isOpen, onClose, file }) {
  const [copied, setCopied] = useState(false)
  const [expiry, setExpiry] = useState('never')

  // TODO: replace with real share URL from backend API
  const shareUrl = file
    ? `https://keeply.app/s/${file.id.replace('file_', '')}_abc123`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (!isOpen || !file) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <Share2 size={18} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Share File</h2>
                <p className="text-xs text-gray-400">Generate a secure link</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* File Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                <Share2 size={18} className="text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{file.sizeFormatted}</p>
              </div>
            </div>

            {/* Share Link */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-2">
                Share Link
              </label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl min-w-0">
                  <Link2 size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate font-mono">{shareUrl}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                    copied
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/25'
                  }`}
                >
                  {copied ? (
                    <><CheckCircle2 size={15} /> Copied!</>
                  ) : (
                    <><Copy size={15} /> Copy</>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Expiry */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-2">
                Link Expiry
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['1h', '24h', '7d', '30d', 'never'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setExpiry(opt)}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                      expiry === opt
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                    }`}
                  >
                    {opt === 'never' ? '∞' : opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Info */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <Lock size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-800">Token-based secure sharing</p>
                <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                  Anyone with this link can view and download. Link uses temporary presigned URLs for secure access.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

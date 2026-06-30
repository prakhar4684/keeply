import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, RotateCcw, AlertTriangle, File, Folder,
  FileText, Image, Film, Music, Archive,
  Clock, Info, X, CheckCircle2, ShieldCheck, RefreshCw
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import EmptyState from '../components/EmptyState'
import {
  getTrash,
  restoreFile,
  restoreFolder,
  deleteFileForever,
  deleteFolderForever,
  emptyTrash,
} from '../services/trashService'
import { useAuth } from '../context/AuthContext'

const typeIconMap = {
  pdf: { icon: FileText, color: 'text-red-400', bg: 'bg-red-50' },
  word: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-50' },
  excel: { icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
  image: { icon: Image, color: 'text-purple-400', bg: 'bg-purple-50' },
  video: { icon: Film, color: 'text-pink-400', bg: 'bg-pink-50' },
  audio: { icon: Music, color: 'text-amber-400', bg: 'bg-amber-50' },
  archive: { icon: Archive, color: 'text-orange-400', bg: 'bg-orange-50' },
  folder: { icon: Folder, color: 'text-amber-500', bg: 'bg-amber-50' },
  illustrator: { icon: File, color: 'text-orange-500', bg: 'bg-orange-50' },
  default: { icon: File, color: 'text-gray-400', bg: 'bg-gray-100' },
}

function getIcon(type) {
  return typeIconMap[type] || typeIconMap.default
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntilPermanentDelete(dateStr) {
  const deleted = new Date(dateStr)
  const expiry = new Date(deleted.getTime() + 10 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const diff = Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)))
  return diff
}

function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, dangerous = false }) {
  if (!isOpen) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
            dangerous ? 'bg-red-50' : 'bg-amber-50'
          }`}>
            <AlertTriangle size={26} className={dangerous ? 'text-red-500' : 'text-amber-500'} />
          </div>
          <h3 className="text-lg font-black text-gray-900 text-center mb-2">{title}</h3>
          <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                dangerous
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {dangerous ? 'Delete Forever' : 'Confirm'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function TrashItem({ item, onRestore, onDelete }) {
  const { icon: Icon, color, bg } = getIcon(item.type)
  const daysLeft = daysUntilPermanentDelete(item.deletedAt)
  const isExpiringSoon = daysLeft <= 5

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                From: <span className="text-gray-600">{item.originalPath}</span>
              </p>
            </div>

            <span className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isExpiringSoon
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-gray-50 text-gray-500 border border-gray-100'
            }`}>
              <Clock size={11} />
              {daysLeft}d left
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-400">
              Deleted {formatDate(item.deletedAt)}
            </span>
            {item.itemType === 'folder' && item.filesCount > 0 && (
              <span className="text-xs text-gray-400">· {item.filesCount} files inside</span>
            )}
            {item.sizeFormatted !== '—' && (
              <span className="text-xs text-gray-400">· {item.sizeFormatted}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 ml-[60px]">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onRestore(item)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all border border-emerald-100"
        >
          <RotateCcw size={13} />
          Restore
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onDelete(item)}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all border border-red-100"
        >
          <Trash2 size={13} />
          Delete Forever
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Trash() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState({ open: false, type: null, item: null })
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000)
  }

  const normalizeItems = (files, folders) => {
    const normalizedFiles = files.map(f => ({
      ...f,
      id: f._id,
      itemType: 'file',
    }))
    const normalizedFolders = folders.map(f => ({
      ...f,
      id: f._id,
      itemType: 'folder',
      type: 'folder',
    }))
    return [...normalizedFiles, ...normalizedFolders]
  }

  const loadTrash = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTrash()
      setItems(normalizeItems(data.files, data.folders))
    } catch (error) {
      showToast('Failed to load trash. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load + auto-refresh triggers:
  // 1. Window regains focus (user switched tabs/apps and came back)
  // 2. Tab becomes visible again (covers some browsers focus doesn't catch)
  // 3. Custom 'trash-updated' event — dispatch this from anywhere in the
  //    app right after a file/folder is moved to trash, so this page
  //    updates instantly without waiting for focus/visibility/manual refresh.
  useEffect(() => {
    loadTrash()

    const handleFocus = () => loadTrash()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadTrash()
      }
    }

    const handleTrashUpdate = () => loadTrash()

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('trash-updated', handleTrashUpdate)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('trash-updated', handleTrashUpdate)
    }
  }, [loadTrash])

  const handleRestore = async (item) => {
    try {
      if (item.itemType === 'file') {
        await restoreFile(item.id)
      } else {
        await restoreFolder(item.id)
      }
      await loadTrash()
      showToast(`"${item.name}" restored successfully.`, 'success')
    } catch (error) {
      showToast(`Failed to restore "${item.name}". Please try again.`, 'error')
    }
  }

  const handlePermanentDelete = async (item) => {
    try {
      if (item.itemType === 'file') {
        await deleteFileForever(item.id)
      } else {
        await deleteFolderForever(item.id)
      }
      await loadTrash()
      showToast(`"${item.name}" permanently deleted.`, 'error')
      setConfirm({ open: false, type: null, item: null })
    } catch (error) {
      showToast(`Failed to delete "${item.name}". Please try again.`, 'error')
      setConfirm({ open: false, type: null, item: null })
    }
  }

  const handleEmptyAll = async () => {
    try {
      await emptyTrash()
      await loadTrash()
      showToast('Trash emptied. All files permanently deleted.', 'error')
      setConfirm({ open: false, type: null, item: null })
    } catch (error) {
      showToast('Failed to empty trash. Please try again.', 'error')
      setConfirm({ open: false, type: null, item: null })
    }
  }

  const totalSize = items
    .filter(i => i.itemType === 'file' && i.size)
    .reduce((acc, i) => acc + i.size, 0)

  const formatTotalSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar
          user={user}
          activeSection="trash"
          onNavigate={(section) => navigate('/dashboard', { state: { section } })}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900">Trash</h1>
              <p className="text-xs text-gray-400">
                {items.length} item{items.length !== 1 ? 's' : ''} · Files deleted over 10 days are removed automatically
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadTrash}
              disabled={loading}
              className="flex items-center justify-center w-9 h-9 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-all border border-gray-100 disabled:opacity-50"
              title="Refresh trash"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </motion.button>

            {items.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setConfirm({ open: true, type: 'empty', item: null })}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-xl transition-all border border-red-100"
              >
                <Trash2 size={15} />
                Empty Trash
              </motion.button>
            )}
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">

          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-6"
            >
              <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Files are permanently deleted after 10 days</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Trash contains {items.length} item{items.length !== 1 ? 's' : ''} ({formatTotalSize(totalSize)}). Restore anything you need before it's gone.
                </p>
              </div>
            </motion.div>
          )}

          {items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Items', value: items.length, color: 'text-gray-900', bg: 'bg-white', icon: Trash2, iconColor: 'text-gray-400' },
                { label: 'Files', value: items.filter(i => i.itemType === 'file').length, color: 'text-blue-700', bg: 'bg-blue-50', icon: File, iconColor: 'text-blue-400' },
                { label: 'Folders', value: items.filter(i => i.itemType === 'folder').length, color: 'text-amber-700', bg: 'bg-amber-50', icon: Folder, iconColor: 'text-amber-400' },
                { label: 'Expiring Soon', value: items.filter(i => daysUntilPermanentDelete(i.deletedAt) <= 5).length, color: 'text-red-700', bg: 'bg-red-50', icon: Clock, iconColor: 'text-red-400' },
              ].map(stat => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`${stat.bg} border border-gray-100 rounded-2xl p-4 flex items-center gap-3`}
                >
                  <stat.icon size={18} className={stat.iconColor} />
                  <div>
                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-red-400 rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <EmptyState type="trash" />
          ) : (
            <>
              {items.some(i => daysUntilPermanentDelete(i.deletedAt) <= 5) && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle size={13} />
                    Expiring Soon (≤ 5 days left)
                  </h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {items
                        .filter(i => daysUntilPermanentDelete(i.deletedAt) <= 5)
                        .map(item => (
                          <TrashItem
                            key={item.id}
                            item={item}
                            onRestore={handleRestore}
                            onDelete={(i) => setConfirm({ open: true, type: 'single', item: i })}
                          />
                        ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {items.some(i => daysUntilPermanentDelete(i.deletedAt) > 5) && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    All Deleted Items
                  </h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {items
                        .filter(i => daysUntilPermanentDelete(i.deletedAt) > 5)
                        .map(item => (
                          <TrashItem
                            key={item.id}
                            item={item}
                            onRestore={handleRestore}
                            onDelete={(i) => setConfirm({ open: true, type: 'single', item: i })}
                          />
                        ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400"
          >
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Permanently deleted files are removed from AWS S3 and cannot be recovered.</span>
          </motion.div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        dangerous={true}
        title={confirm.type === 'empty' ? 'Empty Trash?' : 'Delete Forever?'}
        message={
          confirm.type === 'empty'
            ? `This will permanently delete all ${items.length} items. This action cannot be undone.`
            : `"${confirm.item?.name}" will be permanently deleted from AWS S3. This cannot be undone.`
        }
        onConfirm={() => {
          if (confirm.type === 'empty') handleEmptyAll()
          else handlePermanentDelete(confirm.item)
        }}
        onCancel={() => setConfirm({ open: false, type: null, item: null })}
      />

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl z-[60] text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-900 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={17} />
            ) : (
              <Trash2 size={17} className="text-red-300" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
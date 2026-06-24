import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FolderPlus, Grid, List, ChevronDown,
  Bell, LayoutGrid, Rows3, X, Plus, Menu
} from 'lucide-react'
import  {getDashboardStats }
  from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import Sidebar from '../components/Sidebar'
import SearchBar from '../components/SearchBar'
import Breadcrumb from '../components/Breadcrumb'
import FolderCard from '../components/FolderCard'
import FileCard from '../components/FileCard'
import UploadModal from '../components/UploadModal'
import ShareModal from '../components/ShareModal'
import EmptyState from '../components/EmptyState'
import UserMenu from '../components/UserMenu'
import { DashboardSkeleton } from '../components/Loader'

import {
  dummyFiles,
  dummyFolders,
} from '../data/dummyData'


// ─── New Folder Modal ────────────────────────────────────────────
function NewFolderModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('emerald')

  const colors = ['emerald', 'blue', 'purple', 'orange', 'pink', 'teal']
  const colorDots = {
    emerald: 'bg-emerald-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    orange: 'bg-orange-400',
    pink: 'bg-pink-400',
    teal: 'bg-teal-400',
  }

  const handleCreate = () => {
    if (!name.trim()) return
    // TODO: connect backend API - POST /api/folders { name, color, parentId }
    onCreate?.({ name: name.trim(), color })
    setName('')
    setColor('emerald')
    onClose()
  }

  if (!isOpen) return null

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
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ duration: 0.22 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">New Folder</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all">
              <X size={17} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Folder name
              </label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="e.g. Projects, Documents…"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${colorDots[c]} transition-all ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: name.trim() ? 1.02 : 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
              disabled={!name.trim()}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${name.trim()
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              Create Folder
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const [viewMode, setViewMode] = useState('grid')          // 'grid' | 'list'
  const [activeSection, setActiveSection] = useState('home') // 'home' | 'recent' | 'shared'
  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareModal, setShareModal] = useState({ open: false, file: null })
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [folders, setFolders] = useState(dummyFolders)
  const [files] = useState(dummyFiles)
  const [sidebarOpen, setSidebarOpen] = useState(false)
const [loading,setLoading] = useState(true)
  const { user } = useAuth()

  const [stats, setStats] = useState(null);


  useEffect(() => {


    const loadStats = async () => {


      try {


        const data =
          await getDashboardStats();


        setStats(data);


      }
      catch (error) {


        console.log(error);


      }
      finally {


        setLoading(false);


      }


    };


    loadStats();


}, []);
  // TODO: connect backend API - fetch from /api/folders and /api/files
  const handleCreateFolder = (data) => {
    const newFolder = {
      id: `folder_${Date.now()}`,
      name: data.name,
      color: data.color,
      parentId: null,
      filesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setFolders(prev => [newFolder, ...prev])
  }

  // TODO: connect backend API - DELETE /api/folders/:id
  const handleFolderDelete = (folder) => {
    setFolders(prev => prev.filter(f => f.id !== folder.id))
  }

  // TODO: connect backend API - POST /api/folders/:id/share
  const handleFolderShare = (folder) => {
    // Folder share — treat like a file object for the ShareModal
    setShareModal({
      open: true,
      file: {
        id: folder.id,
        name: folder.name,
        sizeFormatted: `${folder.filesCount} items`,
        type: 'folder',
      },
    })
  }

  // TODO: connect backend API - GET /api/files/:id/download (presigned URL)
  const handleFileDownload = (file) => {
    alert(`Download flow: fetch presigned URL for "${file.name}" from backend.`)
  }

  // TODO: connect backend API - POST /api/files/:id/share
  const handleFileShare = (file) => {
    setShareModal({ open: true, file })
  }

  // TODO: connect backend API - DELETE /api/files/:id (move to trash)
  const handleFileDelete = (file) => {
    alert(`"${file.name}" moved to trash.`)
  }

  const pageVariants = {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
  }

  const filteredFiles = activeSection === 'shared'
    ? files.filter(f => f.isShared)
    : files

  const breadcrumbItems = activeSection === 'home' ? [] : [
    { id: activeSection, name: activeSection === 'recent' ? 'Recent' : 'Shared with me', path: `/dashboard?view=${activeSection}` }
  ]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Mobile sidebar overlay ── */}
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

      {/* ── Sidebar ── */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          user={user}
        />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top bar ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center gap-3 flex-shrink-0 z-30"
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1">
            <SearchBar placeholder="Search files, folders…" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setNewFolderOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <FolderPlus size={16} className="text-gray-500" />
              New Folder
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/25"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Upload</span>
            </motion.button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0 cursor-pointer">
              <UserMenu />
            </div>
          </div>
        </motion.header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-5">

            {/* Breadcrumb + view toggle */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <div className="flex items-center gap-2">
                {/* Section tabs */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
                  {[
                    { key: 'home', label: 'My Drive' },
                    { key: 'recent', label: 'Recent' },
                    { key: 'shared', label: 'Shared' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveSection(tab.key)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeSection === tab.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Grid/List toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Rows3 size={15} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <DashboardSkeleton />
            ) : (
              <motion.div
                key={activeSection}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
              >

                {/* ── FOLDERS section ── */}
                {activeSection === 'home' && (
                  <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-400 rounded-full" />
                        Folders
                        <span className="text-gray-400 font-normal">({folders.length})</span>
                      </h2>
                      <button
                        onClick={() => setNewFolderOpen(true)}
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Plus size={13} /> New
                      </button>
                    </div>

                    {folders.length === 0 ? (
                      <EmptyState type="files" onAction={() => setNewFolderOpen(true)} actionLabel="Create Folder" />
                    ) : viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                        {/* New folder quick-add card */}
                        <motion.button
                          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(5,150,105,0.1)' }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setNewFolderOpen(true)}
                          className="bg-white border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-emerald-600 transition-all min-h-[100px] cursor-pointer"
                        >
                          <Plus size={22} />
                          <span className="text-xs font-semibold">New Folder</span>
                        </motion.button>
                        {folders.map((folder, i) => (
                          <motion.div
                            key={folder.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <FolderCard
                              folder={folder}
                              viewMode="grid"
                              onOpen={(f) => alert(`Opening folder: ${f.name}`)}
                              onRename={(f) => alert(`Rename: ${f.name}`)}
                              onShare={handleFolderShare}
                              onDelete={handleFolderDelete}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {folders.map((folder, i) => (
                          <motion.div
                            key={folder.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <FolderCard
                              folder={folder}
                              viewMode="list"
                              onOpen={(f) => alert(`Opening folder: ${f.name}`)}
                              onRename={(f) => alert(`Rename: ${f.name}`)}
                              onShare={handleFolderShare}
                              onDelete={handleFolderDelete}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* ── FILES section ── */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                      {activeSection === 'shared' ? 'Shared Files' : 'Files'}
                      <span className="text-gray-400 font-normal">({filteredFiles.length})</span>
                    </h2>
                    <button
                      onClick={() => setUploadOpen(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Upload size={13} /> Upload
                    </button>
                  </div>

                  {filteredFiles.length === 0 ? (
                    <EmptyState
                      type={activeSection === 'shared' ? 'shared' : 'files'}
                      onAction={activeSection !== 'shared' ? () => setUploadOpen(true) : undefined}
                      actionLabel="Upload File"
                    />
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                      {filteredFiles.map((file, i) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, scale: 0.93 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <FileCard
                            file={file}
                            viewMode="grid"
                            onDownload={handleFileDownload}
                            onShare={handleFileShare}
                            onDelete={handleFileDelete}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      {/* List header */}
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                        <div className="w-9 flex-shrink-0" />
                        <span className="flex-1 text-xs font-semibold text-gray-500">Name</span>
                        <span className="text-xs font-semibold text-gray-500 hidden sm:block w-24 text-right">Modified</span>
                        <span className="text-xs font-semibold text-gray-500 w-8" />
                      </div>
                      {filteredFiles.map((file, i) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-gray-50 last:border-0"
                        >
                          <FileCard
                            file={file}
                            viewMode="list"
                            onDownload={handleFileDownload}
                            onShare={handleFileShare}
                            onDelete={handleFileDelete}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </section>

                {/* ── Recent activity strip ── */}
                {activeSection === 'home' && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6"
                  >
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      Storage Overview
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        {
                          label: 'Total Files',

                          value: stats?.totalFiles || 0,

                          color: 'text-blue-600',

                          bg: 'bg-blue-50'
                        },


                        {
                          label: 'Folders',

                          value: stats?.totalFolders || 0,

                          color: 'text-amber-600',

                          bg: 'bg-amber-50'
                        },


                        {
                          label: 'Storage Used',

                          value:
                            (
                              (stats?.usedStorage || 0)
                              /
                              (1024 * 1024 * 1024)

                            ).toFixed(2)
                            +
                            " GB",

                          color: 'text-emerald-600',

                          bg: 'bg-emerald-50'
                        },


                        {
                          label: 'Plan',

                          value: stats?.plan || "FREE",

                          color: 'text-purple-600',

                          bg: 'bg-purple-50'
                        }
                      ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 text-center`}>
                          <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadComplete={() => {
          setUploadOpen(false)
          // TODO: connect backend API - refresh file list after upload
        }}
      />

      <ShareModal
        isOpen={shareModal.open}
        file={shareModal.file}
        onClose={() => setShareModal({ open: false, file: null })}
      />

      <NewFolderModal
        isOpen={newFolderOpen}
        onClose={() => setNewFolderOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  )
}

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from "react-hot-toast"
import {
  Upload, FolderPlus, Grid, List, ChevronDown,
  Bell, LayoutGrid, Rows3, X, Plus, Menu,
  ArrowLeft
} from 'lucide-react'
import RenameFileModal from "../components/RenameFileModal"
import { getDashboardStats } from "../services/dashboardService"
import { useAuth } from "../context/AuthContext"
import Sidebar from '../components/Sidebar'
import SearchBar from '../components/SearchBar'
import Breadcrumb from '../components/Breadcrumb'
import FolderCard from '../components/FolderCard'
import FileCard from '../components/FileCard'
import UploadModal from '../components/UploadModal'
import RenameFolderModal from '../components/RenameFolderModal'
import DeleteFolderModal from '../components/DeleteFolderModal'
import { createShareLink } from "../services/shareService"
import ShareModal from '../components/ShareModal'
import EmptyState from '../components/EmptyState'
import UserMenu from '../components/UserMenu'
import { DashboardSkeleton } from '../components/Loader'
import { getFolders, createFolder } from "../services/folderService"
import { getFiles, getFile, deleteFile } from "../services/fileService"


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
                    className={`w-8 h-8 rounded-full ${colorDots[c]} transition-all ${
                      color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
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
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                name.trim()
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
  const navigate = useNavigate()
  const location = useLocation()
  const [viewMode, setViewMode] = useState('grid')
  const [activeSection, setActiveSection] = useState(location.state?.section || 'home')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareModal, setShareModal] = useState({ open: false, file: null })
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [renameModal, setRenameModal] = useState({ open: false, folder: null })
  const [files, setFiles] = useState([])
  const [deleteModal, setDeleteModal] = useState({ open: false, folder: null })
  const [newMenuOpen, setNewMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [folders, setFolders] = useState([])
  const [currentFolder, setCurrentFolder] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [folderPath, setFolderPath] = useState([])
  const [stats, setStats] = useState(null)
  const [renameFileOpen, setRenameFileOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  // ── storage object in bytes — single source of truth from Dashboard API ──
  // Both Sidebar and UserMenu receive this same object
  const storage = {
    used:  stats?.usedStorage  ?? 0,   // bytes
    total: stats?.storageLimit ?? 0,   // bytes
  }

  const handleSidebarNavigate = useCallback((section) => {
    if (section === 'trash') {
      navigate('/trash')
      return
    }
    setActiveSection(section)
    setCurrentFolder(null)
    setFolderPath([])
    setSidebarOpen(false)
  }, [navigate])

  const handleBackFolder = () => {
    if (folderPath.length === 0) return
    const newPath = folderPath.slice(0, -1)
    setFolderPath(newPath)
    const previousFolder = newPath[newPath.length - 1]
    setCurrentFolder(previousFolder ? previousFolder.id : null)
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  useEffect(() => {
    if (activeSection !== 'home') return
    const loadFolders = async () => {
      try {
        const data = await getFolders(currentFolder)
        setFolders(data)
      } catch (error) {
        console.log(error)
      }
    }
    loadFolders()
  }, [currentFolder, activeSection])

  const loadFiles = useCallback(async () => {
    try {
      let data
      switch (activeSection) {
        case 'recent':
          data = await getRecentFiles()
          break
        case 'shared':
          data = await getSharedFiles()
          break
        default:
          data = await getFiles(currentFolder)
      }
      setFiles(data)
    } catch (error) {
      console.log(error)
    }
  }, [activeSection, currentFolder])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const handleCreateFolder = async (data) => {
    try {
      const folder = await createFolder({ name: data.name, parentId: currentFolder })
      setFolders(prev => [folder, ...prev])
    } catch (error) {
      console.log(error)
    }
  }

  const handleFolderDelete = async (folder) => {
    setDeleteModal({ open: true, folder })
  }

  const handleFolderShare = (folder) => {
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

  const handleFolderRename = async (folder) => {
    setRenameModal({ open: true, folder })
  }

  const handleFileOpen = async (file) => {
    try {
      const data = await getFile(file.id)
      const url = data.downloadUrl
      if (
        file.mimeType.startsWith("image/") ||
        file.mimeType === "application/pdf" ||
        file.mimeType.startsWith("video/") ||
        file.mimeType.startsWith("audio/")
      ) {
        window.open(url, "_blank")
        return
      }
      const link = document.createElement("a")
      link.href = url
      link.download = file.originalName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.log(error)
      toast.error("Unable to open file")
    }
  }

  const handleFileDownload = async (file) => {
    try {
      const data = await getFile(file.id)
      window.open(data.downloadUrl, "_blank")
    } catch (error) {
      console.log(error)
      toast.error("Download failed")
    }
  }

  const handleFileDelete = async (file) => {
    try {
      await deleteFile(file.id)
      setFiles(prev => prev.filter(f => f.id !== file.id))
      toast.success("File moved to trash")
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete file")
    }
  }

  const handleFileShare = async (file) => {
    try {
      const data = await createShareLink(file.id)
      await navigator.clipboard.writeText(data.shareLink)
      toast.success("Share link copied to clipboard")
    } catch (error) {
      console.log(error)
      toast.error("Failed to create share link")
    }
  }

  const handleFileRename = (file) => {
    setSelectedFile(file)
    setRenameFileOpen(true)
  }

  const pageVariants = {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
  }

  const filteredFiles = files
  const breadcrumbItems = [{ id: null, name: "My Drive" }, ...folderPath]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile sidebar overlay */}
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

      {/* Sidebar — storage prop in bytes */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          user={user}
          storage={storage}
          activeSection={activeSection}
          onNavigate={handleSidebarNavigate}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center gap-3 flex-shrink-0 z-30"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">
            <SearchBar
              placeholder="Search files, folders…"
              onSelectFolder={(folder) => {
                setActiveSection('home')
                setCurrentFolder(folder.id)
                setFolderPath(prev => [...prev, folder])
              }}
              onSelectFile={(file) => {
                handleFileOpen(file.raw)
              }}
            />
          </div>

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

            {/* UserMenu — storage prop in bytes */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0 cursor-pointer">
              <UserMenu storage={storage} />
            </div>
          </div>
        </motion.header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-5">

            {/* Breadcrumb + view toggle */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {folderPath.length > 0 && (
                  <button
                    onClick={handleBackFolder}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <Breadcrumb
                  items={breadcrumbItems}
                  onNavigate={(folder, index) => {
                    if (folder.id === null) {
                      setFolderPath([])
                      setCurrentFolder(null)
                      return
                    }
                    setFolderPath(folderPath.slice(0, index))
                    setCurrentFolder(folder.id)
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
                  {[{ key: 'home', label: 'My Drive' }].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveSection(tab.key)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeSection === tab.key
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

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

                {/* FOLDERS section */}
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
                      <EmptyState
                        type="files"
                        onCreateFolder={() => setNewFolderOpen(true)}
                        onUploadFile={() => setUploadOpen(true)}
                      />
                    ) : viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
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
                            key={folder.id || i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <FolderCard
                              folder={folder}
                              viewMode="grid"
                              onOpen={(f) => {
                                setFolderPath(prev => [...prev, f])
                                setCurrentFolder(f.id)
                              }}
                              onRename={handleFolderRename}
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
                              onOpen={(f) => {
                                setFolderPath(prev => [...prev, f])
                                setCurrentFolder(f.id)
                              }}
                              onRename={handleFolderRename}
                              onShare={handleFolderShare}
                              onDelete={handleFolderDelete}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* FILES section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                      {activeSection === "shared" ? "Shared Files" : "Files"}
                      <span className="text-gray-400 font-normal">({filteredFiles.length})</span>
                    </h2>
                    <button
                      onClick={() => setUploadOpen(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Upload size={13} />
                      Upload
                    </button>
                  </div>

                  {filteredFiles.length === 0 ? (
                    <EmptyState
                      type={activeSection === "shared" ? "shared" : "files"}
                      onCreateFolder={() => setNewFolderOpen(true)}
                      onUploadFile={() => setUploadOpen(true)}
                    />
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                      <motion.button
                        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(16,185,129,.10)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setUploadOpen(true)}
                        className="bg-white border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-emerald-600 transition-all min-h-[150px] cursor-pointer"
                      >
                        <Upload size={24} />
                        <span className="text-sm font-semibold">New File</span>
                        <span className="text-xs text-gray-400">Upload anything</span>
                      </motion.button>

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
                            onOpen={handleFileOpen}
                            onDownload={handleFileDownload}
                            onRename={handleFileRename}
                            onShare={handleFileShare}
                            onDelete={handleFileDelete}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
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
                            onOpen={handleFileOpen}
                            onDownload={handleFileDownload}
                            onRename={handleFileRename}
                            onShare={handleFileShare}
                            onDelete={handleFileDelete}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Storage Overview */}
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
                        { label: 'Total Files',   value: stats?.totalFiles ?? 0,   color: 'text-blue-600',   bg: 'bg-blue-50' },
                        { label: 'Folders',       value: stats?.totalFolders ?? 0, color: 'text-amber-600',  bg: 'bg-amber-50' },
                        {
                          label: 'Storage Used',
                          value: (() => {
                            const mb = (stats?.usedStorage ?? 0) / (1024 * 1024)
                            return mb >= 1024
                              ? `${(mb / 1024).toFixed(2)} GB`
                              : `${mb.toFixed(2)} MB`
                          })(),
                          color: 'text-emerald-600',
                          bg: 'bg-emerald-50'
                        },
                        { label: 'Plan',          value: stats?.plan ?? 'FREE',    color: 'text-purple-600', bg: 'bg-purple-50' },
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

      {/* Modals */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        folderId={currentFolder}
        onUploadComplete={() => {
          loadFiles()
          setUploadOpen(false)
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

      <RenameFolderModal
        isOpen={renameModal.open}
        folder={renameModal.folder}
        folders={folders}
        setFolders={setFolders}
        onClose={() => setRenameModal({ open: false, folder: null })}
      />

      <DeleteFolderModal
        isOpen={deleteModal.open}
        folder={deleteModal.folder}
        folders={folders}
        setFolders={setFolders}
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
        folderPath={folderPath}
        setFolderPath={setFolderPath}
        onClose={() => setDeleteModal({ open: false, folder: null })}
      />

      <RenameFileModal
        isOpen={renameFileOpen}
        file={selectedFile}
        files={files}
        setFiles={setFiles}
        onClose={() => {
          setRenameFileOpen(false)
          setSelectedFile(null)
        }}
      />

      <Toaster position="top-right" />
    </div>
  )
}
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, File, Folder, X, ArrowRight, Loader2, AlertTriangle } from 'lucide-react'
import { searchAll } from '../services/searchService'

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Normalize backend docs (Mongo shape: _id, originalName, size…) into the UI shape ──
function normalizeResults(data) {
  const files = (data?.files || []).map(f => ({
    id: f._id || f.id,
    name: f.originalName || f.name || 'Untitled',
    sizeFormatted: f.sizeFormatted || formatSize(f.size),
    raw: f,
  }))

  const folders = (data?.folders || []).map(f => ({
    id: f._id || f.id,
    name: f.name || 'Untitled',
    filesCount: f.filesCount ?? f.itemsCount ?? 0,
    raw: f,
  }))

  return { files, folders }
}

// `onSelectFile` / `onSelectFolder` let the parent (e.g. Dashboard) decide what
// happens on click — open the file, navigate into the folder, etc.
export default function SearchBar({
  placeholder = 'Search files and folders...',
  onSelectFile,
  onSelectFolder,
}) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState({ files: [], folders: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const debounceRef = useRef(null)

  // ── FIX: debounced real backend search instead of filtering dummy data ──
  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < 1) {
      setResults({ files: [], folders: [] })
      setLoading(false)
      setError('')
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        setError('')
        const data = await searchAll(trimmed)
        setResults(normalizeResults(data))
      } catch (err) {
        setError('Search failed. Please try again.')
        setResults({ files: [], folders: [] })
      } finally {
        setLoading(false)
      }
    }, 350) // debounce delay

    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasResults = results.files.length > 0 || results.folders.length > 0
  const showDropdown = focused && query.length > 0

  const handleFolderClick = (folder) => {
    onSelectFolder?.(folder)
    setFocused(false)
  }

  const handleFileClick = (file) => {
    onSelectFile?.(file)
    setFocused(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 bg-white ${
        focused
          ? 'border-emerald-400 shadow-lg shadow-emerald-100 ring-2 ring-emerald-100'
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        {loading ? (
          <Loader2 size={17} className="text-emerald-500 animate-spin" />
        ) : (
          <Search size={17} className={focused ? 'text-emerald-500' : 'text-gray-400'} />
        )}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="p-0.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={15} />
          </button>
        )}
        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-gray-300 font-mono">
          <span className="px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px]">⌘</span>
          <span className="px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px]">K</span>
        </kbd>
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {error ? (
              <div className="px-4 py-8 text-center">
                <AlertTriangle size={24} className="text-red-300 mx-auto mb-2" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : loading ? (
              <div className="px-4 py-8 text-center">
                <Loader2 size={24} className="text-emerald-400 mx-auto mb-2 animate-spin" />
                <p className="text-sm text-gray-400">Searching…</p>
              </div>
            ) : !hasResults ? (
              <div className="px-4 py-8 text-center">
                <Search size={28} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No results for "<span className="font-medium text-gray-700">{query}</span>"</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
              </div>
            ) : (
              <div className="py-2">
                {results.folders.length > 0 && (
                  <div>
                    <p className="px-4 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Folders
                    </p>
                    {results.folders.map((folder) => (
                      <motion.button
                        key={folder.id}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleFolderClick(folder)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      >
                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Folder size={16} className="text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
                          <p className="text-xs text-gray-400">{folder.filesCount} items</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                )}
                {results.files.length > 0 && (
                  <div>
                    <p className="px-4 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Files
                    </p>
                    {results.files.map((file) => (
                      <motion.button
                        key={file.id}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleFileClick(file)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <File size={16} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{file.sizeFormatted}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
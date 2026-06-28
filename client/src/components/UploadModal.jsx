import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, File, CheckCircle2, AlertCircle, Cloud, Loader2 } from 'lucide-react'
import {
    generateUploadUrl,
    uploadFileToS3,
    completeUpload
} from "../services/fileService";
import { toast } from "react-hot-toast";

// TODO: connect backend API
// Upload flow:
// 1. POST /api/files/upload-url → get presigned S3 URL
// 2. PUT presignedUrl → upload directly to AWS S3
// 3. POST /api/files/save-metadata → save file record in DB

export default function UploadModal({ isOpen, onClose, onUploadComplete, folderId = null }) {
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState([])
  const [uploadState, setUploadState] = useState('idle') // idle | uploading | success | error
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleFiles = useCallback((incoming) => {
    const fileList = Array.from(incoming).map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      name: f.name,
      size: f.size,
      sizeFormatted: formatSize(f.size),
      type: f.type,
      status: 'pending',
    }))
    setFiles(fileList)
  }, [])

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  // TODO: connect backend API - simulate upload; replace with real S3 flow
  const handleUpload = async () => {

    if (!files.length) return;

    try {

        setUploadState("uploading");

        setProgress(0);

        for (let i = 0; i < files.length; i++) {

            const current = files[i].file;

            // 1. Generate Upload URL

            const { uploadUrl, s3Key } = await generateUploadUrl({

                fileName: current.name,

                mimeType: current.type,

                size: current.size,

                folderId

            });

            // 2. Upload to AWS S3

            await uploadFileToS3(

                uploadUrl,

                current

            );

            // 3. Save Metadata

            await completeUpload({

                originalName: current.name,

                fileName: current.name,

                mimeType: current.type,

                size: current.size,

                s3Key,

                folderId

            });

            // Progress

            setProgress(

                Math.round(

                    ((i + 1) / files.length) * 100

                )

            );

        }

        setUploadState("success");

        toast.success("Files uploaded successfully");

        onUploadComplete?.();

        setTimeout(() => {

            handleClose();

        }, 1200);

    }

    catch (error) {

        console.log(error);

        toast.error(

            error?.response?.data?.message ||

            "Upload failed"

        );

        setUploadState("idle");

        setProgress(0);

    }

};

  const handleClose = () => {
    setFiles([])
    setUploadState('idle')
    setProgress(0)
    onClose()
  }

  const removeFile = (id) => setFiles(f => f.filter(x => x.id !== id))

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Upload size={18} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Upload Files</h2>
                <p className="text-xs text-gray-500">Files go to {folderId ? 'current folder' : 'My Drive'}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {/* Success State */}
            {uploadState === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Complete!</h3>
                <p className="text-sm text-gray-500">
                  {files.length} file{files.length > 1 ? 's' : ''} uploaded successfully.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Drop Zone */}
                <motion.div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  animate={{ borderColor: dragOver ? '#059669' : '#e5e7eb', backgroundColor: dragOver ? '#ecfdf5' : '#fafafa' }}
                  className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <motion.div
                    animate={{ y: dragOver ? -5 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Cloud size={26} className="text-emerald-500" />
                  </motion.div>
                  <p className="text-sm font-semibold text-gray-700">
                    {dragOver ? 'Drop files here!' : 'Drag & drop files here'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                  <p className="text-xs text-gray-300 mt-3">Any file type • Max 500 MB per file</p>
                </motion.div>

                {/* File List */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-2 max-h-48 overflow-y-auto"
                    >
                      {files.map((f) => (
                        <motion.div
                          key={f.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <File size={15} className="text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                            <p className="text-xs text-gray-400">{f.sizeFormatted}</p>
                          </div>
                          {uploadState === 'uploading' ? (
                            <Loader2 size={15} className="text-emerald-500 animate-spin flex-shrink-0" />
                          ) : (
                            <button
                              onClick={() => removeFile(f.id)}
                              className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors flex-shrink-0"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Progress */}
                {uploadState === 'uploading' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-600">Uploading to AWS S3...</span>
                      <span className="text-xs font-bold text-emerald-600">{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {uploadState !== 'success' && (
            <div className="px-6 pb-6 flex items-center gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: files.length > 0 && uploadState !== 'uploading' ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={!files.length || uploadState === 'uploading'}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  files.length > 0 && uploadState !== 'uploading'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {uploadState === 'uploading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                ) : (
                  <><Upload size={16} /> Upload {files.length > 0 ? `${files.length} File${files.length > 1 ? 's' : ''}` : 'Files'}</>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================
// KEEPLY DUMMY DATA
// TODO: Replace with real API responses from backend
// All data structures match backend API response format
// ============================================================

export const dummyUser = {
  id: 'user_001',
  name: 'Aryan Sharma',
  email: 'aryan@example.com',
  avatar: null, // TODO: connect backend user profile
  plan: 'Pro',
  joinedAt: '2024-01-15',
}

export const dummyStorage = {
  used: 2.4,       // GB
  total: 50,       // GB
  usedBytes: 2576980377,
  totalBytes: 53687091200,
  filesCount: 47,
  foldersCount: 12,
}

export const dummyFolders = [
  {
    id: 'folder_001',
    name: 'Projects',
    parentId: null,
    createdAt: '2024-02-10T10:30:00Z',
    updatedAt: '2024-03-01T14:22:00Z',
    filesCount: 12,
    color: 'emerald',
  },
  {
    id: 'folder_002',
    name: 'Design Assets',
    parentId: null,
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-03-05T09:11:00Z',
    filesCount: 8,
    color: 'blue',
  },
  {
    id: 'folder_003',
    name: 'Documents',
    parentId: null,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-02-28T16:45:00Z',
    filesCount: 15,
    color: 'purple',
  },
  {
    id: 'folder_004',
    name: 'Backups',
    parentId: null,
    createdAt: '2024-03-01T07:00:00Z',
    updatedAt: '2024-03-10T11:30:00Z',
    filesCount: 5,
    color: 'orange',
  },
  {
    id: 'folder_005',
    name: 'Client Work',
    parentId: 'folder_001',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-03-08T13:00:00Z',
    filesCount: 3,
    color: 'pink',
  },
  {
    id: 'folder_006',
    name: 'Personal',
    parentId: null,
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-03-02T10:20:00Z',
    filesCount: 4,
    color: 'teal',
  },
]

export const dummyFiles = [
  {
    id: 'file_001',
    name: 'Product Roadmap 2024.pdf',
    type: 'pdf',
    mimeType: 'application/pdf',
    size: 2457600,       // bytes
    sizeFormatted: '2.3 MB',
    folderId: 'folder_001',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
    s3Key: 'files/user_001/product-roadmap-2024.pdf', // TODO: S3 key from backend
    downloadUrl: null, // TODO: presigned URL from backend
    isShared: true,
  },
  {
    id: 'file_002',
    name: 'Dashboard Mockup.figma',
    type: 'figma',
    mimeType: 'application/octet-stream',
    size: 8945600,
    sizeFormatted: '8.5 MB',
    folderId: 'folder_002',
    createdAt: '2024-02-28T16:00:00Z',
    updatedAt: '2024-03-09T11:00:00Z',
    s3Key: 'files/user_001/dashboard-mockup.figma',
    downloadUrl: null,
    isShared: false,
  },
  {
    id: 'file_003',
    name: 'Team Photo.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 5242880,
    sizeFormatted: '5.0 MB',
    folderId: null,
    createdAt: '2024-03-05T09:00:00Z',
    updatedAt: '2024-03-05T09:00:00Z',
    s3Key: 'files/user_001/team-photo.jpg',
    downloadUrl: null,
    isShared: false,
  },
  {
    id: 'file_004',
    name: 'Backend API Docs.md',
    type: 'markdown',
    mimeType: 'text/markdown',
    size: 102400,
    sizeFormatted: '100 KB',
    folderId: 'folder_003',
    createdAt: '2024-03-08T14:00:00Z',
    updatedAt: '2024-03-11T10:20:00Z',
    s3Key: 'files/user_001/api-docs.md',
    downloadUrl: null,
    isShared: true,
  },
  {
    id: 'file_005',
    name: 'Budget Q1 2024.xlsx',
    type: 'excel',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 1048576,
    sizeFormatted: '1.0 MB',
    folderId: 'folder_003',
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2024-03-02T16:00:00Z',
    s3Key: 'files/user_001/budget-q1.xlsx',
    downloadUrl: null,
    isShared: false,
  },
  {
    id: 'file_006',
    name: 'Presentation Final.pptx',
    type: 'powerpoint',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 15728640,
    sizeFormatted: '15 MB',
    folderId: 'folder_001',
    createdAt: '2024-03-07T13:00:00Z',
    updatedAt: '2024-03-11T08:45:00Z',
    s3Key: 'files/user_001/presentation-final.pptx',
    downloadUrl: null,
    isShared: true,
  },
  {
    id: 'file_007',
    name: 'Logo Final.png',
    type: 'image',
    mimeType: 'image/png',
    size: 524288,
    sizeFormatted: '512 KB',
    folderId: 'folder_002',
    createdAt: '2024-02-25T10:30:00Z',
    updatedAt: '2024-02-25T10:30:00Z',
    s3Key: 'files/user_001/logo-final.png',
    downloadUrl: null,
    isShared: false,
  },
  {
    id: 'file_008',
    name: 'Video Demo.mp4',
    type: 'video',
    mimeType: 'video/mp4',
    size: 209715200,
    sizeFormatted: '200 MB',
    folderId: null,
    createdAt: '2024-03-10T15:00:00Z',
    updatedAt: '2024-03-10T15:00:00Z',
    s3Key: 'files/user_001/video-demo.mp4',
    downloadUrl: null,
    isShared: false,
  },
]

export const dummyRecentFiles = dummyFiles.slice(0, 5).map(f => ({
  ...f,
  accessedAt: new Date().toISOString(),
}))

export const dummySharedFiles = dummyFiles.filter(f => f.isShared).map(f => ({
  ...f,
  shareToken: `share_${f.id}_${Math.random().toString(36).substr(2, 9)}`,
  shareUrl: `https://keeply.app/s/share_token_here`, // TODO: real share URL from backend
  expiresAt: null,
}))

export const dummyTrashItems = [
  {
    id: 'trash_001',
    name: 'Old Resume.pdf',
    type: 'pdf',
    size: 512000,
    sizeFormatted: '500 KB',
    itemType: 'file',
    deletedAt: '2024-03-09T10:00:00Z',
    originalPath: 'My Drive / Documents',
  },
  {
    id: 'trash_002',
    name: 'Archive 2023',
    type: 'folder',
    size: 0,
    sizeFormatted: '—',
    itemType: 'folder',
    filesCount: 24,
    deletedAt: '2024-03-08T14:30:00Z',
    originalPath: 'My Drive',
  },
  {
    id: 'trash_003',
    name: 'Draft Logo.ai',
    type: 'illustrator',
    size: 8388608,
    sizeFormatted: '8.0 MB',
    itemType: 'file',
    deletedAt: '2024-03-07T09:15:00Z',
    originalPath: 'My Drive / Design Assets',
  },
  {
    id: 'trash_004',
    name: 'Meeting Notes March.docx',
    type: 'word',
    size: 204800,
    sizeFormatted: '200 KB',
    itemType: 'file',
    deletedAt: '2024-03-06T16:45:00Z',
    originalPath: 'My Drive / Documents',
  },
]

export const dummyBreadcrumb = [
  { id: 'root', name: 'My Drive', path: '/dashboard' },
  { id: 'folder_001', name: 'Projects', path: '/dashboard/folder_001' },
]

export const dummySearchResults = {
  files: dummyFiles.slice(0, 3),
  folders: dummyFolders.slice(0, 2),
  query: '',
}

export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    storage: '5 GB',
    storageBytes: 5,
    badge: null,
    color: 'gray',
    features: [
      'Secure cloud storage',
      'File upload & download',
      'Folder management',
      'Secure sharing links',
      'Basic search',
      'Trash & restore',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 9, yearly: 7 },
    storage: '50 GB',
    storageBytes: 50,
    badge: 'Most Popular',
    color: 'emerald',
    features: [
      'Everything in Free',
      '50 GB secure storage',
      'Priority uploads',
      'Advanced sharing controls',
      'Share link expiry dates',
      'File version history',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: { monthly: 19, yearly: 15 },
    storage: '200 GB',
    storageBytes: 200,
    badge: 'Best Value',
    color: 'purple',
    features: [
      'Everything in Pro',
      '200 GB secure storage',
      'Team collaboration',
      'Advanced admin controls',
      'Audit logs',
      'Custom share domains',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Go Premium',
    highlighted: false,
  },
]

export const featuresList = [
  {
    id: 'auth',
    icon: 'ShieldCheck',
    title: 'Bank-Grade Security',
    description: 'JWT authentication, encrypted tokens, and zero-trust access control keep your account safe.',
    color: 'emerald',
  },
  {
    id: 'storage',
    icon: 'Cloud',
    title: 'AWS S3 Storage',
    description: 'Your files are stored in private AWS S3 buckets with server-side encryption and redundancy.',
    color: 'blue',
  },
  {
    id: 'folders',
    icon: 'FolderOpen',
    title: 'Smart Folders',
    description: 'Nested folder hierarchy with drag-and-drop organization. Navigate complex file structures with ease.',
    color: 'purple',
  },
  {
    id: 'sharing',
    icon: 'Share2',
    title: 'Secure Sharing',
    description: 'Generate token-based secure links. Set expiry dates and control exactly who can access your files.',
    color: 'orange',
  },
  {
    id: 'search',
    icon: 'Search',
    title: 'Instant Search',
    description: 'Find any file or folder in milliseconds with full-text search across your entire storage.',
    color: 'teal',
  },
  {
    id: 'trash',
    icon: 'Trash2',
    title: 'Trash Protection',
    description: 'Deleted files go to trash first. Restore accidentally deleted files before permanent removal.',
    color: 'rose',
  },
]

export const howItWorksSteps = [
  {
    step: 1,
    icon: 'Upload',
    title: 'Upload Your File',
    description: 'Drag and drop or select any file type. We handle the rest instantly.',
    color: 'emerald',
  },
  {
    step: 2,
    icon: 'Shield',
    title: 'Secure S3 Storage',
    description: 'Files are encrypted and stored in private AWS S3 buckets with redundancy.',
    color: 'blue',
  },
  {
    step: 3,
    icon: 'Globe',
    title: 'Access Anywhere',
    description: 'Access your files from any device, browser, or location around the world.',
    color: 'purple',
  },
  {
    step: 4,
    icon: 'Share2',
    title: 'Share Securely',
    description: 'Generate token-based links with optional expiry. Share safely with anyone.',
    color: 'orange',
  },
]

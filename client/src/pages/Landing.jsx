import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ShieldCheck, Cloud, FolderOpen, Share2, Search, Trash2,
  Upload, Globe, Lock, ArrowRight, ChevronRight, Check,
  Shield, Zap, Star
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ── Inline Data ──────────────────────────────────────────────────

const featuresList = [
  {
    id: 1,
    icon: 'ShieldCheck',
    color: 'emerald',
    title: 'Military-Grade Encryption',
    description: 'Every file is encrypted with AES-256 at rest inside private AWS S3 buckets. Nobody — not even us — can read your data.',
  },
  {
    id: 2,
    icon: 'Cloud',
    color: 'blue',
    title: 'AWS S3 Powered',
    description: 'Built on the same infrastructure that powers Netflix and Airbnb. 99.999999999% durability. Your files aren\'t going anywhere.',
  },
  {
    id: 3,
    icon: 'FolderOpen',
    color: 'purple',
    title: 'Smart Folder Organization',
    description: 'Create nested folders, move files in bulk, and keep everything structured the way your brain works.',
  },
  {
    id: 4,
    icon: 'Share2',
    color: 'orange',
    title: 'Instant Secure Sharing',
    description: 'Share any file with a temporary presigned link that auto-expires. No account needed for recipients.',
  },
  {
    id: 5,
    icon: 'Search',
    color: 'teal',
    title: 'Instant File Search',
    description: 'Find any file across all your folders in milliseconds. Search by name, type, or date.',
  },
  {
    id: 6,
    icon: 'Trash2',
    color: 'rose',
    title: 'Safe Delete & Recovery',
    description: 'Deleted files go to trash first. Recover anything within 30 days on Pro, 90 days on Premium.',
  },
]

const howItWorksSteps = [
  {
    step: 1,
    icon: 'Upload',
    color: 'emerald',
    title: 'Upload your files',
    description: 'Drag and drop or click to upload. Files go directly to your private S3 bucket — never through our servers.',
  },
  {
    step: 2,
    icon: 'FolderOpen',
    color: 'blue',
    title: 'Organize into folders',
    description: 'Create a folder structure that makes sense for you. Move, rename, and nest however you like.',
  },
  {
    step: 3,
    icon: 'Share2',
    color: 'purple',
    title: 'Share securely',
    description: 'Generate a time-limited share link in one click. Set expiry in minutes or days on Pro plans.',
  },
  {
    step: 4,
    icon: 'ShieldCheck',
    color: 'orange',
    title: 'Stay in control',
    description: 'Revoke access anytime, track downloads, and manage everything from one clean dashboard.',
  },
]

// ── Icon / color maps ────────────────────────────────────────────

const iconMap = { ShieldCheck, Cloud, FolderOpen, Share2, Search, Trash2, Upload, Globe, Shield }

const featureColors = {
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-100'    },
  purple:  { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-purple-100'  },
  orange:  { bg: 'bg-orange-50',  icon: 'text-orange-600',  border: 'border-orange-100'  },
  teal:    { bg: 'bg-teal-50',    icon: 'text-teal-600',    border: 'border-teal-100'    },
  rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    border: 'border-rose-100'    },
}

// ── FadeUp helper ────────────────────────────────────────────────

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 overflow-hidden gradient-hero">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-32 right-1/4 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-full px-4 py-1.5 mb-8 shadow-sm"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-emerald-700">AWS S3 Powered • Secure • Private</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6"
            >
              Your Secure{' '}
              <span className="text-gradient">Cloud Storage</span>
              <br />Workspace
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Private AWS-powered storage, military-grade encryption, intelligent folder organization, and instant secure sharing — all in one beautiful workspace.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-2xl shadow-emerald-600/30 transition-all"
                >
                  Start for Free
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold text-base rounded-2xl border border-gray-200 shadow-lg transition-all"
                >
                  View Dashboard
                  <ChevronRight size={18} />
                </motion.button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-400 mt-5"
            >
              Free forever • No credit card required • 100 MB free storage
            </motion.p>
          </div>

          {/* Dashboard Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-16 relative"
          >
            <div className="relative max-w-5xl mx-auto">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-200/20 to-transparent rounded-3xl blur-2xl scale-95" />

              {/* Mockup Frame */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Browser bar */}
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-400 font-mono text-center max-w-xs mx-auto">
                      app.keeply.cloud/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard content preview */}
                <div className="flex h-80 sm:h-96">
                  {/* Sidebar */}
                  <div className="w-52 border-r border-gray-50 bg-white p-3 hidden sm:block">
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <div className="w-7 h-7 bg-emerald-600 rounded-lg" />
                      <div className="h-4 bg-gray-100 rounded w-16" />
                    </div>
                    {['My Drive', 'Recent', 'Shared', 'Trash'].map((item, i) => (
                      <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-0.5 ${i === 0 ? 'bg-emerald-50' : ''}`}>
                        <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                        <div className={`h-3 rounded w-16 ${i === 0 ? 'bg-emerald-200' : 'bg-gray-100'}`} />
                      </div>
                    ))}
                    <div className="mt-auto absolute bottom-4 left-3 right-0 w-44">
                      <div className="bg-emerald-50 rounded-xl p-3">
                        <div className="h-2 bg-emerald-200 rounded-full mb-1" />
                        <div className="h-1.5 bg-emerald-100 rounded-full w-2/3" />
                        <div className="h-2 bg-gray-100 rounded mt-2 w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Main */}
                  <div className="flex-1 p-5 overflow-hidden">
                    {/* Top bar */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex-1 h-9 bg-gray-50 border border-gray-100 rounded-xl" />
                      <div className="h-9 w-28 bg-white border border-gray-200 rounded-xl" />
                      <div className="h-9 w-28 bg-emerald-600 rounded-xl" />
                    </div>
                    {/* Folder cards */}
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-3">
                          <div className={`w-9 h-9 rounded-xl mb-2 ${
                            ['bg-emerald-100','bg-blue-100','bg-purple-100','bg-orange-100'][i]
                          }`} />
                          <div className="h-3 bg-gray-100 rounded mb-1" />
                          <div className="h-2 bg-gray-50 rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                    {/* File rows */}
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-50 rounded-xl">
                          <div className={`w-8 h-8 rounded-xl flex-shrink-0 ${
                            ['bg-red-50','bg-green-50','bg-blue-50'][i]
                          }`} />
                          <div className="flex-1">
                            <div className="h-3 bg-gray-100 rounded mb-1 w-3/4" />
                            <div className="h-2 bg-gray-50 rounded w-1/4" />
                          </div>
                          <div className="h-3 bg-gray-50 rounded w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-16">
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Everything you need</span>
              <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">
                Built for secure, modern cloud storage
              </h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                All the tools you need to store, organize, and share files — privately and securely.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feature, i) => {
              const Icon = iconMap[feature.icon]
              const colors = featureColors[feature.color]
              return (
                <FadeUp key={feature.id} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.07)' }}
                    className={`bg-white border ${colors.border} rounded-3xl p-7 transition-all duration-200 h-full`}
                  >
                    <div className={`w-12 h-12 ${colors.bg} rounded-2xl flex items-center justify-center mb-5`}>
                      {Icon && <Icon size={24} className={colors.icon} />}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </motion.div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-16">
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Simple process</span>
              <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">How Keeply works</h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                From upload to secure sharing — four simple steps to a better cloud experience.
              </p>
            </div>
          </FadeUp>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-gradient-to-b from-emerald-200 via-blue-200 to-orange-200 hidden lg:block -translate-x-1/2" />

            <div className="space-y-8 lg:space-y-12">
              {howItWorksSteps.map((step, i) => {
                const Icon = iconMap[step.icon]
                const colors = featureColors[step.color] || featureColors.emerald
                return (
                  <FadeUp key={step.step} delay={i * 0.1}>
                    <div className={`flex items-center gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                      <div className={`flex-1 ${i % 2 === 1 ? 'lg:text-right' : ''}`}>
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Step {step.step}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-base text-gray-500 leading-relaxed">{step.description}</p>
                      </div>

                      {/* Icon bubble */}
                      <div className="flex-shrink-0 z-10">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-20 h-20 ${colors.bg} border-4 border-white rounded-3xl flex items-center justify-center shadow-xl`}
                        >
                          {Icon && <Icon size={32} className={colors.icon} />}
                        </motion.div>
                      </div>

                      <div className="flex-1 hidden lg:block" />
                    </div>
                  </FadeUp>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section id="security" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-16">
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Enterprise-grade</span>
              <h2 className="text-4xl font-black text-white mt-3 mb-4">
                Security at every layer
              </h2>
              <p className="text-lg text-gray-400 max-w-xl mx-auto">
                Your files are protected by multiple layers of security — from auth to storage.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: 'JWT Protected Access',
                desc: 'Every API request is validated with cryptographically signed JWT tokens. No token, no access.',
                tag: 'Authentication',
              },
              {
                icon: Cloud,
                title: 'Private S3 Storage',
                desc: 'Files are stored in private AWS S3 buckets. No public access. Server-side AES-256 encryption at rest.',
                tag: 'Storage',
              },
              {
                icon: Zap,
                title: 'Presigned Download URLs',
                desc: 'Downloads use temporary presigned URLs that expire in minutes. Your data never lives in our servers.',
                tag: 'Sharing',
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/20">
                    <item.icon size={22} className="text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{item.tag}</span>
                  <h3 className="text-base font-bold text-white mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Simple pricing</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">
              Start free, scale as you grow
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              No surprise charges. No hidden fees. Free forever with up to 100 MB of storage.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 hover:bg-emerald-700 transition-all"
                >
                  View All Plans
                  <ArrowRight size={17} />
                </motion.button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <FadeUp>
            <h2 className="text-4xl font-black text-white mb-4">
              Start storing securely today
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of users who trust Keeply for their most important files. Free forever.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-9 py-4 bg-white text-emerald-700 font-bold text-base rounded-2xl shadow-2xl hover:shadow-white/20 transition-all"
              >
                Create Free Account →
              </motion.button>
            </Link>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}
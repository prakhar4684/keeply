import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Zap, HelpCircle, ChevronDown, ArrowRight, Shield, Star, Crown, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    badge: null,
    highlighted: false,
    storage: '100 MB',
    price: { monthly: 0, yearly: 0 },
    cta: 'Get Started Free',
    features: [
      '100 MB storage',
      'Up to 5 MB per file',
      'File upload & download',
      'Folder management',
      'Secure sharing',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Most Popular',
    highlighted: true,
    storage: '50 GB',
    price: { monthly: 349, yearly: 279 },
    cta: 'Start Pro Trial',
    features: [
      '50 GB storage',
      'Up to 500 MB per file',
      'Unlimited uploads',
      'Folder management',
      'Secure sharing + link expiry',
      'Priority uploads',
      '30-day file history',
      'Priority support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Best Value',
    highlighted: false,
    storage: '200 GB',
    price: { monthly: 1349, yearly: 1079 },
    cta: 'Go Premium',
    features: [
      '200 GB storage',
      'Up to 2 GB per file',
      'Unlimited uploads',
      'Folder management',
      'Secure sharing + custom expiry',
      'Priority uploads',
      '90-day file history',
      'Team collaboration',
      'Admin controls',
      'Dedicated support',
    ],
  },
]

const faqs = [
  {
    q: 'Is my data safe with Keeply?',
    a: 'Yes. All files are stored in private AWS S3 buckets with AES-256 server-side encryption. Access requires JWT authentication, and downloads use temporary presigned URLs that expire automatically.',
  },
  {
    q: 'Can I upgrade or downgrade my plan anytime?',
    a: 'Absolutely. You can change your plan at any time from Settings. Upgrades take effect immediately; downgrades apply at the end of your billing cycle.',
  },
  {
    q: 'What happens if I exceed my storage limit?',
    a: 'You will receive notifications as you approach your limit. Uploads will be paused when the limit is reached. You can upgrade anytime to continue uploading without losing existing files.',
  },
  {
    q: 'How does secure file sharing work?',
    a: 'Keeply generates token-based share links. Recipients can access the file via a temporary presigned S3 URL — no login required. You can set expiry times on Pro and Premium plans.',
  },
  {
    q: 'Do you offer a free trial for paid plans?',
    a: 'Pro plan comes with a 14-day free trial — no credit card required. Premium plans include a 7-day trial. You can cancel anytime before the trial ends.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'Free: 5 MB per file. Pro: 500 MB per file. Premium: 2 GB per file. For larger files, contact our support team.',
  },
  {
    q: 'Why does the free plan have only 100 MB?',
    a: 'We want to give everyone a genuine taste of Keeply without any cost. 100 MB is enough to try all features. When you need more, our Pro plan offers 50 GB at just ₹349/month.',
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="border border-gray-100 rounded-2xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900 pr-4">{item.q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={17} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const planGradients = {
  free: {
    card: 'bg-white', border: 'border-gray-200', badge: '',
    iconBg: 'bg-gray-100', iconColor: 'text-gray-600',
    btn: 'bg-gray-900 hover:bg-gray-800 text-white',
    checkBg: 'bg-gray-100', checkColor: 'text-gray-600',
  },
  pro: {
    card: 'bg-gradient-to-b from-emerald-600 to-emerald-700', border: 'border-emerald-500',
    badge: 'bg-emerald-500 text-white',
    iconBg: 'bg-white/20', iconColor: 'text-white',
    btn: 'bg-white hover:bg-emerald-50 text-emerald-700 shadow-xl',
    checkBg: 'bg-white/20', checkColor: 'text-white',
  },
  premium: {
    card: 'bg-white', border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25',
    checkBg: 'bg-purple-100', checkColor: 'text-purple-600',
  },
}

const planIcons = { free: Star, pro: Zap, premium: Crown }

function PricingCardFull({ plan, billing, index }) {
  const styles = planGradients[plan.id]
  const Icon = planIcons[plan.id]
  const price = billing === 'yearly' ? plan.price.yearly : plan.price.monthly
  const isHighlighted = plan.highlighted
  const isPro = plan.id === 'pro'

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: isHighlighted ? -8 : -5, transition: { duration: 0.2 } }}
      className={`relative flex flex-col rounded-3xl border-2 overflow-hidden ${styles.card} ${styles.border} ${
        isHighlighted ? 'shadow-2xl shadow-emerald-900/20 scale-105' : 'shadow-lg'
      }`}
    >
      {plan.badge && (
        <div className={`absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full ${styles.badge}`}>
          {plan.badge}
        </div>
      )}

      <div className="p-7 flex-1">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-11 h-11 rounded-2xl ${styles.iconBg} flex items-center justify-center`}>
            <Icon size={22} className={styles.iconColor} />
          </div>
          <div>
            <h3 className={`text-lg font-black ${isPro ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
            <p className={`text-sm ${isPro ? 'text-emerald-100' : 'text-gray-400'}`}>{plan.storage} storage</p>
          </div>
        </div>

        <div className="mb-7">
          {plan.price.monthly === 0 ? (
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-black ${isPro ? 'text-white' : 'text-gray-900'}`}>Free</span>
              <span className={`text-sm ${isPro ? 'text-emerald-200' : 'text-gray-400'}`}>forever</span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${isPro ? 'text-emerald-200' : 'text-gray-400'}`}>₹</span>
                <span className={`text-5xl font-black ${isPro ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                <span className={`text-sm ${isPro ? 'text-emerald-200' : 'text-gray-400'}`}>/mo</span>
              </div>
              {billing === 'yearly' && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs font-semibold mt-1.5 ${isPro ? 'text-emerald-200' : 'text-emerald-600'}`}
                >
                  Billed ₹{price * 12}/year · Save ₹{(plan.price.monthly - plan.price.yearly) * 12}
                </motion.p>
              )}
            </>
          )}
        </div>

        <div className={`h-px mb-6 ${isPro ? 'bg-white/20' : 'bg-gray-100'}`} />

        <ul className="space-y-3.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${styles.checkBg}`}>
                <Check size={11} className={styles.checkColor} strokeWidth={3} />
              </div>
              <span className={`text-sm ${isPro ? 'text-emerald-50' : 'text-gray-600'}`}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-7 pb-7">
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 ${styles.btn}`}
          >
            {plan.cta}
            <ArrowRight size={15} />
          </motion.button>
        </Link>
        {plan.price.monthly > 0 && (
          <p className={`text-center text-xs mt-3 ${isPro ? 'text-emerald-200' : 'text-gray-400'}`}>
            14-day free trial · Cancel anytime
          </p>
        )}
      </div>
    </motion.div>
  )
}

const comparisonRows = [
  { feature: 'Storage',              free: '100 MB',    pro: '50 GB',    premium: '200 GB'    },
  { feature: 'Max file size',        free: '5 MB',      pro: '500 MB',   premium: '2 GB'      },
  { feature: 'File upload',          free: true,        pro: true,       premium: true         },
  { feature: 'Folder management',    free: true,        pro: true,       premium: true         },
  { feature: 'Secure sharing',       free: true,        pro: true,       premium: true         },
  { feature: 'Share link expiry',    free: false,       pro: true,       premium: true         },
  { feature: 'Priority uploads',     free: false,       pro: true,       premium: true         },
  { feature: 'File version history', free: false,       pro: '30 days',  premium: '90 days'   },
  { feature: 'Team collaboration',   free: false,       pro: false,      premium: true         },
  { feature: 'Admin controls',       free: false,       pro: false,      premium: true         },
  { feature: 'Support',              free: 'Community', pro: 'Priority', premium: 'Dedicated' },
]

function CompareCell({ value }) {
  if (value === true)  return <Check size={18} className="text-emerald-500 mx-auto" strokeWidth={2.5} />
  if (value === false) return <span className="text-gray-200 text-xl block text-center">—</span>
  return <span className="text-sm font-semibold text-gray-700 block text-center">{value}</span>
}

export default function Pricing() {
  const [billing, setBilling] = useState('monthly')

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              <Zap size={12} />
              Simple, transparent pricing
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-4">
              Start free,{' '}
              <span className="text-gradient">scale fearlessly</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mx-auto mb-4">
              No hidden fees. No surprises. Storage that grows with you.
            </p>
            <p className="text-sm text-emerald-600 font-semibold mb-10">
              🎉 100 MB free forever — no credit card required
            </p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gray-100 rounded-2xl p-1.5 mb-14"
          >
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                billing === 'monthly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                billing === 'yearly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly
              <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {pricingPlans.map((plan, i) => (
              <PricingCardFull key={plan.id} plan={plan} billing={billing} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 border-y border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, label: 'AWS S3 encrypted storage',   color: 'text-emerald-600' },
              { icon: Zap,    label: 'Instant uploads & downloads', color: 'text-blue-600'    },
              { icon: Check,  label: '99.9% uptime guarantee',      color: 'text-purple-600'  },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center gap-2.5"
              >
                <item.icon size={18} className={item.color} />
                <span className="text-sm font-semibold text-gray-600">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-3">Compare plans</h2>
            <p className="text-gray-500">Everything side by side so you can choose the right fit.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-gray-100 overflow-hidden shadow-lg"
          >
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-100">
              <div className="p-5"><p className="text-sm font-bold text-gray-600">Feature</p></div>
              {[
                { label: 'Free',    sub: '100 MB' },
                { label: 'Pro',     sub: '50 GB'  },
                { label: 'Premium', sub: '200 GB' },
              ].map((p, i) => (
                <div key={p.label} className={`p-5 text-center ${i === 1 ? 'bg-emerald-600' : ''}`}>
                  <p className={`text-sm font-black ${i === 1 ? 'text-white' : 'text-gray-900'}`}>{p.label}</p>
                  <p className={`text-xs mt-0.5 ${i === 1 ? 'text-emerald-200' : 'text-gray-400'}`}>{p.sub}</p>
                </div>
              ))}
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <div className="p-4 pl-5"><span className="text-sm text-gray-700">{row.feature}</span></div>
                <div className="p-4 flex items-center justify-center"><CompareCell value={row.free} /></div>
                <div className="p-4 flex items-center justify-center bg-emerald-50/40"><CompareCell value={row.pro} /></div>
                <div className="p-4 flex items-center justify-center"><CompareCell value={row.premium} /></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold mb-3">
              <HelpCircle size={16} />
              Frequently asked questions
            </div>
            <h2 className="text-3xl font-black text-gray-900">Got questions?</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} item={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — Go to Dashboard sirf yahan hai */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-4">Ready to secure your files?</h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-lg mx-auto">
              Start with 100 MB free. Upgrade whenever you need more space. No commitment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-white text-emerald-700 font-black text-base rounded-2xl shadow-2xl hover:shadow-white/20 transition-all"
                >
                  Get Started Free →
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-base rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  Go to Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
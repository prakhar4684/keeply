import React from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

const planIcons = { free: Star, pro: Zap, premium: Crown }
const planGradients = {
  free: 'from-gray-50 to-slate-50',
  pro: 'from-emerald-50 to-teal-50',
  premium: 'from-purple-50 to-violet-50',
}
const planBorderActive = {
  free: 'border-gray-200',
  pro: 'border-emerald-300',
  premium: 'border-purple-300',
}
const planButtonStyle = {
  free: 'bg-gray-900 hover:bg-gray-800 text-white',
  pro: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30',
  premium: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30',
}
const planBadgeStyle = {
  pro: 'bg-emerald-100 text-emerald-700',
  premium: 'bg-purple-100 text-purple-700',
}

// TODO: connect backend API - payment/subscription integration V2
export default function PricingCard({ plan, billing = 'monthly', index = 0 }) {
  const PlanIcon = planIcons[plan.id] || Star
  const price = billing === 'yearly' ? plan.price.yearly : plan.price.monthly
  const isFree = plan.price.monthly === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative flex flex-col rounded-3xl border-2 overflow-hidden ${
        plan.highlighted ? planBorderActive[plan.id] : 'border-gray-100'
      } bg-gradient-to-b ${planGradients[plan.id]}`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className={`absolute top-5 right-5 text-xs font-bold px-2.5 py-1 rounded-full ${planBadgeStyle[plan.id]}`}>
          {plan.badge}
        </div>
      )}

      <div className="p-7 flex-1">
        {/* Plan icon + name */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            plan.id === 'pro' ? 'bg-emerald-100' : plan.id === 'premium' ? 'bg-purple-100' : 'bg-gray-100'
          }`}>
            <PlanIcon size={20} className={
              plan.id === 'pro' ? 'text-emerald-600' : plan.id === 'premium' ? 'text-purple-600' : 'text-gray-600'
            } />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-500">{plan.storage} storage</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          {isFree ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900">Free</span>
              <span className="text-gray-400 text-sm">forever</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-gray-500">₹</span>
              <span className="text-4xl font-black text-gray-900">{price}</span>
              <span className="text-gray-400 text-sm">/ month</span>
            </div>
          )}
          {billing === 'yearly' && !isFree && (
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              Save ₹{(plan.price.monthly - plan.price.yearly) * 12} yearly
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                plan.id === 'pro' ? 'bg-emerald-100' : plan.id === 'premium' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <Check size={10} className={
                  plan.id === 'pro' ? 'text-emerald-600' : plan.id === 'premium' ? 'text-purple-600' : 'text-gray-600'
                } />
              </div>
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-7 pb-7">
        <Link to={isFree ? '/register' : '/register'}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${planButtonStyle[plan.id]}`}
          >
            {plan.cta}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

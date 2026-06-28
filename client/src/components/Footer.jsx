import React from 'react'
import { Link } from 'react-router-dom'
import { Cloud, Github, Linkedin, Heart, Mail } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const links = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Changelog', href: '#' },
    ],
    Company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  }

  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">

          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                <Cloud size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white">Keeply</span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Your secure cloud storage workspace. AWS-powered, encrypted, and always accessible.
            </p>

            <div className="mt-5 p-3 bg-gray-900 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-500 mb-1">Built by</p>
              <p className="text-sm font-semibold text-white">Prakhar Shukla</p>
              <p className="text-xs text-gray-500 mt-0.5">Full Stack Developer · B.Tech CSE (AI & ML)</p>
              <a href="mailto:praakharshukla4004@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors mt-1 block">
                praakharshukla4004@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/prakhar4684" target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                <Github size={16} />
              </a>
              <a href="https://www.linkedin.com/in/prakhar-shukla-746360319/" target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                <Linkedin size={16} />
              </a>
              <a href="mailto:praakharshukla4004@gmail.com" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="text-sm text-gray-500 hover:text-emerald-400 transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {year} Keeply. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            Made with <Heart size={13} className="text-emerald-500" /> by{' '}
            <a href="https://github.com/prakhar4684" target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1">
              Prakhar Shukla
            </a>
          </p>
        </div>

      </div>
    </footer>
  )
}
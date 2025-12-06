'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from '@/hooks/useTranslations'
import { locales } from '@/i18n-config'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t, locale } = useTranslations()

  // Extract locale from pathname
  const currentLocale = locale || 'cs'
  
  // Get path without locale
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'

  const navItems = [
    { href: `/${currentLocale}`, label: t.nav.home },
    { href: `/${currentLocale}/o-nas`, label: t.nav.about },
    { href: `/${currentLocale}/produkty`, label: t.nav.products },
    { href: `/${currentLocale}/reference`, label: t.nav.references },
    { href: `/${currentLocale}/kontakt`, label: t.nav.contact },
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-[#050505]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link href={`/${currentLocale}`} className="flex items-center">
          <img
            src="/images/logo.3990d4455f2ccc2f6ec7.webp"
            alt="Balloon Light Prag Logo"
            className="h-6 md:h-7 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === `/${currentLocale}` && pathname === `/${currentLocale}`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-800 bg-[#050505] md:hidden"
          >
            <div className="flex flex-col space-y-1 px-4 py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href === `/${currentLocale}` && pathname === `/${currentLocale}`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <div className="px-4 py-2">
                <LanguageSwitcher onLanguageChange={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

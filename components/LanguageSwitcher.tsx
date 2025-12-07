'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { locales, type Locale } from '@/i18n-config'

const languageNames: Record<Locale, string> = {
  cs: 'Čeština',
  en: 'English',
  hu: 'Magyar',
  es: 'Español',
  it: 'Italiano',
  de: 'Deutsch',
}

interface LanguageSwitcherProps {
  onLanguageChange?: () => void
}

export default function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLocale = (params?.locale as Locale) || 'cs'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const switchLanguage = (newLocale: Locale) => {
    setIsOpen(false)
    
    // Get current path without locale
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'
    
    // Navigate to new locale with same path
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
    
    // Call callback if provided (e.g., to close mobile menu)
    if (onLanguageChange) {
      onLanguageChange()
    }
    
    router.push(newPath)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
        aria-label="Switch language"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{languageNames[currentLocale]}</span>
        <span className="sm:hidden">{currentLocale.toUpperCase()}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-lg border border-gray-800 bg-[#0a0a0a] shadow-lg"
          >
            <div className="py-1">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => switchLanguage(locale)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    locale === currentLocale
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {languageNames[locale]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


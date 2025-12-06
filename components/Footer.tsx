'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function Footer() {
  const { t, locale } = useTranslations()
  const currentLocale = locale || 'cs'

  return (
    <footer className="border-t border-gray-800 bg-[#050505] py-12 px-4 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">{t.footer.company}</h3>
            <p className="mb-4 text-sm text-gray-400">
              {t.footer.description}
            </p>
            <p className="text-xs text-gray-500">IČ: 28006739</p>
            <p className="text-xs text-gray-500">DIČ: CZ28006739</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t.footer.navigation}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${currentLocale}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/o-nas`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/produkty`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/reference`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.nav.references}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/kontakt`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-500" />
                <a href="tel:+420603452130" className="hover:text-white transition-colors">
                  +420 603 452 130
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-500" />
                <a href="mailto:info@balloonlightprag.cz" className="hover:text-white transition-colors">
                  info@balloonlightprag.cz
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-0.5 text-gray-500" />
                <div>
                  <p>Za Zástávkou 377/3</p>
                  <p>109 00 Praha-Dolní Měcholupy</p>
                  <p>Hala č. 6</p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Instagram size={16} className="text-gray-500" />
                <a
                  href="https://www.instagram.com/balloonlightpraha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  title={t.footer.instagram}
                >
                  @balloonlightpraha
                </a>
              </li>
              <li className="mt-2 text-xs text-gray-500">
                {t.footer.instagram}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Balloon Light Praha. {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

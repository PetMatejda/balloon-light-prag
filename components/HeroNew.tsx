'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

export default function HeroNew() {
  const { t, locale } = useTranslations()
  const currentLocale = locale || 'cs'

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/galleryHomeImage.9f54b8395dfddb663fcd.webp"
          alt={t.hero.badge}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/80 to-[#050505]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-4"
        >
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            {t.hero.badge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="mb-6 text-5xl font-bold uppercase tracking-tight md:text-7xl lg:text-8xl"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 800,
            letterSpacing: '0.02em',
          }}
        >
          {t.hero.title}
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
            {t.hero.subtitle}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="mb-8 max-w-3xl text-lg text-gray-300 md:text-xl lg:text-2xl"
          style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
        >
          {t.hero.description}
          <br />
          {t.hero.description2}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href={`/${currentLocale}/produkty`}
            className="group relative overflow-hidden rounded-lg px-8 py-4 text-base font-semibold text-[#050505] transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: '#FFC58F' }}
          >
            <span className="relative z-10">{t.hero.productsButton}</span>
          </Link>
          <Link
            href={`/${currentLocale}/reference`}
            className="group flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20 uppercase"
            style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}
          >
            <Play size={20} />
            <span>{t.hero.referencesButton}</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-8 w-8 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

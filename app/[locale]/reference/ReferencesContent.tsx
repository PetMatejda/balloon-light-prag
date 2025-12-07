'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Gallery from '@/components/Gallery'
import { useTranslations } from '@/hooks/useTranslations'

export default function ReferencesContent() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/galleryHomeImage.9f54b8395dfddb663fcd.webp"
            alt={t.references.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/80 to-[#050505]" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold tracking-tight md:text-7xl"
          >
            {t.references.title}
          </motion.h1>
        </div>
      </section>

      {/* References Content */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">{t.references.subtitle}</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              {t.references.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full Gallery */}
      <section className="border-t border-gray-800 bg-[#0a0a0a] py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">{t.references.gallery.title}</h2>
            <p className="text-lg text-gray-400">{t.references.gallery.subtitle}</p>
          </motion.div>
          <Gallery />
        </div>
      </section>
    </div>
  )
}

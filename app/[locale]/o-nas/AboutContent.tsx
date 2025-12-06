'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'

export default function AboutContent() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/galleryHomeImage.9f54b8395dfddb663fcd.webp"
            alt={t.about.title}
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
            {t.about.title}
          </motion.h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-4 md:py-32">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="mb-6 text-4xl font-bold">{t.about.company}</h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-300">
              {t.about.description1}
            </p>
            <p className="mb-6 text-lg leading-relaxed text-gray-300">
              {t.about.description2}
            </p>
            <h3 className="mb-4 mt-12 text-2xl font-bold">{t.about.services.title}</h3>
            <ul className="mb-6 space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-3 text-yellow-400">•</span>
                <span>{t.about.services.rental}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-yellow-400">•</span>
                <span>{t.about.services.consulting}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-yellow-400">•</span>
                <span>{t.about.services.support}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-yellow-400">•</span>
                <span>{t.about.services.solutions}</span>
              </li>
            </ul>
            <h3 className="mb-4 mt-12 text-2xl font-bold">{t.about.experience.title}</h3>
            <p className="mb-6 text-lg leading-relaxed text-gray-300">
              {t.about.experience.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="border-y border-gray-800 bg-[#0a0a0a] py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold">{t.about.work.title}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/film1.218a1d0efcf08e6b437b.webp"
                alt={t.references.films.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/civilwar.adc19be35ec1c30fab33.webp"
                alt={t.references.films.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/spectre.ee4cc6aa172104cef7c1.webp"
                alt={t.references.films.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


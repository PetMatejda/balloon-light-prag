'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'

// Film posters/projects
const filmPosters = [
  '/images/film1.218a1d0efcf08e6b437b.webp',
  '/images/civilwar.adc19be35ec1c30fab33.webp',
  '/images/spectre.ee4cc6aa172104cef7c1.webp',
  '/images/terminator.87fd768205dd99bdd550.webp',
  '/images/inglorious.80f3d76ebc0566b8c159.webp',
  '/images/volavka.4856b58e51515d8d6bd0.webp',
]

export default function FilmsContent() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/galleryHomeImage.9f54b8395dfddb663fcd.webp"
            alt={t.films.title}
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
            {t.films.title}
          </motion.h1>
        </div>
      </section>

      {/* Films Content */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">{t.films.subtitle}</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              {t.films.description}
            </p>
          </motion.div>

          {/* Film Posters Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
              {filmPosters.map((src, index) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative mb-4 overflow-hidden break-inside-avoid"
                >
                  <div className="relative aspect-auto overflow-hidden border border-gray-800 bg-[#0a0a0a] transition-all duration-300 hover:border-gray-600">
                    <Image
                      src={src}
                      alt={`${t.films.title} ${index + 1}`}
                      width={800}
                      height={600}
                      className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


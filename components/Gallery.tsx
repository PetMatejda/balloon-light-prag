'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from '@/hooks/useTranslations'

// Images of lights being used during filming
const usageImages = [
  '/images/IMG_20200930_102505.9846e956999d102bd3eb.webp',
  '/images/crowSecond.9b62e1cfd595623529b3.jpg',
  '/images/crowThird.1024a05384cfac4757e4.webp',
  '/images/balloon.72b8c68083eb4d2c6ad5.webp',
  '/images/led-cube.c743afcbbb2f141d921d.webp',
  '/images/cloud.b20bf445c1377f77ce34.webp',
]

// Film posters/projects
const filmPosters = [
  '/images/film1.218a1d0efcf08e6b437b.webp',
  '/images/civilwar.adc19be35ec1c30fab33.webp',
  '/images/spectre.ee4cc6aa172104cef7c1.webp',
  '/images/terminator.87fd768205dd99bdd550.webp',
  '/images/inglorious.80f3d76ebc0566b8c159.webp',
  '/images/volavka.4856b58e51515d8d6bd0.webp',
]

export default function Gallery() {
  const { t } = useTranslations()

  return (
    <section className="py-24 px-4 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2
            className="mb-4 text-5xl font-bold tracking-tight md:text-6xl"
            style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800 }}
          >
            {t.gallery.title}
          </h2>
          <div className="mx-auto h-1 w-24 bg-white" />
          <p className="mt-4 font-mono text-sm text-gray-400">
            {t.gallery.subtitle}
          </p>
        </motion.div>

        {/* Usage Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h3
            className="mb-8 text-3xl font-bold uppercase tracking-tight"
            style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}
          >
            {t.gallery.usage.title}
          </h3>
          <p className="mb-8 text-gray-400">
            {t.gallery.usage.subtitle}
          </p>
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
            {usageImages.map((src, index) => (
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
                    alt={`${t.gallery.usage.title} ${index + 1}`}
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

        {/* Film Posters Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-800 pt-24"
        >
          <h3
            className="mb-8 text-3xl font-bold uppercase tracking-tight"
            style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}
          >
            {t.gallery.films.title}
          </h3>
          <p className="mb-8 text-gray-400">
            {t.gallery.films.subtitle}
          </p>
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
                    alt={`${t.gallery.films.title} ${index + 1}`}
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
  )
}

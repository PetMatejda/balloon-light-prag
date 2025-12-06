'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Gallery from '@/components/Gallery'
import { useTranslations } from '@/hooks/useTranslations'

export default function ReferencesContent() {
  const { t } = useTranslations()

  const references = [
    {
      title: t.references.films.title,
      description: t.references.films.description,
      images: [
        '/images/film1.218a1d0efcf08e6b437b.webp',
        '/images/civilwar.adc19be35ec1c30fab33.webp',
        '/images/spectre.ee4cc6aa172104cef7c1.webp',
        '/images/terminator.87fd768205dd99bdd550.webp',
        '/images/inglorious.80f3d76ebc0566b8c159.webp',
      ],
    },
    {
      title: t.references.tv.title,
      description: t.references.tv.description,
      images: [
        '/images/volavka.4856b58e51515d8d6bd0.webp',
        '/images/crowSecond.9b62e1cfd595623529b3.jpg',
        '/images/crowThird.1024a05384cfac4757e4.webp',
      ],
    },
    {
      title: t.references.ads.title,
      description: t.references.ads.description,
      images: [
        '/images/IMG_20200930_102505.9846e956999d102bd3eb.webp',
      ],
    },
  ]

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

          {references.map((reference, index) => (
            <motion.div
              key={reference.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="mb-24"
            >
              <h3 className="mb-4 text-3xl font-bold">{reference.title}</h3>
              <p className="mb-8 text-lg text-gray-400">{reference.description}</p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reference.images.map((image, imgIndex) => (
                  <motion.div
                    key={image}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: imgIndex * 0.1 }}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-800"
                  >
                    <Image
                      src={image}
                      alt={reference.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
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

'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import GearShowcase from '@/components/GearShowcase'
import TechnicalSpecs from '@/components/TechnicalSpecs'
import { useTranslations } from '@/hooks/useTranslations'

export default function ProductsContent() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/balloon.72b8c68083eb4d2c6ad5.webp"
            alt={t.products.page.title}
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
            {t.products.page.title}
          </motion.h1>
        </div>
      </section>

      {/* Products Content */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">{t.products.page.subtitle}</h2>
            <p className="text-lg text-gray-400">
              {t.products.page.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gear Showcase */}
      <GearShowcase />

      {/* Technical Specs */}
      <TechnicalSpecs />

      {/* Product Types Section */}
      <section className="border-y border-gray-800 bg-[#0a0a0a] py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">{t.products.page.lightingTypes.title}</h2>
            <p className="text-lg text-gray-400">
              {t.products.page.lightingTypes.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-lg border border-gray-800 bg-[#050505] p-8"
            >
              <div className="mb-4 text-4xl">💡</div>
              <h3 className="mb-3 text-2xl font-bold">{t.products.page.lightingTypes.tungsten.title}</h3>
              <p className="mb-4 text-gray-400">
                {t.products.page.lightingTypes.tungsten.description}
              </p>
              <p className="text-sm text-gray-500">
                {t.products.page.lightingTypes.tungsten.powers}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-lg border border-gray-800 bg-[#050505] p-8"
            >
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="mb-3 text-2xl font-bold">{t.products.page.lightingTypes.hmi.title}</h3>
              <p className="mb-4 text-gray-400">
                {t.products.page.lightingTypes.hmi.description}
              </p>
              <p className="text-sm text-gray-500">
                {t.products.page.lightingTypes.hmi.powers}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-lg border border-gray-800 bg-[#050505] p-8"
            >
              <div className="mb-4 text-4xl">🔆</div>
              <h3 className="mb-3 text-2xl font-bold">{t.products.page.lightingTypes.combined.title}</h3>
              <p className="mb-4 text-gray-400">
                {t.products.page.lightingTypes.combined.description}
              </p>
              <p className="text-sm text-gray-500">
                {t.products.page.lightingTypes.combined.powers}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}


'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function ProductShowcase() {
  const { t, locale } = useTranslations()
  const currentLocale = locale || 'cs'

  const products = [
    {
      id: 1,
      name: t.products.balloons.name,
      image: '/images/balloon.72b8c68083eb4d2c6ad5.webp',
      description: t.products.balloons.description,
      type: t.products.balloons.type,
    },
    {
      id: 2,
      name: t.products.ledCube.name,
      image: '/images/led-cube.c743afcbbb2f141d921d.webp',
      description: t.products.ledCube.description,
      type: t.products.ledCube.type,
    },
    {
      id: 3,
      name: t.products.cloud.name,
      image: '/images/cloud.b20bf445c1377f77ce34.webp',
      description: t.products.cloud.description,
      type: t.products.cloud.type,
    },
    {
      id: 4,
      name: t.products.flatLight.name,
      image: '/images/IMG_20200930_102505.9846e956999d102bd3eb.webp',
      description: t.products.flatLight.description,
      type: t.products.flatLight.type,
    },
    {
      id: 5,
      name: t.products.sunCut.name,
      image: '/images/suncut.925bf50780c4b9762413.webp',
      description: t.products.sunCut.description,
      type: t.products.sunCut.type,
    },
    {
      id: 6,
      name: t.products.underwater.name,
      image: '/images/podvodni.a0455413779cdf5ffadc.webp',
      description: t.products.underwater.description,
      type: t.products.underwater.type,
    },
  ]

  return (
    <section className="border-y border-gray-800 bg-[#0a0a0a] py-24 px-4 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t.products.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            {t.products.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border border-gray-800 bg-[#050505] transition-all hover:border-gray-700"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {product.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-white">{product.name}</h3>
                <p className="mb-4 text-gray-400">{product.description}</p>
                <Link
                  href={`/${currentLocale}/produkty`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 transition-colors hover:text-yellow-300"
                >
                  {t.products.moreInfo}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href={`/${currentLocale}/produkty`}
            className="inline-block rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
          >
            {t.products.viewAll}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

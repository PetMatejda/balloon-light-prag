'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import ProductDetailModal from './ProductDetailModal'

export default function ProductShowcase() {
  const { t, locale } = useTranslations()
  const currentLocale = locale || 'cs'
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const products = [
    {
      id: 1,
      name: t.products.balloons.name,
      image: '/images/balloon.72b8c68083eb4d2c6ad5.webp',
      description: t.products.balloons.description,
      type: t.products.balloons.type,
      power: t.products.balloons.power,
      sourceType: t.products.balloons.sourceType,
      colorTemp: t.products.balloons.colorTemp,
      dimensions: t.products.balloons.dimensions,
      usageImages: [
        '/images/balloon.72b8c68083eb4d2c6ad5.webp',
        '/images/film1.218a1d0efcf08e6b437b.webp',
        '/images/civilwar.adc19be35ec1c30fab33.webp',
      ],
      technicalDetails: {
        wattage: '1200W / 2500W / 4000W',
        dimming: '0-100%',
        cri: '95+',
        weight: 'Variabilní dle velikosti',
        voltage: '230V / 400V',
      },
    },
    {
      id: 2,
      name: t.products.ledCube.name,
      image: '/images/led-cube.c743afcbbb2f141d921d.webp',
      description: t.products.ledCube.description,
      type: t.products.ledCube.type,
      power: t.products.ledCube.power,
      sourceType: t.products.ledCube.sourceType,
      colorTemp: t.products.ledCube.colorTemp,
      dimensions: t.products.ledCube.dimensions,
      usageImages: [
        '/images/led-cube.c743afcbbb2f141d921d.webp',
        '/images/spectre.ee4cc6aa172104cef7c1.webp',
      ],
      technicalDetails: {
        wattage: '4800W',
        dimming: '0-100%',
        cri: '95+',
        weight: '~50 kg',
        voltage: '230V / 400V',
      },
    },
    {
      id: 3,
      name: t.products.cloud.name,
      image: '/images/cloud.b20bf445c1377f77ce34.webp',
      description: t.products.cloud.description,
      type: t.products.cloud.type,
      power: t.products.cloud.power,
      sourceType: t.products.cloud.sourceType,
      colorTemp: t.products.cloud.colorTemp,
      dimensions: t.products.cloud.dimensions,
      usageImages: [
        '/images/cloud.b20bf445c1377f77ce34.webp',
        '/images/terminator.87fd768205dd99bdd550.webp',
      ],
      technicalDetails: {
        wattage: '2500W',
        dimming: '0-100%',
        cri: '95+',
        weight: 'Variabilní',
        voltage: '230V / 400V',
      },
    },
    {
      id: 4,
      name: t.products.flatLight.name,
      image: '/images/IMG_20200930_102505.9846e956999d102bd3eb.webp',
      description: t.products.flatLight.description,
      type: t.products.flatLight.type,
      power: t.products.flatLight.power,
      sourceType: t.products.flatLight.sourceType,
      colorTemp: t.products.flatLight.colorTemp,
      dimensions: t.products.flatLight.dimensions,
      usageImages: [
        '/images/IMG_20200930_102505.9846e956999d102bd3eb.webp',
        '/images/inglorious.80f3d76ebc0566b8c159.webp',
      ],
      technicalDetails: {
        wattage: 'Variabilní',
        dimming: '0-100%',
        cri: '95+',
        weight: 'Variabilní',
        voltage: '230V / 400V',
      },
    },
    {
      id: 5,
      name: t.products.sunCut.name,
      image: '/images/suncut.925bf50780c4b9762413.webp',
      description: t.products.sunCut.description,
      type: t.products.sunCut.type,
      power: t.products.sunCut.power,
      sourceType: t.products.sunCut.sourceType,
      colorTemp: t.products.sunCut.colorTemp,
      dimensions: t.products.sunCut.dimensions,
      usageImages: [
        '/images/suncut.925bf50780c4b9762413.webp',
        '/images/volavka.4856b58e51515d8d6bd0.webp',
      ],
      technicalDetails: {
        wattage: 'Variabilní',
        dimming: '0-100%',
        cri: '95+',
        weight: 'Variabilní',
        voltage: '230V / 400V',
      },
    },
    {
      id: 6,
      name: t.products.underwater.name,
      image: '/images/podvodni.a0455413779cdf5ffadc.webp',
      description: t.products.underwater.description,
      type: t.products.underwater.type,
      power: t.products.underwater.power,
      sourceType: t.products.underwater.sourceType,
      colorTemp: t.products.underwater.colorTemp,
      dimensions: t.products.underwater.dimensions,
      usageImages: [
        '/images/podvodni.a0455413779cdf5ffadc.webp',
        '/images/crowSecond.9b62e1cfd595623529b3.jpg',
      ],
      technicalDetails: {
        wattage: 'Variabilní',
        dimming: '0-100%',
        cri: '95+',
        weight: 'Variabilní',
        voltage: '230V / 400V',
      },
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
          <h2 className="mb-4 text-4xl font-bold uppercase tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800 }}>
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
              className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-800 bg-[#050505] transition-all hover:border-gray-700"
              onClick={() => handleProductClick(product)}
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
                <h3 className="mb-2 text-2xl font-bold uppercase text-white" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800 }}>
                  {product.name}
                </h3>
                <p className="mb-4 text-sm text-gray-400">{product.description}</p>
                
                {/* Technical Specs Grid */}
                <div className="mb-4 border-t border-gray-800 pt-4">
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div>
                      <div className="text-gray-500 mb-1">{t.products.specs.power}</div>
                      <div className="text-white font-semibold">{product.power}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">{t.products.specs.sourceType}</div>
                      <div className="text-white font-semibold">{product.sourceType}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">{t.products.specs.colorTemp}</div>
                      <div className="text-white font-semibold">{product.colorTemp}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">{t.products.specs.dimensions}</div>
                      <div className="text-white font-semibold">{product.dimensions}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProductClick(product)
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: '#FFC58F' }}
                >
                  {t.products.moreInfo}
                  <ArrowRight size={16} />
                </button>
                <Link
                  href={`/${currentLocale}/kontakt`}
                  onClick={(e) => e.stopPropagation()}
                  className="ml-4 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: '#FFC58F' }}
                >
                  {t.products.inquire}
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
            className="inline-block rounded-lg px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: '#FFC58F', color: '#050505' }}
          >
            {t.products.viewAll}
          </Link>
        </motion.div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

interface ProductDetailModalProps {
  product: {
    id: number
    name: string
    image: string
    description: string
    type: string
    power: string
    sourceType: string
    colorTemp: string
    dimensions: string
    usageImages?: string[]
    technicalDetails?: {
      wattage?: string
      dimming?: string
      cri?: string
      weight?: string
      voltage?: string
    }
  } | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { t } = useTranslations()

  if (!product) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 mx-auto max-h-[90vh] max-w-6xl overflow-y-auto rounded-lg border border-gray-800 bg-[#050505] shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <h2
                  className="mb-4 text-4xl font-bold uppercase tracking-tight md:text-5xl"
                  style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800 }}
                >
                  {product.name}
                </h2>
                <p className="text-lg text-gray-400">{product.description}</p>
              </div>

              {/* Main Image */}
              <div className="relative mb-8 aspect-video overflow-hidden rounded-lg border border-gray-800">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Technical Specifications */}
              <div className="mb-8 rounded-lg border border-gray-800 bg-[#0a0a0a] p-6">
                <h3
                  className="mb-6 text-2xl font-bold uppercase"
                  style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}
                >
                  {t.products.moreInfo}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-2 font-mono text-xs text-gray-500">{t.products.specs.sourceType}</div>
                    <div className="text-lg font-semibold text-white">{product.sourceType}</div>
                  </div>
                  <div>
                    <div className="mb-2 font-mono text-xs text-gray-500">{t.products.specs.power}</div>
                    <div className="text-lg font-semibold text-white">{product.power}</div>
                  </div>
                  <div>
                    <div className="mb-2 font-mono text-xs text-gray-500">{t.products.specs.colorTemp}</div>
                    <div className="text-lg font-semibold text-white">{product.colorTemp}</div>
                  </div>
                  <div>
                    <div className="mb-2 font-mono text-xs text-gray-500">{t.products.specs.dimensions}</div>
                    <div className="text-lg font-semibold text-white">{product.dimensions}</div>
                  </div>
                  {product.technicalDetails?.wattage && (
                    <div>
                      <div className="mb-2 font-mono text-xs text-gray-500">{t.specs.wattage}</div>
                      <div className="text-lg font-semibold text-white">{product.technicalDetails.wattage}</div>
                    </div>
                  )}
                  {product.technicalDetails?.dimming && (
                    <div>
                      <div className="mb-2 font-mono text-xs text-gray-500">{t.specs.dimming}</div>
                      <div className="text-lg font-semibold text-white">{product.technicalDetails.dimming}</div>
                    </div>
                  )}
                  {product.technicalDetails?.cri && (
                    <div>
                      <div className="mb-2 font-mono text-xs text-gray-500">{t.specs.cri}</div>
                      <div className="text-lg font-semibold text-white">{product.technicalDetails.cri}</div>
                    </div>
                  )}
                  {product.technicalDetails?.weight && (
                    <div>
                      <div className="mb-2 font-mono text-xs text-gray-500">Hmotnost</div>
                      <div className="text-lg font-semibold text-white">{product.technicalDetails.weight}</div>
                    </div>
                  )}
                  {product.technicalDetails?.voltage && (
                    <div>
                      <div className="mb-2 font-mono text-xs text-gray-500">Napětí</div>
                      <div className="text-lg font-semibold text-white">{product.technicalDetails.voltage}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Images */}
              {product.usageImages && product.usageImages.length > 0 && (
                <div>
                  <h3
                    className="mb-6 text-2xl font-bold uppercase"
                    style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}
                  >
                    {t.products.detail?.usageImages || 'Obrázky použití'}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {product.usageImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-800"
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - použití ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


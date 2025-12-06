'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from '@/hooks/useTranslations'

export default function GearShowcase() {
  const { t } = useTranslations()

  const gearItems = [
    {
      id: 1,
      name: t.products.balloons.name,
      image: '/images/balloon.72b8c68083eb4d2c6ad5.webp',
      description: t.products.balloons.description,
      output: '1-5 KW',
      kelvin: '3200K / 5600K',
    },
    {
      id: 2,
      name: t.products.ledCube.name,
      image: '/images/led-cube.c743afcbbb2f141d921d.webp',
      description: t.products.ledCube.description,
      output: '4.8 KW',
      kelvin: '2700K-6500K',
    },
    {
      id: 3,
      name: 'LED Tubs',
      image: '/images/LED-tubs.e986582eee4743c15232.webp',
      description: 'Profesionální LED tuby pro lineární osvětlení scén',
      output: '--',
      kelvin: '--',
    },
    {
      id: 4,
      name: t.products.cloud.name,
      image: '/images/cloud.b20bf445c1377f77ce34.webp',
      description: t.products.cloud.description,
      output: '2.5 KW',
      kelvin: '5600K',
    },
    {
      id: 5,
      name: 'Elipsy a stativy',
      image: '/images/elipsy_stative.1c10979080babe4cbe00.webp',
      description: 'Profesionální stativy a elipsy pro montáž osvětlovací techniky',
      output: '--',
      kelvin: '--',
    },
    {
      id: 6,
      name: 'No Gravity',
      image: '/images/no-gravity.ef3c44f8b36fea3e5d8a.webp',
      description: 'Speciální osvětlovací řešení pro unikátní světelné efekty',
      output: '--',
      kelvin: '--',
    },
    {
      id: 7,
      name: t.products.flatLight.name,
      image: '/images/LED-tubs.e986582eee4743c15232.webp',
      description: t.products.flatLight.description,
      output: '--',
      kelvin: '--',
    },
    {
      id: 8,
      name: t.products.sunCut.name,
      image: '/images/suncut.925bf50780c4b9762413.webp',
      description: t.products.sunCut.description,
      output: '--',
      kelvin: '5600K',
    },
    {
      id: 9,
      name: t.products.underwater.name,
      image: '/images/podvodni.a0455413779cdf5ffadc.webp',
      description: t.products.underwater.description,
      output: '--',
      kelvin: '--',
    },
  ]

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
            {t.gear.title}
          </h2>
          <div className="mx-auto h-1 w-24 bg-white" />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {gearItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden border border-gray-800 bg-[#0a0a0a] transition-all duration-300 hover:border-gray-600"
            >
              {/* Technical Schematic Style Border */}
              <div className="absolute inset-0 border-2 border-white/10" />
              <div className="absolute left-0 top-0 h-8 w-8 border-r-2 border-b-2 border-white/20" />
              <div className="absolute right-0 top-0 h-8 w-8 border-l-2 border-b-2 border-white/20" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-r-2 border-t-2 border-white/20" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-l-2 border-t-2 border-white/20" />

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#050505]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              </div>

              {/* Technical Info Box */}
              <div className="p-6">
                <div className="mb-2 font-mono text-xs text-gray-500">
                  {t.gear.model}: {item.id.toString().padStart(4, '0')}
                </div>
                <h3
                  className="mb-2 text-2xl font-bold"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {item.name}
                </h3>
                <p className="mb-4 text-sm text-gray-400">{item.description}</p>

                {/* Technical Specs Preview */}
                {item.output !== '--' && (
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                      <div>
                        <div className="text-gray-500">{t.gear.output}</div>
                        <div className="text-white">{item.output}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">{t.gear.kelvin}</div>
                        <div className="text-white">{item.kelvin}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

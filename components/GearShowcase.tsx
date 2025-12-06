'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const gearItems = [
  {
    id: 1,
    name: 'Balloon Light System',
    image: '/images/balloon.72b8c68083eb4d2c6ad5.webp',
    description: 'High-output balloon lighting system',
  },
  {
    id: 2,
    name: 'LED Cube Array',
    image: '/images/led-cube.c743afcbbb2f141d921d.webp',
    description: 'Modular LED cube lighting system',
  },
  {
    id: 3,
    name: 'LED Tubs',
    image: '/images/LED-tubs.e986582eee4743c15232.webp',
    description: 'Professional LED tub fixtures',
  },
  {
    id: 4,
    name: 'Cloud Light System',
    image: '/images/cloud.b20bf445c1377f77ce34.webp',
    description: 'Diffused cloud lighting solution',
  },
  {
    id: 5,
    name: 'Ellipse Stand System',
    image: '/images/elipsy_stative.1c10979080babe4cbe00.webp',
    description: 'Precision mounting and stand system',
  },
  {
    id: 6,
    name: 'Specialty Lighting',
    image: '/images/no-gravity.ef3c44f8b36fea3e5d8a.webp',
    description: 'Custom specialty lighting solutions',
  },
]

export default function GearShowcase() {
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
            EQUIPMENT SHOWCASE
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
                  MODEL: {item.id.toString().padStart(4, '0')}
                </div>
                <h3
                  className="mb-2 text-2xl font-bold"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {item.name}
                </h3>
                <p className="font-mono text-sm text-gray-400">{item.description}</p>

                {/* Technical Specs Preview */}
                <div className="mt-4 border-t border-gray-800 pt-4">
                  <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                    <div>
                      <div className="text-gray-500">OUTPUT</div>
                      <div className="text-white">-- KW</div>
                    </div>
                    <div>
                      <div className="text-gray-500">KELVIN</div>
                      <div className="text-white">-- K</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

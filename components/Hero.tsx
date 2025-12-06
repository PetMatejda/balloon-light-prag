'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/galleryHomeImage.9f54b8395dfddb663fcd.webp"
          alt="Balloon Light Night Shot"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-[#050505]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-6 text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          PRECISION
          <br />
          <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            BALLOON LIGHTING
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="mb-12 max-w-2xl text-xl text-gray-300 md:text-2xl"
          style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
        >
          Professional film lighting solutions for Directors of Photography and Gaffers
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-8 w-8 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

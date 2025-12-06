'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Film, Zap, Award } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function Features() {
  const { t } = useTranslations()

  const features = [
    {
      icon: Lightbulb,
      title: t.features.balloons.title,
      description: t.features.balloons.description,
    },
    {
      icon: Film,
      title: t.features.film.title,
      description: t.features.film.description,
    },
    {
      icon: Zap,
      title: t.features.lighting.title,
      description: t.features.lighting.description,
    },
    {
      icon: Award,
      title: t.features.quality.title,
      description: t.features.quality.description,
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
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t.features.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            {t.features.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg border border-gray-800 bg-[#0a0a0a] p-8 transition-all hover:border-gray-700 hover:bg-[#111111]"
              >
                <div className="mb-4 inline-flex rounded-lg bg-white/5 p-3">
                  <Icon className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

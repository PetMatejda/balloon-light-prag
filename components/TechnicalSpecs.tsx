'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'

export default function TechnicalSpecs() {
  const { t } = useTranslations()

  const specs = [
    {
      model: 'Heliový balón 5KW',
      output: '5.0 KW',
      kelvin: '5600K / 3200K',
      wattage: '5000W',
      dimming: '0-100%',
      cri: '95+',
      type: 'HMI / Tungsten',
    },
    {
      model: 'Heliový balón 3KW',
      output: '3.0 KW',
      kelvin: '5600K / 3200K',
      wattage: '3000W',
      dimming: '0-100%',
      cri: '95+',
      type: 'HMI / Tungsten',
    },
    {
      model: 'Heliový balón 2KW',
      output: '2.0 KW',
      kelvin: '5600K / 3200K',
      wattage: '2000W',
      dimming: '0-100%',
      cri: '95+',
      type: 'HMI / Tungsten',
    },
    {
      model: 'Heliový balón 1KW',
      output: '1.0 KW',
      kelvin: '5600K / 3200K',
      wattage: '1000W',
      dimming: '0-100%',
      cri: '95+',
      type: 'HMI / Tungsten',
    },
    {
      model: 'LED Cube 64',
      output: '4.8 KW',
      kelvin: '2700K-6500K',
      wattage: '4800W',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED',
    },
    {
      model: 'Cloud Light',
      output: '2.5 KW',
      kelvin: '5600K',
      wattage: '2500W',
      dimming: '0-100%',
      cri: '95+',
      type: 'HMI',
    },
    {
      model: 'Flat Light',
      output: '--',
      kelvin: '5600K / 3200K',
      wattage: '--',
      dimming: '0-100%',
      cri: '95+',
      type: 'HMI / Tungsten',
    },
    {
      model: 'Sun Cut',
      output: '--',
      kelvin: '5600K',
      wattage: '--',
      dimming: '0-100%',
      cri: '95+',
      type: 'HMI',
    },
    {
      model: 'Podvodní světla',
      output: '--',
      kelvin: '5600K / 3200K',
      wattage: '--',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED / HMI',
    },
  ]

  return (
    <section className="border-y border-gray-800 bg-[#0a0a0a] py-24 px-4 md:py-32">
      <div className="mx-auto max-w-6xl">
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
            {t.specs.title}
          </h2>
          <div className="mx-auto h-1 w-24 bg-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="px-6 py-4 text-left text-gray-400">{t.specs.model}</th>
                <th className="px-6 py-4 text-left text-gray-400">{t.specs.type}</th>
                <th className="px-6 py-4 text-left text-gray-400">{t.specs.output}</th>
                <th className="px-6 py-4 text-left text-gray-400">{t.specs.kelvin}</th>
                <th className="px-6 py-4 text-left text-gray-400">{t.specs.wattage}</th>
                <th className="px-6 py-4 text-left text-gray-400">{t.specs.dimming}</th>
                <th className="px-6 py-4 text-left text-gray-400">{t.specs.cri}</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, index) => (
                <motion.tr
                  key={spec.model}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-gray-800 transition-colors hover:bg-white/5"
                >
                  <td className="px-6 py-4 font-semibold text-white">{spec.model}</td>
                  <td className="px-6 py-4 text-gray-300">{spec.type}</td>
                  <td className="px-6 py-4 text-gray-300">{spec.output}</td>
                  <td className="px-6 py-4 text-gray-300">{spec.kelvin}</td>
                  <td className="px-6 py-4 text-gray-300">{spec.wattage}</td>
                  <td className="px-6 py-4 text-gray-300">{spec.dimming}</td>
                  <td className="px-6 py-4 text-gray-300">{spec.cri}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}

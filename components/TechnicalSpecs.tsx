'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'

export default function TechnicalSpecs() {
  const { t } = useTranslations()

  const specs = [
    {
      model: 'Balloon 500',
      output: '2.8 KW',
      kelvin: '3200K / 5600K',
      wattage: '2800 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'Balloon 370',
      output: '1.4 KW',
      kelvin: '3200K / 5600K',
      wattage: '1400 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'Balloon Ellipse 370',
      output: '1.4 KW',
      kelvin: '3200K / 5600K',
      wattage: '1400 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'Cube Blacktop 3.5m',
      output: '2.8 KW',
      kelvin: '2700K-6500K',
      wattage: '2800 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'Cube Blacktop 2.5m',
      output: '1.4 KW',
      kelvin: '2700K-6500K',
      wattage: '1400 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'TUBE Blacktop 970cm',
      output: '4.0 KW',
      kelvin: '3200K / 5600K',
      wattage: '4000 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'TUBE Blacktop 800cm',
      output: '2.0 KW',
      kelvin: '3200K / 5600K',
      wattage: '2000 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'TUBE Blacktop 700cm',
      output: '0.9 KW',
      kelvin: '3200K / 5600K',
      wattage: '3x300 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'TUBE Blacktop 500cm',
      output: '1.0 KW',
      kelvin: '3200K / 5600K',
      wattage: '1000 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'Cloud Blacktop 8x6m',
      output: '4.7 KW',
      kelvin: '3200K / 5600K',
      wattage: '4700 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'Cloud Blacktop 4.5x4.5m',
      output: '1.4-2.8 KW',
      kelvin: '3200K / 5600K',
      wattage: '1400 W-2800 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'Flat light 8x8 Feet',
      output: '1.2-2.0 KW',
      kelvin: '2700K-6500K',
      wattage: '1200 - 2000 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW',
    },
    {
      model: 'Flat light 4x8 Feet',
      output: '0.6-1.0 KW',
      kelvin: '2700K-6500K',
      wattage: '600 - 1000 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW',
    },
    {
      model: 'Flat light 4x4 Feet',
      output: '0.3-0.5 KW',
      kelvin: '2700K-6500K',
      wattage: '300 - 500 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW',
    },
    {
      model: 'No Gravity Blacktop 3x3m',
      output: '0.3 KW',
      kelvin: '2700K-6500K',
      wattage: '300 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW',
    },
    {
      model: 'No Gravity Blacktop 2.8x2.8m',
      output: '0.3 KW',
      kelvin: '2700K-6500K',
      wattage: '300 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW',
    },
    {
      model: 'Pad Light',
      output: '0.3 KW',
      kelvin: '3200K / 5600K',
      wattage: '300 W each color',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW / Tungsten / HMI / Mix',
    },
    {
      model: 'LED RGBWW - 4-foot Tube',
      output: '0.14 KW',
      kelvin: '2700K-6500K',
      wattage: '140W+',
      dimming: '0-100%',
      cri: '95+',
      type: 'LED RGBWW',
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
            className="mb-4 text-5xl font-bold uppercase tracking-tight md:text-6xl"
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

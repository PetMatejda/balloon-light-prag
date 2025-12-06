'use client'

import { motion } from 'framer-motion'

const specs = [
  {
    model: 'BL-5000',
    output: '5.0 KW',
    kelvin: '5600K',
    wattage: '5000W',
    dimming: '0-100%',
    cri: '95+',
  },
  {
    model: 'BL-3000',
    output: '3.0 KW',
    kelvin: '5600K',
    wattage: '3000W',
    dimming: '0-100%',
    cri: '95+',
  },
  {
    model: 'BL-2000',
    output: '2.0 KW',
    kelvin: '5600K / 3200K',
    wattage: '2000W',
    dimming: '0-100%',
    cri: '95+',
  },
  {
    model: 'BL-1000',
    output: '1.0 KW',
    kelvin: '5600K / 3200K',
    wattage: '1000W',
    dimming: '0-100%',
    cri: '95+',
  },
  {
    model: 'LED-CUBE-64',
    output: '4.8 KW',
    kelvin: '2700K-6500K',
    wattage: '4800W',
    dimming: '0-100%',
    cri: '95+',
  },
  {
    model: 'CLOUD-LIGHT',
    output: '2.5 KW',
    kelvin: '5600K',
    wattage: '2500W',
    dimming: '0-100%',
    cri: '95+',
  },
]

export default function TechnicalSpecs() {
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
            TECHNICAL SPECIFICATIONS
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
                <th className="px-6 py-4 text-left text-gray-400">MODEL</th>
                <th className="px-6 py-4 text-left text-gray-400">OUTPUT</th>
                <th className="px-6 py-4 text-left text-gray-400">KELVIN</th>
                <th className="px-6 py-4 text-left text-gray-400">WATTAGE</th>
                <th className="px-6 py-4 text-left text-gray-400">DIMMING</th>
                <th className="px-6 py-4 text-left text-gray-400">CRI</th>
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

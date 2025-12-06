'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function ContactContent() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 md:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="mb-4 text-5xl font-bold uppercase tracking-tight md:text-7xl" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800 }}>
              {t.contact.bookingTitle || t.contact.title}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              {t.contact.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="mb-8 text-3xl font-bold">{t.contact.info.title}</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-lg bg-white/5 p-3">
                    <Phone className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{t.contact.info.phone}</h3>
                    <a
                      href="tel:+420603452130"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      +420 603 452 130
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-lg bg-white/5 p-3">
                    <Mail className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{t.contact.info.email}</h3>
                    <a
                      href="mailto:info@balloonlightprag.cz"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      info@balloonlightprag.cz
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-lg bg-white/5 p-3">
                    <MapPin className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{t.contact.info.address}</h3>
                    <p className="text-gray-400">Za Zástávkou 377/3</p>
                    <p className="text-gray-400">109 00 Praha-Dolní Měcholupy</p>
                    <p className="text-gray-400">Hala č. 6</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-lg bg-white/5 p-3">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{t.contact.info.hours}</h3>
                    <p className="text-gray-400">{t.contact.info.hoursWeekdays}</p>
                    <p className="text-gray-400">{t.contact.info.hoursWeekend}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-sm text-gray-500 mb-2">IČ: 28006739</p>
                  <p className="text-sm text-gray-500">DIČ: CZ28006739</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="mb-8 text-3xl font-bold">{t.contact.form.title}</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                    {t.contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                    {t.contact.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                    placeholder={t.contact.form.emailPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-300">
                    {t.contact.form.phone}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                    placeholder={t.contact.form.phonePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                    placeholder={t.contact.form.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-white px-8 py-4 text-base font-semibold text-[#050505] transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                >
                  {t.contact.form.submit}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

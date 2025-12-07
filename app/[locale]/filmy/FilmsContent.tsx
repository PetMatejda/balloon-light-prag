'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'

// Film posters/projects - includes original and portfolio images from balloonlightprag.cz/portfolio
const filmPosters = [
  // Original films
  '/images/film1.218a1d0efcf08e6b437b.webp',
  '/images/civilwar.adc19be35ec1c30fab33.webp',
  '/images/spectre.ee4cc6aa172104cef7c1.webp',
  '/images/terminator.87fd768205dd99bdd550.webp',
  '/images/inglorious.80f3d76ebc0566b8c159.webp',
  '/images/volavka.4856b58e51515d8d6bd0.webp',
  // Portfolio images from balloonlightprag.cz/portfolio (film posters only, excluding logo and background)
  '/images/portfolio_carnival-1.3e2a36d9e8723ffebb0a.webp',
  '/images/portfolio_child44.fe3a224b1b8891cbc70f.webp',
  '/images/portfolio_christopher.4b8b020a26f30c5f71d7.webp',
  '/images/portfolio_crawl.d7b0c8cc7bee50f6151b.webp',
  '/images/portfolio_advent.6ba83e19693e39ec2b07.webp',
  '/images/portfolio_doctor.c01edfced49342d1b46b.webp',
  '/images/portfolio_witcher.d8548f23f65a74e44012.webp',
  '/images/portfolio_geminiman.d333d08706b8785cd19d.webp',
  '/images/portfolio_Harry-Potter.2de13302c39b119b130a.webp',
  '/images/portfolio_martan.8eeeb7d2254d4eb0200c.webp',
  '/images/portfolio_papillon.63915785f955b2307732.webp',
  '/images/portfolio_robinhood.2df564b562a3d5603020.webp',
  '/images/portfolio_unlocked.edc9cb28709a4a338e1a.webp',
  '/images/portfolio_Zlodejka_knih.359b0a766f6fdb065424.webp',
  '/images/portfolio_maleficient.d2681c6c492bb2cb50c3.webp',
  '/images/portfolio_aftermath.e9484d2ac7d24fdc82b3.webp',
  '/images/portfolio_agora.ae017682b29d0ad62e47.webp',
  '/images/portfolio_allmoney.beffee975086b3125bed.webp',
  '/images/portfolio_anonymous.995983aa884ea8e0a4ce.webp',
  '/images/portfolio_anthropoid.c47e36722573870f6efd.webp',
  '/images/portfolio_benhur.05e6ab796fe0f3296639.webp',
  '/images/portfolio_borgias.6ea97471d00b1e16f29c.webp',
  '/images/portfolio_budapesthotel.5ce5e6a3da9ae43a3614.webp',
  '/images/portfolio_certibrko.7e228935080dd2022bda.webp',
  '/images/portfolio_spectral.a50f701b6550961c7075.webp',
  '/images/portfolio_cloudatlas.377edd211ea977c3d329.webp',
  '/images/portfolio_emperor.bc8648abef6b552d45ea.webp',
  '/images/portfolio_extinction.2b0fd2e2754ad1ca0e99.webp',
  '/images/portfolio_genius.2a492756a887dc29d9ff.webp',
  '/images/portfolio_ghost.aa5421f228ad238cd7f2.webp',
  '/images/portfolio_ghostprotocol.97fe0f4a572405bd6c98.webp',
  '/images/portfolio_hansel.6fc745520e3c4f0af9c4.webp',
  '/images/portfolio_hitman.78c7e36a3529a2f936c3.webp',
  '/images/portfolio_hostel.b4148ed650d0629cef8d.webp',
  '/images/portfolio_hurricane.06ba14c7caa381f19eaf.webp',
  '/images/portfolio_janhus.ccf7ea96245737d0f3af.webp',
  '/images/portfolio_knightfall.ed58e96ee61e6494e7d3.webp',
  '/images/portfolio_lavien.8b9d6ebf803b181dcd94.webp',
  '/images/portfolio_lines.1b77f45acb3b12f17393.webp',
  '/images/portfolio_marcopolo.6d5840c89bdc39aaa7f7.webp',
  '/images/portfolio_maria.7047471ddb4f4d5cb275.webp',
  '/images/portfolio_marypoppins.c4116247f39a91402dbb.webp',
  '/images/portfolio_narnia.7847b7100d6b5b0046f7.webp',
  '/images/portfolio_pointbreak.4032fbe1016dc9556b6e.webp',
  '/images/portfolio_shadow.1c8633521ddd7d5e67d4.webp',
  '/images/portfolio_sherlock.7bab192eb756c7d0e8a0.webp',
  '/images/portfolio_snow.29f9b414e6fd5578b82e.webp',
  '/images/portfolio_valkyrie.7503b5ee3537e0c20356.webp',
  '/images/portfolio_vanhelsing.302e6877815a2ad6e2b3.webp',
  '/images/portfolio_wanted.33c22b0de8ec706a65b8.webp',
  '/images/portfolio_warhorse.f0414837ffce346b20e4.webp',
  '/images/portfolio_xxx.f5b0a96411b4ae398662.webp',
  '/images/portfolio_zoolander.2805a2954485cb3dd7e3.webp',
]

export default function FilmsContent() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/galleryHomeImage.9f54b8395dfddb663fcd.webp"
            alt={t.films.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/80 to-[#050505]" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold tracking-tight md:text-7xl"
          >
            {t.films.title}
          </motion.h1>
        </div>
      </section>

      {/* Films Content */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">{t.films.subtitle}</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              {t.films.description}
            </p>
          </motion.div>

          {/* Film Posters Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
              {filmPosters.map((src, index) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative mb-4 overflow-hidden break-inside-avoid"
                >
                  <div className="relative aspect-auto overflow-hidden border border-gray-800 bg-[#0a0a0a] transition-all duration-300 hover:border-gray-600">
                    <Image
                      src={src}
                      alt={`${t.films.title} ${index + 1}`}
                      width={800}
                      height={600}
                      className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


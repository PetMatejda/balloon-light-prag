'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from '@/hooks/useTranslations'

// All gallery images from the original website
const usageImages = [
  '/images/gallery_185847b8-6f63-4b29-be4c-5214ae3cea65.ace332e33f4a3c95e92c.webp',
  '/images/gallery_1ab828a2-4739-4ff3-bc25-d4cece0c490e.4de4a4594dffa168a353.webp',
  '/images/gallery_1d8ca179-02b6-47d7-8b5b-10b059bd8c9b.ba303cbbd7feb30efbd2.webp',
  '/images/gallery_33a6d4ce-45ce-49e6-9c20-d619275f5fb0.7862412905c0cf6ad25e.webp',
  '/images/gallery_33c6b158-3c52-4fbe-b762-24a3b4fec2ca.a217ef9fd9d41f784a91.webp',
  '/images/gallery_34ebe850-a887-440c-b515-c6b914c84460.55aa588498e6da0d2bbf.webp',
  '/images/gallery_3647b8d1-3ccd-4900-9a5f-a2d38035d6ff.a94127735a38256e66bd.webp',
  '/images/gallery_36de41db-4b37-4003-8765-fe4a157e9857.a9fdf5f6d1886a4272f6.webp',
  '/images/gallery_3bf7b8b8-1221-4828-a7cb-a56b1539d2df.f58d50a767ab249a3521.webp',
  '/images/gallery_3cdd181b-adc0-42ab-94cb-dc861cc4e350.85c93b68aa1041158f9f.webp',
  '/images/gallery_3f9a8fbc-f1c7-4ac4-9346-4626b1341541.62dd4cc5d255b603c810.webp',
  '/images/gallery_4717a8bb-26dc-4fb5-9d6b-a4d2a2167417.e25bc2216ef5da900b1e.webp',
  '/images/gallery_55f793fa-010c-42de-9046-85bd2cbbb4a7.a63010be76ce2ca2244b.webp',
  '/images/gallery_5fa6de23-88b5-4295-9109-7c83ade1796d.3e9f33044bca8b81d111.webp',
  '/images/gallery_61fc9471-0043-4627-bca8-3dce0cd523b2.a75ed2a3aa3b5a686b01.webp',
  '/images/gallery_695ff2e6-f1c7-4c9c-a860-f4df5994c8ca.c604958f70bfcd46df03.webp',
  '/images/gallery_698ad5e6-c0eb-49dd-9dcc-d927e1f57746.6dd0388648e8bb530c9d.webp',
  '/images/gallery_6c33042a-2cb1-4c67-bc11-cea1fdbc918e.cf23cbc90d082ccd418c.webp',
  '/images/gallery_75f8fbf3-0ff6-4253-b68e-d00ea07d11d7.33d0c6f06303f1c4d46c.webp',
  '/images/gallery_75fecc48-bcef-4620-8356-be26d941f692.6a87c04f000f6be5b4db.webp',
  '/images/gallery_76e4953c-4cec-4644-9b16-3e2a0fbc7937.cfa169451a8cf0843dfe.webp',
  '/images/gallery_7b2d8bf9-4384-4d34-8334-45433126928b.2936e035bb24009ec33a.webp',
  '/images/gallery_7fc16a54-96eb-4b41-9c6a-ffd4c213d997.5e1c26f2424042654f4f.webp',
  '/images/gallery_7fd1dcf0-905a-4d29-9ee9-fb81628feff3.8214090a2b17d3e76ed5.webp',
  '/images/gallery_81416b5e-8096-48fa-b661-507dcabd03b5.0736c65edef7286d9a93.webp',
  '/images/gallery_815caebb-38f2-4e44-8bd5-051f577f745f.2143e28d0bf8b362d9d4.webp',
  '/images/gallery_826a3b3b-57b3-43fe-a03d-8afd0feb0858.104e99deb6d91eec788a.webp',
  '/images/gallery_83b6cc4a-c6e3-4b57-9cd1-5b4ab4cf0627.42fdbb1f509fd8e60d9a.webp',
  '/images/gallery_86d17e46-1384-430c-ad93-4beacb52c72f.45a3bc5341f587502ef3.webp',
  '/images/gallery_8cefee3c-9f59-44f1-b73f-94e3cf537fb6.751585c8fd7a742eb65c.webp',
  '/images/gallery_923b7f4e-f89c-46b1-b010-0cf0e634700c.9f7592b9baeb01f10fe0.webp',
  '/images/gallery_9bb8706e-790e-4260-9088-eaa7e2582b17.ec65078c9be144949d7f.webp',
  '/images/gallery_IMG_0066.5b5126e60ded430a6aae.webp',
  '/images/gallery_IMG_0067.eafabdaa72d94e359148.webp',
  '/images/gallery_IMG_0939.cd7b6cb9e0435e4177a0.webp',
  '/images/gallery_IMG_1206.d3735e0837f0d7752493.webp',
  '/images/gallery_IMG_1427.7c3cd6f435d965eab571.webp',
  '/images/gallery_IMG_1769.b3c01001b37ee277c245.webp',
  '/images/gallery_IMG_1778.cc07b09b407f70b296b4.webp',
  '/images/gallery_IMG_1836.9348faed87969f445d3a.webp',
  '/images/gallery_IMG_1895.fb0e07733840ef6b4884.webp',
  '/images/gallery_IMG_1924.c0e866f736e2bcd5ae30.webp',
  '/images/gallery_IMG_2146.c6bdd76da4019298b137.webp',
  '/images/gallery_IMG_3257.57325734e5b92dbd5dd5.webp',
  '/images/gallery_IMG_3359.2329566ec1a5b67eddb8.webp',
  '/images/gallery_IMG_3557.6639280c6f6517c9b369.webp',
  '/images/gallery_IMG_3794.24eb84e116d84f670fba.webp',
  '/images/gallery_IMG_3810.30e1dc6bdf5423814383.webp',
  '/images/gallery_IMG_3812.4150cc9672f7782aa9f3.webp',
  '/images/gallery_IMG_4211.3d647e56fa2a80df0100.webp',
  '/images/gallery_IMG_4232.e4b01b8ec49d327e747e.webp',
  '/images/gallery_IMG_4387.bb50c2d9b77061d5b796.webp',
  '/images/gallery_IMG_4412.0724f6623beee370f56a.webp',
  '/images/gallery_IMG_4430.98e6ddad53c179417bbd.webp',
  '/images/gallery_IMG_4562.12ad7be1ffdf41efc773.webp',
  '/images/gallery_IMG_4567.273f198528d163583df9.webp',
  '/images/gallery_IMG_4587.c98e2928a1a090899cb0.webp',
  '/images/gallery_IMG_5090.57dc13dd0e2a295fd5b2.webp',
  '/images/gallery_IMG_5155.72b8c68083eb4d2c6ad5.webp',
  '/images/gallery_IMG_5159.d3f4ad565af02f087343.webp',
  '/images/gallery_IMG_5165.4308953a15f70f46f68e.webp',
  '/images/gallery_IMG_5346.d5bf65c72282090da42b.webp',
  '/images/gallery_IMG_5411.33864c96578c76fc2710.webp',
  '/images/gallery_IMG_5439.8c43b8fe1033a6ca60b7.webp',
  '/images/gallery_IMG_5723.29f17adb6d16fa665156.webp',
  '/images/gallery_IMG_5817.1ba1743f3bfc6ed262b0.webp',
  '/images/gallery_IMG_5846.cd00cc2f12a20d041c37.webp',
  '/images/gallery_IMG_5851.6a29c59048efc3cd3360.webp',
  '/images/gallery_IMG_5903.f9915a4a71862eeef224.webp',
  '/images/gallery_IMG_5915.95aac9ef383f2fa7424c.webp',
  '/images/gallery_IMG_6042.386c350d326ab0ebfdfc.webp',
  '/images/gallery_IMG_6045.e39d5d684fb7f681a0ac.webp',
  '/images/gallery_IMG_6118.d69e9c243c46c80afa81.webp',
  '/images/gallery_IMG_6124.849660344e52359bc369.webp',
  '/images/gallery_IMG_6141.7985ffcb889e42c76316.webp',
  '/images/gallery_IMG_6416.e726eee16c7c98d88a03.webp',
  '/images/gallery_IMG_6488.2419fc838d8650e67c4c.webp',
  '/images/gallery_IMG_6492.10deda1e70748fe399b6.webp',
  '/images/gallery_IMG_6891.b981bcd76320327942c5.webp',
  '/images/gallery_IMG_6914.7481c59c105472aca454.webp',
  '/images/gallery_IMG_7353.21ca40f0a3fff182cac6.webp',
  '/images/gallery_IMG_7562.2922a8366f97d1ab9a05.webp',
  '/images/gallery_IMG_7591.d3d8a68357c86c779a90.webp',
  '/images/gallery_IMG_7635.c9b1116c5f1f85245d01.webp',
  '/images/gallery_IMG_7679.efd1d06e7f71825c3961.webp',
  '/images/gallery_IMG_7691.86c1247f79b4008ccf0c.webp',
  '/images/gallery_IMG_7733.063c8274ca6dfe154ab4.webp',
  '/images/gallery_IMG_8130.11daa67795b7ac520d65.webp',
  '/images/gallery_IMG_8156.c2557c1e794046cb2164.webp',
  '/images/gallery_IMG_8210.c0585affcf56e949d00c.webp',
  '/images/gallery_IMG_8219.72e964656692c21b60e5.webp',
  '/images/gallery_IMG_8305.9905ffe2cbf7b926b9c7.webp',
  '/images/gallery_IMG_8446.a439665b427dbd5eb875.webp',
  '/images/gallery_IMG_8489.b8d7a656a15f75cf9045.webp',
  '/images/gallery_IMG_8534.d0b29831e1e97a8030ef.webp',
  '/images/gallery_IMG_8769.12b861f3f115e89fb036.webp',
  '/images/gallery_IMG_8846.1ead175f0cfbdc853337.webp',
  '/images/gallery_IMG_8885.792ac7af01f30424745d.webp',
  '/images/gallery_IMG_9065.6f22aed6639b66d88c01.webp',
  '/images/gallery_IMG_9177.972e7c6b7685b6ca1ed8.webp',
  '/images/gallery_IMG_9268.8359e8bd22b5de77d1c2.webp',
  '/images/gallery_IMG_9313.f8e99ca1d3ed31e7f711.webp',
  '/images/gallery_IMG_9377.6e642e9183ba39a17a0a.webp',
  '/images/gallery_IMG_9577.c921dc169af3cea145b7.webp',
  '/images/gallery_IMG_9747.a8288e2782462945ce06.webp',
  '/images/gallery_IMG_9822.93b1ea5ed690512bc1bc.webp',
  '/images/gallery_IMG_9845.727ede944d9ee794b471.webp',
  '/images/gallery_IMG_9971.11481a826ca612266884.webp',
  '/images/gallery_IMG_E4206.ede992eaec478a38b259.webp',
  '/images/gallery_a12868cc-6787-43a3-b169-ec16c86268e3.346e66d6bce591bfc225.webp',
  '/images/gallery_a3fe0d78-b16a-4dc1-8df9-c6e119562b3b.cfa0c62c6a5955c41457.webp',
  '/images/gallery_af771bb7-b1c0-4cb8-a8e0-ca7c309faad4.8f311ef75e8665fdd1eb.webp',
  '/images/gallery_heropic.0cb6563981fd802181a3.webp',
  '/images/gallery_image006.507256117cd89135ae15.webp',
  '/images/gallery_logo.3990d4455f2ccc2f6ec7.webp',
  '/images/gallery_obrazek1.5725858eb8ec90ec1b3c.webp',
  '/images/gallery_obrazek10.1971890378506ae927c5.webp',
  '/images/gallery_obrazek12.77ff94ea76b1346c60d0.webp',
  '/images/gallery_obrazek14.3b55b2daffb7a39e2bcc.webp',
  '/images/gallery_obrazek15.9c04a9a57c3f9e9ebd44.webp',
  '/images/gallery_obrazek16.38afad1eb4cddd54dd99.webp',
  '/images/gallery_obrazek20.9d9801e148386c4c9902.webp',
  '/images/gallery_obrazek21.1c9f701d7f9240f6bd63.webp',
  '/images/gallery_obrazek23.2afb06e12d96e296380c.webp',
  '/images/gallery_obrazek3.87056e02a1fbd07b280d.webp',
  '/images/gallery_obrazek32.4f91b12f58da74f58af5.webp',
  '/images/gallery_obrazek33.89d9e3f5ad31f010ed93.webp',
  '/images/gallery_obrazek34.210e231551e184334a88.webp',
  '/images/gallery_obrazek41.17f1fd44fcff1c7ead57.webp',
  '/images/gallery_obrazek42.ac00ff263cce3c65e231.webp',
  '/images/gallery_obrazek49.f6d20faf5ef3ac760e48.webp',
  '/images/gallery_obrazek6.b4a3cbdf34669a163a79.webp',
  '/images/gallery_obrazek7.dc9c3e7539d14cbde894.webp',
  '/images/gallery_obrazek8.aec5d3d3bbb675e591b2.webp',
  '/images/gallery_obrazek9.fb1bc968d0fbfc35b996.webp',
]

export default function Gallery() {
  const { t } = useTranslations()

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
            {t.gallery.title}
          </h2>
          <div className="mx-auto h-1 w-24 bg-white" />
          <p className="mt-4 font-mono text-sm text-gray-400">
            {t.gallery.subtitle}
          </p>
        </motion.div>

        {/* Usage Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h3
            className="mb-8 text-3xl font-bold uppercase tracking-tight"
            style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}
          >
            {t.gallery.usage.title}
          </h3>
          <p className="mb-8 text-gray-400">
            {t.gallery.usage.subtitle}
          </p>
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
            {usageImages.map((src, index) => (
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
                    alt={`${t.gallery.usage.title} ${index + 1}`}
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
  )
}

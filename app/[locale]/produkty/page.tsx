import { Metadata } from 'next'
import ProductsContent from './ProductsContent'
import { getTranslations } from '@/lib/translations'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getTranslations(locale as any)

  return {
    title: `${t.products.page.title} - Balloon Light Praha`,
    description: "Specializujeme se na profesionální heliové balóny pro filmové osvětlení. Nabízíme širokou škálu výkonů a typů osvětlení - LED RGBWW, Tungsten, HMI a kombinované.",
  }
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <ProductsContent />
}


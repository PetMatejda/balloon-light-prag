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
    description: t.products.page.description,
  }
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <ProductsContent />
}


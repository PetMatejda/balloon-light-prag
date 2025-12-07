import { Metadata } from 'next'
import FilmsContent from './FilmsContent'
import { getTranslations } from '@/lib/translations'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getTranslations(locale as any)

  return {
    title: `${t.films.title} - Balloon Light Praha`,
    description: t.films.description,
  }
}

export default async function FilmsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <FilmsContent />
}


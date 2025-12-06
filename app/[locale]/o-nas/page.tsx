import { Metadata } from 'next'
import AboutContent from './AboutContent'
import { getTranslations } from '@/lib/translations'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getTranslations(locale as any)

  return {
    title: `${t.about.title} - Balloon Light Praha`,
    description: t.about.description1,
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <AboutContent />
}


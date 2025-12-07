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
    description: "Balloon Light Prag - partner pro kameramany a gaffery. Více než 15 let zkušeností na place. Specializujeme se na osvětlení bez stínů 360° bez blikání.",
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <AboutContent />
}


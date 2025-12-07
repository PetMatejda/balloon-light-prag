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
    description: "Naše osvětlení bylo použito v řadě úspěšných projektů - od hollywoodských trháků jako Blade Runner 2049 po lokální produkce. Prohlédněte si naše filmové projekty.",
  }
}

export default async function FilmsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <FilmsContent />
}


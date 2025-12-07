import { Metadata } from 'next'
import ReferencesContent from './ReferencesContent'
import { getTranslations } from '@/lib/translations'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getTranslations(locale as any)

  return {
    title: `${t.references.title} - Balloon Light Praha`,
    description: "Naše osvětlení bylo použito v řadě úspěšných filmových, televizních a reklamních projektů - od hollywoodských trháků po lokální produkce. Podívejte se na naše reference.",
  }
}

export default async function ReferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <ReferencesContent />
}


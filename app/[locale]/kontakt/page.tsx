import { Metadata } from 'next'
import ContactContent from './ContactContent'
import { getTranslations } from '@/lib/translations'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getTranslations(locale as any)

  return {
    title: `${t.contact.title} - Balloon Light Praha`,
    description: t.contact.subtitle,
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <ContactContent />
}


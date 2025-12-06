import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LangSetter from '@/components/LangSetter'
import { locales, defaultLocale } from '@/i18n-config'
import { getTranslations } from '@/lib/translations'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getTranslations(locale as any)

  return {
    title: t.meta.title,
    description: t.meta.description,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }

  return (
    <>
      <LangSetter />
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}

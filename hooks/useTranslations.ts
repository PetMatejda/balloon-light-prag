'use client'

import { useParams } from 'next/navigation'
import { getTranslations, type Locale } from '@/lib/translations'
import { defaultLocale, locales } from '@/i18n-config'

export function useTranslations() {
  const params = useParams()
  
  // Safely get locale from params
  let locale: Locale = defaultLocale
  
  if (params && typeof params === 'object' && 'locale' in params) {
    const localeParam = params.locale
    if (typeof localeParam === 'string' && locales.includes(localeParam as Locale)) {
      locale = localeParam as Locale
    }
  }
  
  const t = getTranslations(locale)

  return {
    t,
    locale,
  }
}

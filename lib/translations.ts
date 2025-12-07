import { type Locale } from '@/i18n-config'
import csMessages from '@/messages/cs.json'
import enMessages from '@/messages/en.json'
import huMessages from '@/messages/hu.json'
import esMessages from '@/messages/es.json'
import itMessages from '@/messages/it.json'
import deMessages from '@/messages/de.json'

type Messages = typeof csMessages

const messages: Record<Locale, Messages> = {
  cs: csMessages,
  en: enMessages,
  hu: huMessages,
  es: esMessages,
  it: itMessages,
  de: deMessages,
}

export type { Locale }
export function getTranslations(locale: Locale): Messages {
  return messages[locale] || messages.cs
}

export function getNestedTranslation(obj: any, path: string): string {
  const keys = path.split('.')
  let result: any = obj
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return path
    }
  }
  return typeof result === 'string' ? result : path
}

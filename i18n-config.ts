export const locales = ['cs', 'en', 'hu', 'es', 'it', 'de'] as const
export const defaultLocale = 'cs' as const
export type Locale = (typeof locales)[number]


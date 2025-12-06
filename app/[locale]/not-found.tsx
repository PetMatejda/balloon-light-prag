import Link from 'next/link'
import { defaultLocale } from '@/i18n-config'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-8 text-xl text-gray-400">Stránka nenalezena</p>
      <Link
        href={`/${defaultLocale}`}
        className="rounded-lg bg-white px-6 py-3 text-[#050505] transition-all hover:scale-105"
      >
        Zpět na hlavní stránku
      </Link>
    </div>
  )
}


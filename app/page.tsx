import Hero from '@/components/Hero'
import GearShowcase from '@/components/GearShowcase'
import TechnicalSpecs from '@/components/TechnicalSpecs'
import Gallery from '@/components/Gallery'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Hero />
      <GearShowcase />
      <TechnicalSpecs />
      <Gallery />
    </main>
  )
}

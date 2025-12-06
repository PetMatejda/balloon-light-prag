import HeroNew from '@/components/HeroNew'
import Features from '@/components/Features'
import ProductShowcase from '@/components/ProductShowcase'
import Gallery from '@/components/Gallery'
import TechnicalSpecs from '@/components/TechnicalSpecs'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <HeroNew />
      <Features />
      <ProductShowcase />
      <TechnicalSpecs />
      <Gallery />
    </div>
  )
}

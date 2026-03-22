import Navbar from '@/components/main/Navbar'
import Hero from '@/components/main/Hero'
import FeaturesSection from '@/components/main/FeaturesSection'
import PricingSection from '@/components/main/PricingSection'
import CtaSection from '@/components/main/CtaSection'
import Footer from '@/components/main/Footer'

export default function Home() {
  return (
    <main style={{ background: '#0a0a0a' }}>
      <Navbar />
      <Hero />

      {/* Section divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', margin: '0 48px' }} />

      <FeaturesSection />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', margin: '0 48px' }} />

      <PricingSection />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', margin: '0 48px' }} />

      <CtaSection />

      <Footer />
    </main>
  )
}

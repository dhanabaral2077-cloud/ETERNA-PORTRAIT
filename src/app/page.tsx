import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { Gallery } from '@/components/sections/gallery';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Story } from '@/components/sections/story';
import Testimonials from '@/components/sections/testimonials';
import { Pricing } from '@/components/sections/pricing';
import { CTA } from '@/components/sections/cta';
import { Footer } from '@/components/layout/footer';
import { AnimatedSection } from '@/components/animated-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Eterna Portrait',
            image: 'https://eternaportrait.com/og-image.jpg', // Replace with actual image URL if available
            description: 'Handcrafted digital art & museum-quality prints that celebrate your companion for a lifetime.',
            url: 'https://eternaportrait.com',
            priceRange: '$$',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'US', // Update if known
            },
            sameAs: [
              // Add social media links here if available
              // 'https://www.instagram.com/eternaportrait',
            ],
          }),
        }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimatedSection>
          <Gallery />
        </AnimatedSection>
        <AnimatedSection>
          <HowItWorks />
        </AnimatedSection>
        <AnimatedSection>
          <Testimonials />
        </AnimatedSection>
        <Story />
        <AnimatedSection>
          <Pricing />
        </AnimatedSection>
        <AnimatedSection>
          <CTA />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}

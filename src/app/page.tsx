import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { Showcase } from '@/components/sections/showcase';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Story } from '@/components/sections/story';
import { Testimonials } from '@/components/sections/testimonials';
import { Pricing } from '@/components/sections/pricing';
import { CTA } from '@/components/sections/cta';
import { Footer } from '@/components/layout/footer';
import { AnimatedSection } from '@/components/animated-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimatedSection>
          <Showcase />
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

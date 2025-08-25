import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function RefundsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-8">Refund Policy</h1>
          <div className="space-y-6 text-secondary leading-relaxed">
            <p>Last Updated: August 26, 2025</p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Our Commitment to Quality</h2>
            <p>
              At Eterna Portraits, each artwork is a unique, handcrafted masterpiece created specifically for you. Due to the highly personalized and custom nature of our work, we are unable to offer refunds or accept returns once an order is placed and the artistic process has begun.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">The Commission Process</h2>
            <p>
              Our process is collaborative. We work closely with you to ensure the portrait meets your expectations before it is finalized and shipped. We offer digital proofs and opportunities for revisions to guarantee your complete satisfaction with the artwork itself.
            </p>
            
            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Damages and Issues</h2>
            <p>
              We take the utmost care in packaging and shipping your artwork. Please inspect your order upon reception and contact us immediately if the item is defective, damaged, or if you receive the wrong item, so that we can evaluate the issue and make it right. We will work with our shipping partners to resolve any transit-related damages.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Cancellations</h2>
            <p>
              You may request a cancellation within 24 hours of placing your order for a full refund. After 24 hours, your commission is assigned to an artist, and the creation process begins. At this point, we can no longer accept cancellations.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Contact Us</h2>
            <p>
              For any questions regarding our refund policy or issues with your order, please contact us at <a href="mailto:support@eternaportraits.com" className="text-accent hover:underline">support@eternaportraits.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

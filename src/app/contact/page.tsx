import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Eterna Portrait Concierge',
  description: 'Get in touch with the Eterna Portrait team. We are here to help with photo selection, order status, and custom requests. 24/7 Support.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background pt-24 pb-16">
        <section className="px-6 md:px-16 text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <span className="text-primary font-medium tracking-wide uppercase text-sm mb-4 block">Here to Help</span>
            <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
              Contact Our <span className="italic text-primary">Concierge</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have a question about your order or need help choosing the perfect photo? Our dedicated team is ready to assist you.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-16 mb-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Card */}
            <div className="bg-card p-8 rounded-3xl border border-muted/50 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Mail size={32} />
              </div>
              <h3 className="font-headline text-2xl mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-6">
                For detailed inquiries, order updates, or photo checks. We typically reply within 24 hours.
              </p>
              <Button asChild variant="outline" className="rounded-full px-8">
                <a href="mailto:support@eternaportrait.com">support@eternaportrait.com</a>
              </Button>
            </div>

            {/* Live Chat / Social Card */}
            <div className="bg-card p-8 rounded-3xl border border-muted/50 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <MessageCircle size={32} />
              </div>
              <h3 className="font-headline text-2xl mb-2">Social Support</h3>
              <p className="text-muted-foreground mb-6">
                Quick question? DM us on Instagram or Facebook for a faster response during business hours.
              </p>
              <Button asChild className="rounded-full px-8">
                <Link href="https://www.instagram.com/eter.naportrait/" target="_blank">Message on Instagram</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="bg-secondary/20 py-20 px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-8">
              <div className="bg-card p-6 rounded-2xl border border-muted/30">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  How long does shipping take?
                </h3>
                <p className="text-muted-foreground">
                  We typically illustrate your portrait within 2-3 days. Printing and shipping takes another 3-5 business days. You can expect your portrait in about 7-10 days total.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-muted/30">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  Where do you ship from?
                </h3>
                <p className="text-muted-foreground">
                  We print locally in over 30 countries to ensure fast shipping and low carbon footprint. Your order will be printed at the facility closest to you.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-muted/30">
                <h3 className="font-bold text-lg mb-2">
                  Can I see a preview before printing?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We always email you a digital proof for approval before we print. We offer unlimited revisions until you are 100% happy.
                </p>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-muted/30">
                <h3 className="font-bold text-lg mb-2">
                  What if I don't like the result?
                </h3>
                <p className="text-muted-foreground">
                  We offer a 100% Smile Guarantee. If you aren't happy with the artwork after revisions, we will refund your money.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

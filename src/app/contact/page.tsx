import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="font-headline text-4xl md:text-5xl text-foreground">Contact Us</h1>
              <p className="text-secondary leading-relaxed text-lg">
                We would be delighted to hear from you. Whether you have a question about our process, a query about your order, or a special commission request, please do not hesitate to reach out. Our studio is dedicated to providing you with exceptional service.
              </p>
              <div className="space-y-2 text-secondary">
                <p><strong>Email:</strong> <a href="mailto:studio@eternaportraits.com" className="text-accent hover:underline">studio@eternaportraits.com</a></p>
                <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-lg">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                  <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                  <Input id="subject" placeholder="Inquiry about..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                  <Textarea id="message" placeholder="Please describe your inquiry in detail." rows={5} />
                </div>
                <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground px-10 py-3 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

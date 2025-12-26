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
            <p>Last Updated: December 26, 2025</p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Return Policy (30 Days)</h2>
            <p>
              We have a <strong>30-day return policy</strong>, which means you have 30 days after receiving your item to request a return.
            </p>
            <p>
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">How to Start a Return</h2>
            <p>
              To start a return, you can contact us at <a href="mailto:eternaportrait@gmail.com" className="text-accent hover:underline">eternaportrait@gmail.com</a>.
              If your return is accepted, we will provide you with instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Damages and Issues</h2>
            <p>
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Exceptions / Non-returnable items</h2>
            <p>
              Certain types of items cannot be returned, like custom products (such as special orders or personalized items like our Custom Pet Portraits). Please get in touch if you have questions or concerns about your specific item.
            </p>
            <p>
              <strong>Satisfaction Guarantee:</strong> While custom art is typically non-returnable, we want you to be 100% happy. If there is an issue with your specific portrait, please contact us so we can work on a solution, potentially including a reprint or correction.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Refunds</h2>
            <p>
              We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Cancellations</h2>
            <p>
              You may request a cancellation within 24 hours of placing your order for a full refund. After 24 hours, the creation process begins (artist assignment), and we can no longer accept cancellations.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">Contact Us</h2>
            <p>
              For any questions regarding our return & refund policy, please contact us at <a href="mailto:eternaportrait@gmail.com" className="text-accent hover:underline">eternaportrait@gmail.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-secondary leading-relaxed">
            <p>Last Updated: August 26, 2025</p>
            
            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">1. Introduction</h2>
            <p>
              Welcome to Eterna Portraits ("we," "our," or "us"). We are committed to protecting your privacy and handling your personal data in an open and transparent manner. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">2. Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us when you commission a portrait, contact us, or subscribe to our newsletter. This information may include:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Contact Data (e.g., name, email address, shipping address)</li>
              <li>Financial Data (e.g., payment card details, processed securely by our payment provider)</li>
              <li>Transaction Data (e.g., details about payments and the products you have purchased)</li>
              <li>Media Data (e.g., photographs of your pet that you provide for the commission)</li>
            </ul>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Fulfill your orders and create your custom pet portraits.</li>
              <li>Process payments and prevent fraudulent transactions.</li>
              <li>Communicate with you about your order, our services, and promotional offers.</li>
              <li>Improve our website and services.</li>
            </ul>
            
            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees and third parties who have a business need to know.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">5. Your Rights</h2>
            <p>
              You have certain rights in relation to your personal data, including the right to access, correct, or request the deletion of your personal data. To exercise these rights, please contact us.
            </p>

            <h2 className="font-headline text-2xl md:text-3xl text-foreground pt-6">6. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:eternaportrait@gmail.com" className="text-accent hover:underline">eternaportrait@gmail.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

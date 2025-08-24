import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Brush, PackageCheck } from 'lucide-react';

const processSteps = [
  {
    icon: <Upload className="h-10 w-10 text-primary" />,
    title: '1. Upload a Photo',
    description: "Choose your favorite photo of your pet. Clear, well-lit images work best to capture their unique details.",
  },
  {
    icon: <Brush className="h-10 w-10 text-primary" />,
    title: '2. Choose Your Style & Size',
    description: "Select from our digital or canvas options, and pick the perfect size for your space. Our artist begins creating your masterpiece.",
  },
  {
    icon: <PackageCheck className="h-10 w-10 text-primary" />,
    title: '3. Receive Your Portrait',
    description: "Your timeless portrait is delivered to you, either as a high-resolution digital file or a ready-to-hang canvas.",
  },
];

export function HowItWorks() {
  return (
    <section id="process" className="py-20 lg:py-28 bg-card">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-bold font-headline text-foreground">Your Masterpiece in Three Simple Steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {processSteps.map((step, index) => (
            <div 
              key={index} 
              className="text-center flex flex-col items-center p-6 rounded-lg transition-all duration-180 hover:shadow-xl hover:-translate-y-2 animate-fade-in-left" 
              style={{ animationDelay: `${index * 200}ms`, animationDuration: '700ms' }}
            >
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-headline font-semibold mb-2">{step.title}</h3>
                <p className="text-base text-muted-foreground max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

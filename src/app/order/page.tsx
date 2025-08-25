
'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Palette, Ruler, Pencil, CheckCircle, ShoppingCart } from "lucide-react";
import Script from "next/script";
import PayPalButton from "@/components/paypal-button";

const steps = [
  { label: "Upload", icon: UploadCloud },
  { label: "Style", icon: Palette },
  { label: "Size", icon: Ruler },
  { label: "Personalize", icon: Pencil },
  { label: "Checkout", icon: ShoppingCart },
  { label: "Confirm", icon: CheckCircle },
];

const prices: Record<string, number> = {
    digital: 25000,
    canvas: 45000,
    framed: 75000
};

export default function OrderPage() {
  const [step, setStep] = useState(0);
  const [selectedSize, setSelectedSize] = useState('canvas');

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const currentStep = steps[step];
  const priceInCents = prices[selectedSize] || 0;

  return (
    <>
      <Script src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}></Script>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 md:py-32 px-4 md:px-6">
          {/* Progress Bar */}
          <div className="w-full max-w-2xl mb-12">
            <div className="flex items-center justify-between">
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-center text-xs text-center flex-col w-20">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      idx < step ? "bg-green-500 border-green-500 text-white" :
                      idx === step ? "bg-primary border-primary text-primary-foreground" : "border-muted text-muted-foreground"
                    }`}
                  >
                    {idx < step ? <CheckCircle className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                  </div>
                  <span className={`mt-2 font-medium ${idx <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="relative w-full h-1 bg-muted rounded-full mt-4">
               <motion.div
                  className="absolute top-0 left-0 h-1 bg-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
               />
            </div>
          </div>

          {/* Form Content */}
          <div className="relative w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                className="bg-card p-8 md:p-12 rounded-2xl shadow-xl w-full"
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <h2 className="font-headline text-3xl text-foreground">1. Upload Your Pet's Photo</h2>
                    <p className="text-secondary">Upload your pet’s best photo for the perfect portrait. High-resolution images work best!</p>
                    <div className="border-2 border-dashed border-accent rounded-xl p-10 text-center text-muted-foreground flex flex-col items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors">
                      <UploadCloud className="w-12 h-12 text-accent mb-4" />
                      <span>Drag & Drop or Click to Upload</span>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-headline text-3xl text-foreground">2. Select Your Style</h2>
                     <RadioGroup defaultValue="signature" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["Classic", "Signature", "Masterpiece"].map((s) => (
                          <Label key={s} htmlFor={s} className="cursor-pointer">
                             <Card className="text-center p-6 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary transition-all hover:shadow-lg hover:-translate-y-1">
                                <RadioGroupItem value={s.toLowerCase()} id={s} className="sr-only" />
                                <CardContent className="p-0">
                                  <h3 className="font-headline text-xl text-foreground">{s}</h3>
                                </CardContent>
                             </Card>
                          </Label>
                        ))}
                      </RadioGroup>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-headline text-3xl text-foreground">3. Choose Size & Format</h2>
                    <RadioGroup defaultValue={selectedSize} onValueChange={setSelectedSize} className="space-y-4">
                      {[
                          { id: 'digital', name: 'Digital Only', price: '$250' },
                          { id: 'canvas', name: 'Canvas Print (18x24)', price: '$450' },
                          { id: 'framed', name: 'Framed Print (24x36)', price: '$750' }
                      ].map(item => (
                          <Label key={item.id} htmlFor={item.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary transition-all">
                              <div>
                                  <h4 className="font-headline text-lg text-foreground">{item.name}</h4>
                              </div>
                             <div className="flex items-center gap-4">
                               <span className="text-lg font-medium text-foreground">{item.price}</span>
                               <RadioGroupItem value={item.id} id={item.id} />
                             </div>
                          </Label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-headline text-3xl text-foreground">4. Personalization</h2>
                    <div className="space-y-2">
                      <Label htmlFor="pet-name">Pet's Name (Optional)</Label>
                      <Input id="pet-name" placeholder="E.g., Bella, Max, Luna" />
                      <p className="text-xs text-muted-foreground">The name will be rendered in an elegant calligraphy style.</p>
                    </div>
                    <div className="space-y-2">
                       <Label>Background Style</Label>
                       <RadioGroup defaultValue="artist" className="flex gap-4">
                          <Label htmlFor="bg-plain" className="border rounded-lg p-4 flex-1 text-center cursor-pointer has-[:checked]:border-primary transition-all">
                              <RadioGroupItem value="plain" id="bg-plain" className="sr-only" /> Plain
                          </Label>
                          <Label htmlFor="bg-gradient" className="border rounded-lg p-4 flex-1 text-center cursor-pointer has-[:checked]:border-primary transition-all">
                              <RadioGroupItem value="gradient" id="bg-gradient" className="sr-only" /> Soft Gradient
                          </Label>
                          <Label htmlFor="bg-artist" className="border rounded-lg p-4 flex-1 text-center cursor-pointer has-[:checked]:border-primary transition-all">
                              <RadioGroupItem value="artist" id="bg-artist" className="sr-only" /> Artist's Choice
                          </Label>
                       </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="font-headline text-3xl text-foreground">5. Review & Checkout</h2>
                    <div className="grid grid-cols-1 gap-4">
                       <Card>
                         <CardContent className="p-6">
                            <h3 className="font-headline text-lg mb-4">Order Summary</h3>
                            <div className="flex justify-between items-center text-secondary">
                                <span>Selected Size: <span className="font-medium text-foreground capitalize">{selectedSize}</span></span>
                                <span>${(priceInCents / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-foreground mt-4 pt-4 border-t">
                                <span>Total</span>
                                <span>${(priceInCents / 100).toFixed(2)}</span>
                            </div>
                         </CardContent>
                       </Card>

                      <div className="pt-4">
                         <PayPalButton orderId="test-order-123" priceCents={priceInCents} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="text-center space-y-4 py-8">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                       <h2 className="font-headline text-4xl text-foreground">Thank You!</h2>
                    </motion.div>
                    <p className="text-secondary max-w-md mx-auto">
                      Your pet's portrait is now in progress. We’ll send an email with your order number and update you as the artwork moves from sketch → painting → delivery.
                    </p>
                    <p className="text-sm text-muted-foreground pt-4">Share the excitement! #PetMasterpiece</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                {step < 4 && (
                  <div className="flex justify-between items-center pt-8">
                    <Button variant="outline" onClick={back} disabled={step === 0} className="rounded-full">
                      Back
                    </Button>
                    <Button onClick={next} className="rounded-full bg-primary text-primary-foreground px-10 py-3 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
                      Next
                    </Button>
                  </div>
                )}
                 {step === 4 && (
                   <div className="flex justify-between items-center pt-8">
                      <Button variant="outline" onClick={back} disabled={step === 0} className="rounded-full">
                        Back
                      </Button>
                   </div>
                 )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

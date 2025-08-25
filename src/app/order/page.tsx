
'use client';

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Palette, Ruler, Pencil, CheckCircle, ShoppingCart, Loader2, Gem, Brush, Sparkles } from "lucide-react";
import Script from "next/script";
import PayPalButton from "@/components/paypal-button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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

const styleOptions = [
    { id: 'classic', name: 'Classic', description: 'Timeless & Elegant', icon: Brush },
    { id: 'signature', name: 'Signature', description: 'Rich & Expressive', icon: Sparkles },
    { id: 'masterpiece', name: 'Masterpiece', description: 'Grand & Ornate', icon: Gem },
]

export default function OrderPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    style: 'signature',
    size: 'canvas',
    petName: '',
    background: 'artist',
    notes: '',
    name: '',
    email: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image under 10MB." });
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const next = () => setStep((s) => {
    if (s === 0 && !photoFile) {
        toast({ variant: "destructive", title: "No Photo Uploaded", description: "Please upload a photo of your pet to continue." });
        return s;
    }
    return Math.min(s + 1, steps.length - 1);
  });
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        // 1. Get signed URL
        const uploadUrlRes = await fetch("/api/upload-url");
        if (!uploadUrlRes.ok) throw new Error("Could not get upload URL.");
        const { url: signedUrl, path } = await uploadUrlRes.json();

        // 2. Upload file to signed URL
        const uploadRes = await fetch(signedUrl, { method: "PUT", body: photoFile });
        if (!uploadRes.ok) throw new Error("Failed to upload photo.");

        // 3. Create order in our DB
        const orderRes = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                photoUrl: path,
                priceCents: prices[formData.size],
                // These are mock values for now, would come from form in a real scenario
                name: 'John Doe',
                email: 'john.doe@example.com',
            }),
        });
        if (!orderRes.ok) throw new Error("Failed to create order.");
        const orderData = await orderRes.json();

        setOrderId(orderData.orderId);
        // The PayPal button will now be rendered with the correct orderId
        // The user will click the PayPal button to complete the payment
        toast({ title: "Order created!", description: "Please complete your payment below." });
        
    } catch (error: any) {
        toast({ variant: "destructive", title: "Submission Failed", description: error.message || "An unexpected error occurred." });
    } finally {
        setIsSubmitting(false);
    }
  };


  const currentStep = steps[step];
  const priceInCents = prices[formData.size] || 0;

  return (
    <>
      <Script src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}></Script>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 md:py-32 px-4 md:px-6">
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
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/webp" className="hidden" />
                    <div onClick={triggerFileInput} className="border-2 border-dashed border-accent rounded-xl p-10 text-center text-muted-foreground flex flex-col items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors">
                      {photoPreview ? (
                        <Image src={photoPreview} alt="Pet preview" width={150} height={150} className="rounded-lg object-cover" />
                      ) : (
                        <>
                         <UploadCloud className="w-12 h-12 text-accent mb-4" />
                         <span>Drag & Drop or Click to Upload</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {step === 1 && (
                    <div className="space-y-8">
                        <h2 className="font-headline text-3xl text-foreground text-center">2. Select Your Style</h2>
                        <RadioGroup value={formData.style} onValueChange={(v) => handleChange('style', v)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {styleOptions.map((s) => {
                                const Icon = s.icon;
                                return (
                                <Label key={s.id} htmlFor={s.id} className="cursor-pointer group">
                                    <Card className="text-center p-6 rounded-xl has-[:checked]:border-accent has-[:checked]:ring-2 has-[:checked]:ring-accent has-[:checked]:bg-accent/5 transition-all duration-300 ease-in-out-quad hover:shadow-xl hover:-translate-y-1.5">
                                    <RadioGroupItem value={s.id} id={s.id} className="sr-only" />
                                    <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
                                        <Icon className="w-10 h-10 text-accent group-has-[:checked]:text-accent-foreground group-has-[:checked]:bg-accent p-2 rounded-full transition-colors duration-300" />
                                        <h3 className="font-headline text-2xl text-foreground">{s.name}</h3>
                                        <p className="text-sm text-muted-foreground">{s.description}</p>
                                    </CardContent>
                                    </Card>
                                </Label>
                                );
                            })}
                        </RadioGroup>
                    </div>
                )}


                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-headline text-3xl text-foreground">3. Choose Size & Format</h2>
                    <RadioGroup value={formData.size} onValueChange={(v) => handleChange('size', v)} className="space-y-4">
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
                      <Input id="pet-name" value={formData.petName} onChange={(e) => handleChange('petName', e.target.value)} placeholder="E.g., Bella, Max, Luna" />
                      <p className="text-xs text-muted-foreground">The name will be rendered in an elegant calligraphy style.</p>
                    </div>
                    <div className="space-y-2">
                       <Label>Background Style</Label>
                       <RadioGroup value={formData.background} onValueChange={(v) => handleChange('background', v)} className="flex gap-4">
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
                                <span>Style: <span className="font-medium text-foreground capitalize">{formData.style}</span></span>
                            </div>
                            <div className="flex justify-between items-center text-secondary">
                                <span>Size: <span className="font-medium text-foreground capitalize">{formData.size}</span></span>
                                <span>${(priceInCents / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-foreground mt-4 pt-4 border-t">
                                <span>Total</span>
                                <span>${(priceInCents / 100).toFixed(2)}</span>
                            </div>
                         </CardContent>
                       </Card>

                      <div className="pt-4">
                         {orderId ? (
                            <PayPalButton orderId={orderId} priceCents={priceInCents} />
                         ) : (
                           <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full rounded-full bg-primary text-primary-foreground px-10 py-3 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Complete My Commission"}
                           </Button>
                         )}
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

    
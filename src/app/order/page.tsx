
'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Palette, Ruler, Pencil, CheckCircle, ShoppingCart, Loader2 } from "lucide-react";
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
    { id: 'classic', name: 'Classic', description: 'Timeless & Elegant' },
    { id: 'signature', name: 'Signature', description: 'Rich & Expressive' },
    { id: 'masterpiece', name: 'Masterpiece', description: 'Grand & Ornate' },
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
  const [showPhotoError, setShowPhotoError] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (showPhotoError) {
      toast({ variant: "destructive", title: "No Photo Uploaded", description: "Please upload a photo of your pet to continue." });
      setShowPhotoError(false); // Reset the trigger
    }
  }, [showPhotoError, toast]);

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
        setShowPhotoError(true);
        return s;
    }
    return Math.min(s + 1, steps.length - 1);
  });
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmitToCheckout = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
        if (!photoFile) {
          throw new Error("Please upload a photo of your pet.");
        }
        // 1. Get signed URL (mocked)
        const uploadUrlRes = await fetch("/api/upload-url");
        if (!uploadUrlRes.ok) throw new Error("Could not get upload URL.");
        const { url: signedUrl, path } = await uploadUrlRes.json();

        // In a real scenario, you'd upload the file here
        // await fetch(signedUrl, { method: "PUT", body: photoFile });
        console.log("Mock photo path:", path);
        console.log("Mock signed URL:", signedUrl);
        
        // 2. Create order in our DB
        const orderRes = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                photoUrl: path,
                priceCents: prices[formData.size],
                name: 'John Doe', // Placeholder
                email: 'john.doe@example.com', // Placeholder
            }),
        });

        if (!orderRes.ok) {
           const errorBody = await orderRes.json();
           throw new Error(errorBody.error || "Failed to create order.");
        }
        const orderData = await orderRes.json();
        
        if (!orderData.orderId) {
            throw new Error("Failed to retrieve order ID.");
        }

        setOrderId(orderData.orderId);
        toast({ title: "Order created!", description: "Please complete your payment below." });
        setStep(4); // Move to checkout step
        
    } catch (error: any) {
        toast({ variant: "destructive", title: "Submission Failed", description: error.message || "An unexpected error occurred." });
    } finally {
        setIsSubmitting(false);
    }
  };

  const onPaymentSuccess = () => {
    toast({
        title: "Payment Successful!",
        description: "Your commission is now in the hands of our talented artists."
    });
    setStep(5); // Move to confirmation step
  };

  const onPaymentError = (error: any) => {
    console.error("PayPal Error:", error);
    toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Something went wrong with the payment. Please try again."
    });
  }


  const currentStep = steps[step];
  const priceInCents = prices[formData.size] || 0;

  return (
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
                            {styleOptions.map((s) => (
                                <Label key={s.id} htmlFor={s.id} className="cursor-pointer group">
                                    <Card className="text-center p-6 rounded-xl has-[:checked]:border-accent has-[:checked]:ring-2 has-[:checked]:ring-accent has-[:checked]:bg-accent/5 transition-all duration-300 ease-in-out-quad hover:shadow-lg hover:-translate-y-1">
                                        <RadioGroupItem value={s.id} id={s.id} className="sr-only" />
                                        <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                                            <h3 className="font-headline text-2xl text-foreground">{s.name}</h3>
                                            <p className="text-sm text-muted-foreground h-10 flex items-center">{s.description}</p>
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
                    <h2 className="font-headline text-3xl text-foreground">4. Personalize & Review</h2>
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
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="font-headline text-3xl text-foreground">5. Complete Your Payment</h2>
                    <Card>
                         <CardContent className="p-6">
                            <h3 className="font-headline text-lg mb-4">Final Invoice</h3>
                            <div className="flex justify-between items-center text-secondary">
                                <span>Style: <span className="font-medium text-foreground capitalize">{formData.style}</span></span>
                            </div>
                             <div className="flex justify-between items-center text-secondary">
                                <span>Size: <span className="font-medium text-foreground capitalize">{formData.size}</span></span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-foreground mt-4 pt-4 border-t">
                                <span>Total</span>
                                <span>${(priceInCents / 100).toFixed(2)}</span>
                            </div>
                         </CardContent>
                    </Card>

                    <div className="pt-4 text-center">
                         {orderId ? (
                            <PayPalButton 
                                orderId={orderId} 
                                amount={priceInCents / 100}
                                onSuccess={onPaymentSuccess}
                                onError={onPaymentError}
                            />
                         ) : (
                           <div className="flex items-center justify-center flex-col gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin" />
                                <p>Securing your commission...</p>                           </div>
                         )}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="text-center space-y-4 py-8">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                       <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                       <h2 className="font-headline text-4xl text-foreground">Thank You!</h2>
                    </motion.div>
                    <p className="text-secondary max-w-md mx-auto">
                      Your pet's portrait is now in progress. We’ll send an email with your order number and update you as the artwork moves from sketch → painting → delivery.
                    </p>
                    <p className="text-sm text-muted-foreground pt-4">Share the excitement! #PetMasterpiece</p>
                     <Button onClick={() => router.push('/')} className="rounded-full bg-primary text-primary-foreground px-10 py-3 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all mt-6">
                        Back to Home
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8">
                    {step > 0 && step < 4 && (
                        <Button variant="outline" onClick={back} className="rounded-full">Back</Button>
                    )}
                    {step === 0 && <div/>}
                    
                    {step < 3 && (
                        <Button onClick={next} className="rounded-full bg-primary text-primary-foreground px-10 py-3 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">Next</Button>
                    )}
                    
                    {step === 3 && (
                       <Button onClick={handleSubmitToCheckout} disabled={isSubmitting} className="w-full max-w-xs ml-auto rounded-full bg-primary text-primary-foreground px-10 py-3 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : "Proceed to Payment"}
                       </Button>
                    )}

                    {step === 4 && (
                         <Button variant="outline" onClick={back} disabled={isSubmitting} className="rounded-full">Back to Review</Button>
                    )}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
  );
}

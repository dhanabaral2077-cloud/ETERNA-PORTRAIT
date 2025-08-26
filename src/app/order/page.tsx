
'use client';

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, CheckCircle, Loader2, Check, AlertCircle } from "lucide-react";
import PayPalButton from "@/components/paypal-button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

const packages = {
    classic: {
        id: 'classic',
        name: 'Classic',
        price: 45000,
        priceFormatted: '$450',
        description: 'For those seeking timeless elegance in a smaller format.',
        features: ['High-resolution digital file', 'One pet included', 'Fine art canvas print (12x16)'],
    },
    signature: {
        id: 'signature',
        name: 'Signature',
        price: 95000,
        priceFormatted: '$950',
        description: 'Our most popular commission — premium and refined.',
        features: ['High-resolution digital file', 'Up to two pets', 'Premium canvas print (18x24)', 'Hand-finished brush details'],
        highlight: true,
    },
    masterpiece: {
        id: 'masterpiece',
        name: 'Masterpiece',
        price: 180000,
        priceFormatted: '$1800',
        description: 'For collectors who demand the grandest expression.',
        features: ['High-resolution digital file', 'Up to three pets', 'Large-format canvas (24x36)', 'Luxury gilded frame', 'Priority commission'],
    },
} as const;

type PackageKey = keyof typeof packages;

function OrderForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [step, setStep] = useState(0); // 0: Form, 1: Success
    const [selectedPackageKey, setSelectedPackageKey] = useState<PackageKey | null>(null);

    const [formData, setFormData] = useState({
        petName: '',
        background: 'artist',
        notes: '',
        name: 'Jane Doe', // Placeholder
        email: 'jane@example.com' // Placeholder
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const pkg = searchParams.get('pkg') as PackageKey;
        if (pkg && packages[pkg]) {
            setSelectedPackageKey(pkg);
            // Create a temporary order ID for PayPal
            setOrderId(`TEMP-${Date.now()}`);
        } else {
            // Handle case where no package or invalid package is selected
            // No toast here, the component will render the "No Package Selected" state
        }
    }, [searchParams]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ variant: "destructive", title: "File Too Large", description: "Please upload an image smaller than 5MB." });
                return;
            }
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const validateForm = () => {
        if (!photoFile) {
            toast({ variant: "destructive", title: "No Photo Uploaded", description: "Please upload a photo of your pet." });
            return false;
        }
        return true;
    };

    const onPaymentSuccess = async () => {
        if (isSubmitting || !validateForm()) return;
        setIsSubmitting(true);
        
        toast({ title: "Payment Complete!", description: "Finalizing your order..." });

        try {
            const scriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
            if (!scriptUrl || !selectedPackageKey) {
                throw new Error("Configuration error or missing package selection.");
            }
            
            const selectedPackage = packages[selectedPackageKey];

            const orderDetails = new FormData();
            orderDetails.append('customerName', formData.name);
            orderDetails.append('customerEmail', formData.email);
            orderDetails.append('petName', formData.petName);
            orderDetails.append('style', 'Artist Choice'); // Style is now simplified
            orderDetails.append('package', selectedPackage.name);
            orderDetails.append('price', (selectedPackage.price / 100).toFixed(2));
            orderDetails.append('notes', formData.notes);
            orderDetails.append('file', photoFile!);

            const response = await fetch(scriptUrl, {
                method: "POST",
                body: orderDetails,
                mode: 'no-cors' 
            });

            toast({
                title: "Order Submitted!",
                description: "Your commission is now in the hands of our talented artists."
            });
            setStep(1); // Move to final confirmation step
        } catch (error: any) {
            console.error("Submission Error After Payment:", error);
            toast({ 
                variant: "destructive", 
                title: "Order Submission Failed", 
                description: "Your payment was successful, but we had trouble submitting your order details. Please contact support." 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPaymentError = (error: any) => {
        console.error("PayPal Error:", error);
        toast({
            variant: "destructive",
            title: "Payment Failed",
            description: "Something went wrong with the payment. Please try again."
        });
    };
    
    if (!selectedPackageKey) {
        return (
            <div className="text-center p-8">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                <h2 className="mt-4 text-2xl font-semibold text-foreground">No Package Selected</h2>
                <p className="mt-2 text-muted-foreground">
                    Please start by choosing a portrait package.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/#pricing">View Pricing</Link>
                </Button>
            </div>
        );
    }
    
    const selectedPackage = packages[selectedPackageKey];
    const priceInCents = selectedPackage.price;

    return (
        <AnimatePresence mode="wait">
            {step === 0 && (
                <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-card p-8 md:p-12 rounded-2xl shadow-xl w-full grid md:grid-cols-2 gap-12"
                >
                    {/* Left Side: Form */}
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl text-foreground">Your Commission</h2>
                        
                        {/* --- PHOTO UPLOAD --- */}
                        <div>
                            <Label>1. Your Pet's Photo</Label>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/webp" className="hidden" />
                            <div onClick={triggerFileInput} className="mt-2 border-2 border-dashed border-accent rounded-xl p-6 text-center text-muted-foreground flex flex-col items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors">
                                {photoPreview ? (
                                    <Image src={photoPreview} alt="Pet preview" width={120} height={120} className="rounded-lg object-cover" />
                                ) : (
                                    <>
                                        <UploadCloud className="w-10 h-10 text-accent mb-2" />
                                        <span>Click to Upload Photo</span>
                                        <span className="text-xs mt-1">(Max 5MB)</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* --- PET'S NAME --- */}
                        <div className="space-y-2">
                          <Label htmlFor="pet-name">2. Pet's Name (Optional)</Label>
                          <Input id="pet-name" value={formData.petName} onChange={(e) => handleChange('petName', e.target.value)} placeholder="E.g., Bella, Max, Luna" />
                        </div>
                        
                        {/* --- NOTES --- */}
                         <div className="space-y-2">
                          <Label htmlFor="notes">3. Notes for the Artist (Optional)</Label>
                          <Input id="notes" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="E.g., capture the white spot on his chest" />
                        </div>

                    </div>

                    {/* Right Side: Summary & Payment */}
                    <div className="space-y-6">
                         <h3 className="font-headline text-2xl text-foreground">Order Summary</h3>
                         <Card>
                             <CardContent className="p-6">
                                <div className="flex justify-between items-center text-lg font-bold text-foreground">
                                    <span>{selectedPackage.name} Package</span>
                                    <span>{selectedPackage.priceFormatted}</span>
                                </div>
                                <ul className="text-secondary space-y-1.5 text-sm mt-4">
                                  {selectedPackage.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                      <Check className="text-accent mr-2 h-4 w-4 mt-0.5 shrink-0" /> {feature}
                                    </li>
                                  ))}
                                </ul>
                                <div className="flex justify-between items-center text-xl font-bold text-foreground mt-4 pt-4 border-t">
                                    <span>Total</span>
                                    <span>{selectedPackage.priceFormatted}</span>
                                </div>
                             </CardContent>
                        </Card>

                        <div className="pt-4 text-center">
                            {isSubmitting ? (
                                <div className="flex items-center justify-center flex-col gap-2 text-muted-foreground">
                                    <Loader2 className="animate-spin" />
                                    <p>Finalizing your order...</p>
                                </div>
                             ) : (
                                orderId && (
                                    <div
                                      className={`${!photoFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      title={!photoFile ? "Please upload a photo to proceed" : ""}
                                    >
                                      <div className={`${!photoFile ? 'pointer-events-none' : ''}`}>
                                        <PayPalButton 
                                            orderId={orderId} 
                                            amount={priceInCents / 100}
                                            onSuccess={onPaymentSuccess}
                                            onError={onPaymentError}
                                        />
                                      </div>
                                    </div>
                               )
                             )}
                        </div>
                    </div>

                </motion.div>
            )}

            {step === 1 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-8 max-w-md mx-auto"
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h2 className="font-headline text-4xl text-foreground">Thank You!</h2>
                  <p className="text-secondary max-w-md mx-auto">
                    Your pet's portrait is now in progress. We’ll send an email with your order number and update you as the artwork moves from sketch → painting → delivery.
                  </p>
                  <Button onClick={() => router.push('/')} className="rounded-full bg-primary text-primary-foreground px-10 py-3 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all mt-6">
                    Back to Home
                  </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function OrderPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-24 md:py-32 px-4 md:px-6">
        <div className="w-full max-w-4xl">
            <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin mx-auto" />}>
                <OrderForm />
            </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

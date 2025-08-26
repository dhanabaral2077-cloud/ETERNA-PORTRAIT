
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
import { UploadCloud, CheckCircle, Loader2, Check, AlertCircle, Trash2 } from "lucide-react";
import PayPalButton from "@/components/paypal-button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/lib/supabase-client';

const packages = {
    classic: {
        id: 'classic',
        name: 'Classic',
        price: 45000,
        priceFormatted: '$450',
        description: 'For those seeking timeless elegance in a smaller format.',
        features: ['High-resolution digital file', 'One pet included', 'Fine art canvas print (12x16)'],
        maxPets: 1,
    },
    signature: {
        id: 'signature',
        name: 'Signature',
        price: 95000,
        priceFormatted: '$950',
        description: 'Our most popular commission — premium and refined.',
        features: ['High-resolution digital file', 'Up to two pets', 'Premium canvas print (18x24)', 'Hand-finished brush details'],
        highlight: true,
        maxPets: 2,
    },
    masterpiece: {
        id: 'masterpiece',
        name: 'Masterpiece',
        price: 180000,
        priceFormatted: '$1800',
        description: 'For collectors who demand the grandest expression.',
        features: ['High-resolution digital file', 'Up to three pets', 'Large-format canvas (24x36)', 'Luxury gilded frame', 'Priority commission'],
        maxPets: 3,
    },
} as const;

type PackageKey = keyof typeof packages;
type StyleOption = "artist" | "renaissance" | "classic_oil";

function OrderForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [step, setStep] = useState(0); // 0: Form, 1: Success
    const [selectedPackageKey, setSelectedPackageKey] = useState<PackageKey | null>(null);

    const [formData, setFormData] = useState({
        petName: '',
        style: 'artist' as StyleOption,
        notes: '',
        name: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        stateProvinceRegion: '',
        postalCode: '',
        country: '',
    });
    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const pkg = searchParams.get('pkg') as PackageKey;
        if (pkg && packages[pkg]) {
            setSelectedPackageKey(pkg);
        }
    }, [searchParams]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && selectedPackageKey) {
            const selectedPackage = packages[selectedPackageKey];
            const newFiles = Array.from(files);

            if ((photoFiles.length + newFiles.length) > selectedPackage.maxPets) {
                toast({ variant: "destructive", title: "Too Many Photos", description: `You can upload a maximum of ${selectedPackage.maxPets} photos for this package.` });
                return;
            }

            setPhotoFiles(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPhotoPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotoFiles(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviews(prev => {
            const newPreviews = [...prev];
            const removed = newPreviews.splice(index, 1);
            URL.revokeObjectURL(removed[0]);
            return newPreviews;
        });
    };

    const validateForm = () => {
        // Required fields
        const requiredFields = {
            name: "Please enter your full name.",
            email: "Please enter your email address.",
            addressLine1: "Please enter your address.",
            city: "Please enter your city.",
            postalCode: "Please enter your postal code.",
            country: "Please enter your country."
        };

        for (const [field, message] of Object.entries(requiredFields)) {
            if (!formData[field as keyof typeof formData]) {
                toast({ variant: "destructive", title: "Missing Information", description: message });
                return false;
            }
        }
        
        if (!/\S+@\S+\.\S+/.test(formData.email)) { 
            toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." }); 
            return false; 
        }
        if (photoFiles.length === 0) { 
            toast({ variant: "destructive", title: "No Photo Uploaded", description: "Please upload at least one photo of your pet." }); 
            return false; 
        }
        return true;
    };
    
    const onPaymentSuccess = async (paypalOrderId: string) => {
        if (!validateForm() || !selectedPackageKey) return;
        
        setIsSubmitting(true);
        
        try {
            const orderFolderName = `orders/${Date.now()}`;
            // 1. Upload files to Supabase Storage in a dedicated folder
            const uploadPromises = photoFiles.map(file => {
                const filePath = `${orderFolderName}/${file.name}`;
                return supabase.storage.from('orders').upload(filePath, file);
            });

            const uploadResults = await Promise.all(uploadPromises);

            const photoUrls: string[] = [];
            for (const result of uploadResults) {
                if (result.error) throw new Error(`File upload failed: ${result.error.message}`);
                const { data } = supabase.storage.from('orders').getPublicUrl(result.data.path);
                photoUrls.push(data.publicUrl);
            }

            // 2. Submit order details to our backend
            const selectedPackage = packages[selectedPackageKey];
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    pkg: { name: selectedPackage.name, id: selectedPackage.id },
                    price: selectedPackage.price,
                    photoUrls,
                    storageFolder: orderFolderName,
                    paypalOrderId,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save order.');
            }
            
            setStep(1); // Move to success screen
        } catch (error) {
            onPaymentError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPaymentError = (error: any) => {
        console.error("Submission or Payment Error:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error instanceof Error ? error.message : "There was a problem submitting your order. Please contact support.",
        });
        setIsSubmitting(false);
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
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl text-foreground">Your Commission</h2>
                        
                        <div>
                            <Label>1. Contact & Shipping</Label>
                            <div className="mt-2 space-y-4">
                                <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Full Name" required />
                                <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="your.email@example.com" required />
                                <Input value={formData.addressLine1} onChange={(e) => handleChange('addressLine1', e.target.value)} placeholder="Address Line 1" required />
                                <Input value={formData.addressLine2} onChange={(e) => handleChange('addressLine2', e.target.value)} placeholder="Address Line 2 (Optional)" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="City" required />
                                    <Input value={formData.stateProvinceRegion} onChange={(e) => handleChange('stateProvinceRegion', e.target.value)} placeholder="State / Province" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input value={formData.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} placeholder="Postal Code" required />
                                    <Input value={formData.country} onChange={(e) => handleChange('country', e.target.value)} placeholder="Country" required />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label>2. Your Pet's Photo(s) (up to {selectedPackage.maxPets})</Label>
                             <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {photoPreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <Image src={preview} alt={`Pet preview ${index + 1}`} width={150} height={150} className="rounded-lg object-cover w-full h-40" />
                                        <button onClick={(e) => { e.stopPropagation(); removePhoto(index); }} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {photoFiles.length < selectedPackage.maxPets && (
                                    <div>
                                        <input type="file" ref={el => fileInputRefs.current[photoFiles.length] = el} onChange={handleFileChange} accept="image/jpeg,image/png,image/webp" className="hidden" />
                                        <div onClick={() => fileInputRefs.current[photoFiles.length]?.click()} className="border-2 border-dashed border-accent rounded-xl p-4 text-center text-muted-foreground flex flex-col items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors h-40 relative group">
                                            <UploadCloud className="w-8 h-8 text-accent mb-2" />
                                            <span className="text-sm">Upload Photo(s)</span>
                                            <span className="text-xs mt-1">(Max 10MB)</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>3. Choose a Style</Label>
                            <RadioGroup value={formData.style} onValueChange={(value) => handleChange('style', value as StyleOption)} className="grid grid-cols-3 gap-4 pt-2">
                                <div>
                                    <RadioGroupItem value="artist" id="artist" className="peer sr-only" />
                                    <Label htmlFor="artist" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors duration-300 ease-in-out hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary">
                                        Artist Choice
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="renaissance" id="renaissance" className="peer sr-only" />
                                    <Label htmlFor="renaissance" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors duration-300 ease-in-out hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary">
                                        Renaissance
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="classic_oil" id="classic_oil" className="peer sr-only" />
                                    <Label htmlFor="classic_oil" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors duration-300 ease-in-out hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary">
                                        Classic Oil
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pet-name">4. Pet's Name(s) (Optional)</Label>
                          <Input id="pet-name" value={formData.petName} onChange={(e) => handleChange('petName', e.target.value)} placeholder="E.g., Bella, Max & Luna" />
                        </div>
                        
                         <div className="space-y-2">
                          <Label htmlFor="notes">5. Notes for the Artist (Optional)</Label>
                          <Input id="notes" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="E.g., capture the white spot on his chest" />
                        </div>
                    </div>

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

                        <div className="p-4 text-center bg-background/50 rounded-lg border border-border/50">
                            <p className="text-sm font-semibold mb-3 text-muted-foreground">Secure Payments By:</p>
                            <div className="flex justify-center items-center space-x-4">
                                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-7 transition-transform duration-200 ease-in-out hover:scale-110" />
                                <svg width="49" height="30" viewBox="0 0 49 30" className="h-7 transition-transform duration-200 ease-in-out hover:scale-110"><path fill="#0055A4" d="M32.8.2c-2-.3-4.6.6-5.8 2.5-1.1 1.7-1.1 3.8-.4 5.7.7 1.8 2.4 2.8 4.1 2.8h4.4V11c-1.6 0-3.1-.3-4.5-.8-.7-.3-1.4-.6-2.1-.9-3.2-1.6-6-4.5-5.8-8.2.3-3 2.9-4.8 5.7-5C31.1-.3 34.6-.2 37 1.1c1.3.7 2.3 1.7 3 3l-4 2.1c-.3-.6-.8-1.1-1.4-1.5-1.2-.7-2.6-.9-3.8-.5zm13.2 2.1c-1-1.3-2.5-2.2-4.1-2.4-2.2-.2-4.5.7-5.9 2.5-1.2 1.5-1.6 3.4-1.3 5.3.3 2.2 1.7 3.8 3.8 4.7l-3.3 9.4c-.4 1 .2 2.2 1.3 2.6.4.1.8.2 1.2.2.9 0 1.7-.5 2.1-1.3l6.3-17.9c.5-1.6.2-3.3-.8-4.6zM22.9 5.2c-.5-1.5-1.8-2.6-3.4-2.8-2.2-.2-4.4.9-5.6 2.8-.8 1.4-1 3.1-.6 4.7.4 1.7 1.6 3 3.3 3.5.7.2 1.4.3 2.1.3 1.2 0 2.4-.4 3.4-1.2l-3.9-2.2c-.3.4-.6.8-.8 1.2-.5 1-1.5 1.7-2.7 1.5-1-.2-1.7-.9-1.9-1.8-.3-1.2.2-2.5 1.3-3.1.5-.3 1.1-.5 1.7-.5.6 0 1.2.1 1.7.4l4.3-2.3zM15.4 17l-1.3 3.8c-.5 1.5.3 3 1.8 3.4 1.5.5 3-.3 3.4-1.8l6.1-17.3C26 2.9 24.7 1 22.8.5c-2-.5-4.1.4-5.1 2.2L15.4 17zm-15 4.8C.1 21.3-.1 20.5.1 19.6l3.5-11c.4-1.2 1.6-2 2.8-2h6.2c.4 0 .7.3.7.6s-.3.6-.7.6H6.4c-.6 0-1.1.3-1.3.9L1.7 21c-.2.6.1 1.2.7 1.4.6.2 1.2-.1 1.4-.7l.8-2.4h5.5l-1.4 4.3c-.5 1.5.3 3 1.8 3.4 1.5.5 3-.3 3.4-1.8l1.3-3.8h-9c-.3 0-.6.3-.7.6z"></path></svg>
                                <svg width="50" height="30" viewBox="0 0 38 24" className="h-7 transition-transform duration-200 ease-in-out hover:scale-110"><path d="M35.25 6.4H2.75A2.75 2.75 0 000 9.15v10.7C0 22.69 1.23 24 2.75 24h32.5A2.75 2.75 0 0038 21.25V9.15A2.75 2.75 0 0035.25 6.4zM31.22 19.46l-4.5-4.5 4.5-4.5 1.56 1.56-2.94 2.94 2.94 2.94-1.56 1.56zM15.65 18h-2.34l2.34-12h2.34l-2.34 12zm-6.26 0H7.05l2.34-12h2.34L9.39 18zm-4.68 0H2.37l2.34-12h2.34L4.71 18zM25.4 18h-2.34l.8-3.4h-3.9l-.8 3.4h-2.34l3.54-12h3.54l-2.04 12z" fill="#000"></path><circle cx="15.5" cy="12" r="7" fill="#F79E1B"></circle><path d="M15.5 5c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 11.5c-2.49 0-4.5-2.01-4.5-4.5S13.01 7.5 15.5 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" fill="#EB001B"></path><path d="M20 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" fill="#F79E1B"></path></svg>
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="h-7 transition-transform duration-200 ease-in-out hover:scale-110"><path d="M14.52.48a1.2 1.2 0 00-1.04-.48h-11a1.2 1.2 0 00-1.04.48A1.2 1.2 0 001 1.52v13a1.2 1.2 0 00.48 1.04A1.2 1.2 0 002.52 16h11a1.2 1.2 0 001.04-.48A1.2 1.2 0 0015 14.48v-13a1.2 1.2 0 00-.48-1.04zM8.36 12.4H5.68V7.52h2.68a1.69 1.69 0 110 4.88zM8.8 3.68H5.24V5.6h3.56z" fill="#2566AF"></path></svg>
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 transition-transform duration-200 ease-in-out hover:scale-110"><path d="M24 6.81a4.2 4.2 0 00-3.3-3.6C16.9.11 12.31 0 12 0s-4.9.11-8.7 3.2A4.2 4.2 0 000 6.81c-.1 2.3.6 6.5 4.1 8.1 3.5 1.6 7.9 1.6 7.9 1.6s4.4 0 7.9-1.6c3.5-1.6 4.2-5.8 4.1-8.1zm-17.4 6.2a.9.9 0 01-1-1.2l2-3.5a.9.9 0 111.5.9l-2 3.5a.9.9 0 01-.5.3zm3.1-1.3a.9.9 0 01-1.2-.5l1.3-2.2a.9.9 0 111.5.9l-1.3 2.2a.9.9 0 01-.3.1zm3.8-1.1a.9.9 0 01-1.2-.4l.7-1.2a.9.9 0 111.5.9l-.7 1.2a.9.9 0 01-.3.1zm4.6-.9a.9.9 0 11-1.3-1.1l.2-.2a.9.9 0 111.3 1.1l-.2.2z" fill="#F26522"></path></svg>
                            </div>
                        </div>

                        <div className="pt-4 text-center">
                            {isSubmitting ? (
                                <div className="w-full flex items-center justify-center space-x-2">
                                  <Loader2 className="h-6 w-6 animate-spin" />
                                  <p className="text-sm text-muted-foreground">
                                    Finalizing your order...
                                  </p>
                                </div>
                             ) : (
                                <div
                                  className={`${!photoFiles.length || !formData.email || !formData.name ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title={!validateForm() ? "Please fill out all required fields" : ""}
                                >
                                  <div className={`${!validateForm() ? 'pointer-events-none' : ''}`}>
                                    <PayPalButton 
                                        amount={priceInCents / 100}
                                        onSuccess={onPaymentSuccess}
                                        onError={onPaymentError}
                                        disabled={isSubmitting}
                                    />
                                  </div>
                                </div>
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
                    Your pet's portrait is now in progress. We’ll send an email to <span className="font-semibold text-foreground">{formData.email}</span> with your order number and update you as the artwork moves from sketch → painting → delivery.
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

    
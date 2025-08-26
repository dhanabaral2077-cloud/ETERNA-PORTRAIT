
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
import { Progress } from "@/components/ui/progress";

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
        email: ''
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
        if (!formData.name) { toast({ variant: "destructive", title: "Name Required", description: "Please enter your full name." }); return false; }
        if (!formData.email) { toast({ variant: "destructive", title: "Email Required", description: "Please enter your email address." }); return false; }
        if (!/\S+@\S+\.\S+/.test(formData.email)) { toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." }); return false; }
        if (photoFiles.length === 0) { toast({ variant: "destructive", title: "No Photo Uploaded", description: "Please upload at least one photo of your pet." }); return false; }
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
                    name: formData.name,
                    email: formData.email,
                    petName: formData.petName,
                    style: formData.style,
                    pkg: { name: selectedPackage.name, id: selectedPackage.id }, // Pass name and id
                    price: selectedPackage.price,
                    notes: formData.notes,
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
                            <Label>1. Your Details</Label>
                            <div className="mt-2 space-y-4">
                                <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Full Name" />
                                <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="your.email@example.com" />
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
                                  title={!formData.name ? "Please enter your name" : !formData.email ? "Please enter your email" : !photoFiles.length ? "Please upload at least one photo" : ""}
                                >
                                  <div className={`${!photoFiles.length || !formData.email || !formData.name ? 'pointer-events-none' : ''}`}>
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

    

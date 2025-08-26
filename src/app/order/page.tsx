
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

    const validateForm = (): { isValid: boolean; title?: string, message?: string } => {
        if (!formData.name) return { isValid: false, title: "Missing Information", message: "Please enter your full name." };
        if (!formData.email) return { isValid: false, title: "Missing Information", message: "Please enter your email address." };
        if (!/\S+@\S+\.\S+/.test(formData.email)) return { isValid: false, title: "Invalid Email", message: "Please enter a valid email address." };
        if (!formData.addressLine1) return { isValid: false, title: "Missing Information", message: "Please enter your address." };
        if (!formData.city) return { isValid: false, title: "Missing Information", message: "Please enter your city." };
        if (!formData.postalCode) return { isValid: false, title: "Missing Information", message: "Please enter your postal code." };
        if (!formData.country) return { isValid: false, title: "Missing Information", message: "Please enter your country." };
        if (photoFiles.length === 0) return { isValid: false, title: "No Photo Uploaded", message: "Please upload at least one photo of your pet." };
        
        return { isValid: true };
    };
    
    const onPaymentSuccess = async (paypalOrderId: string) => {
        const { isValid, title, message } = validateForm();
        if (!isValid) {
            toast({ variant: "destructive", title: title, description: message });
            return;
        }
        if (!selectedPackageKey) return;
        
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
    const isFormIncomplete = !formData.name || !formData.email || !formData.addressLine1 || !formData.city || !formData.postalCode || !formData.country || photoFiles.length === 0;


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

                        <PayPalButton 
                            amount={priceInCents / 100}
                            disabled={isFormIncomplete || isSubmitting}
                            onSuccess={onPaymentSuccess}
                            onError={onPaymentError}
                        />

                        {isSubmitting && (
                            <div className="flex items-center justify-center text-secondary">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                <span>Finalizing your commission...</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {step === 1 && (
                <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-12 bg-card rounded-2xl shadow-xl flex flex-col items-center"
                >
                    <CheckCircle className="w-16 h-16 text-accent mb-6" />
                    <h2 className="font-headline text-3xl text-foreground">Commission Submitted!</h2>
                    <p className="mt-4 text-secondary max-w-md">
                        Thank you for your trust. Our artists are honored to begin creating your masterpiece. You will receive an email confirmation shortly with your order details.
                    </p>
                    <Button asChild className="mt-8 rounded-full">
                        <Link href="/">Back to Home</Link>
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
            <main className="flex-1 py-24 md:py-32">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <Suspense fallback={<p>Loading...</p>}>
                        <OrderForm />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}

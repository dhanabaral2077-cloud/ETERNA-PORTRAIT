'use client';

import { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, CheckCircle, Loader2, Check, AlertCircle, Trash2, Package, Ruler, Truck } from "lucide-react";
import PayPalButton from "@/components/paypal-button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/lib/supabase-client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const productOptions = {
    types: [
        { id: 'canvas', name: 'Canvas', price: 950, plan: 'signature' },
        { id: 'framed_canvas', name: 'Framed Canvas', price: 1250, plan: 'signature' },
        { id: 'fine_art_poster', name: 'Fine Art Poster', price: 450, plan: 'classic' },
        { id: 'framed_poster_wood', name: 'Wooden Framed Poster', price: 750, plan: 'classic' },
        { id: 'framed_poster_metal', name: 'Metal Framed Poster', price: 850, plan: 'classic' },
        { id: 'aluminum_print', name: 'Aluminum Print', price: 1500, plan: 'masterpiece' },
        { id: 'acrylic_print', name: 'Acrylic Print', price: 1800, plan: 'masterpiece' },
    ],
    orientations: [
        { id: 'vertical', name: 'Vertical' },
        { id: 'horizontal', name: 'Horizontal' },
    ],
    sizes: [
        { id: '5x7', name: '13x18 cm / 5x7"', priceModifier: 0.5 },
        { id: '12x16', name: '30x40 cm / 12x16"', priceModifier: 1 },
        { id: '18x24', name: '45x60 cm / 18x24"', priceModifier: 1.5 },
        { id: '24x36', name: '60x90 cm / 24x36"', priceModifier: 2 },
    ]
} as const;

type StyleOption = "artist" | "renaissance" | "classic_oil" | "watercolor" | "modern_minimalist";

function OrderForm() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const router = useRouter();

    const [step, setStep] = useState(0); // 0: Form, 1: Success

    const selectedPlan = searchParams.get('plan') || 'signature';

    const availableProductTypes = useMemo(() => {
        return productOptions.types.filter(type => type.plan === selectedPlan);
    }, [selectedPlan]);
    
    const [formData, setFormData] = useState({
        // Commission details
        printType: availableProductTypes[0]?.id || 'canvas',
        orientation: 'vertical',
        size: '12x16',
        petName: '',
        style: 'artist' as StyleOption,
        notes: '',
        // Customer details
        name: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        stateProvinceRegion: '',
        postalCode: '',
        country: '',
    });
    
    // Errors for real-time validation
    const [errors, setErrors] = useState<Record<string, string | null>>({
        name: null,
        email: null,
        addressLine1: null,
        city: null,
        postalCode: null,
        country: null,
        photos: null,
    });
    
    // Effect to update printType if the plan changes and the current printType is not available
    useEffect(() => {
        const isCurrentTypeAvailable = availableProductTypes.some(type => type.id === formData.printType);
        if (!isCurrentTypeAvailable && availableProductTypes.length > 0) {
            handleChange('printType', availableProductTypes[0].id);
        }
    }, [selectedPlan, availableProductTypes, formData.printType]);

    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // For upload progress
    
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dropZoneRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    const validateField = (field: string, value: string) => {
        let error: string | null = null;
        switch (field) {
            case 'name':
                error = !value ? 'Full name is required.' : null;
                break;
            case 'email':
                error = !value ? 'Email is required.' : !/\S+@\S+\.\S+/.test(value) ? 'Invalid email format.' : null;
                break;
            case 'addressLine1':
                error = !value ? 'Address is required.' : null;
                break;
            case 'city':
                error = !value ? 'City is required.' : null;
                break;
            case 'postalCode':
                error = !value ? 'Postal code is required.' : null;
                break;
            case 'country':
                error = !value ? 'Country is required.' : null;
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files).filter(file => {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    toast({ variant: "destructive", title: "File Too Large", description: `${file.name} exceeds 5MB limit.` });
                    return false;
                }
                return true;
            });

            if ((photoFiles.length + newFiles.length) > 3) {
                toast({ variant: "destructive", title: "Too Many Photos", description: `You can upload a maximum of 3 photos.` });
                return;
            }

            setPhotoFiles(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPhotoPreviews(prev => [...prev, ...newPreviews]);

            setErrors(prev => ({ ...prev, photos: newFiles.length === 0 && photoFiles.length === 0 ? 'At least one photo is required.' : null }));
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
        if (photoFiles.length - 1 === 0) {
            setErrors(prev => ({ ...prev, photos: 'At least one photo is required.' }));
        }
    };

    const validateForm = (): boolean => {
        let isValid = true;
        Object.keys(formData).forEach(key => {
            if (['name', 'email', 'addressLine1', 'city', 'postalCode', 'country'].includes(key)) {
                validateField(key, formData[key as keyof typeof formData]);
                if (errors[key]) isValid = false;
            }
        });
        if (photoFiles.length === 0) {
            setErrors(prev => ({ ...prev, photos: 'At least one photo is required.' }));
            isValid = false;
        }
        return isValid;
    };
    
    const onPaymentSuccess = async (paypalOrderId: string) => {
        if (!validateForm()) {
            toast({ variant: "destructive", title: "Form Incomplete", description: "Please fix the errors in the form." });
            return;
        }
        
        setIsSubmitting(true);
        setIsUploading(true);
        
        try {
            const orderFolderName = `orders/${Date.now()}`;
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

            const pkg = {
                name: `${selectedType?.name} (${selectedSize?.name})`,
                id: `${formData.printType}_${formData.size}`
            };

            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    pkg,
                    price: totalPrice,
                    photoUrls,
                    storageFolder: orderFolderName,
                    paypalOrderId,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save order.');
            }
            
            setStep(1);
        } catch (error) {
            onPaymentError(error);
        } finally {
            setIsSubmitting(false);
            setIsUploading(false);
        }
    };

    const onPaymentError = (error: any) => {
        console.error("Submission or Payment Error:", error);
        let errorMessage = "There was a problem submitting your order. Please contact support.";
        if (error instanceof Error) {
            errorMessage = error.message;
            if (errorMessage.includes('upload')) {
                errorMessage = "File upload failed. Please try again.";
            } else if (errorMessage.includes('save order')) {
                errorMessage = "Order saving failed. Please try again.";
            }
        }
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: errorMessage,
        });
        setIsSubmitting(false);
    };
    
    const selectedType = useMemo(() => productOptions.types.find(t => t.id === formData.printType), [formData.printType]);
    const selectedSize = useMemo(() => productOptions.sizes.find(s => s.id === formData.size), [formData.size]);
    const totalPrice = selectedType && selectedSize ? Math.round(selectedType.price * selectedSize.priceModifier) : 0;
    
    const isFormIncomplete = Object.values(errors).some(err => err !== null) || photoFiles.length === 0;

    // Drag-and-drop handlers
    useEffect(() => {
        const dropZone = dropZoneRef.current;
        if (!dropZone) return;

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            dropZone.classList.add('border-primary');
        };

        const handleDragLeave = () => {
            dropZone.classList.remove('border-primary');
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            dropZone.classList.remove('border-primary');
            if (e.dataTransfer?.files) {
                handleFileChange(e.dataTransfer.files);
            }
        };

        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);

        return () => {
            dropZone.removeEventListener('dragover', handleDragOver);
            dropZone.removeEventListener('dragleave', handleDragLeave);
            dropZone.removeEventListener('drop', handleDrop);
        };
    }, [photoFiles.length]);

    return (
        <AnimatePresence mode="wait">
            {step === 0 && (
                <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-card p-8 md:p-12 rounded-2xl shadow-xl w-full grid md:grid-cols-2 gap-x-12 gap-y-8"
                >
                    {/* Left Column: Commission Details */}
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl text-foreground">1. Customize Your Artwork</h2>
                        
                        {/* Artwork Type */}
                        <div className="space-y-3">
                            <Label>Product Type</Label>
                            <Select value={formData.printType} onValueChange={(value) => handleChange('printType', value)}>
                                <SelectTrigger><SelectValue placeholder="Select a product type" /></SelectTrigger>
                                <SelectContent>
                                    {availableProductTypes.map(type => (
                                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Orientation */}
                            <div className="space-y-3">
                                <Label>Orientation</Label>
                                <Select value={formData.orientation} onValueChange={(value) => handleChange('orientation', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select orientation" /></SelectTrigger>
                                    <SelectContent>
                                        {productOptions.orientations.map(o => (
                                            <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Size */}
                             <div className="space-y-3">
                                <Label>Size</Label>
                                <Select value={formData.size} onValueChange={(value) => handleChange('size', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select a size" /></SelectTrigger>
                                    <SelectContent>
                                        {productOptions.sizes.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                         {/* Photo Upload */}
                        <div className="space-y-3">
                            <Label>Upload Your Pet's Photo(s)</Label>
                             <div ref={dropZoneRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-2 border-dashed border-accent rounded-xl p-4 min-h-[10rem]">
                                {photoPreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <Image src={preview} alt={`Pet photo ${index + 1}${formData.petName ? ` of ${formData.petName}` : ''}`} width={150} height={150} className="rounded-lg object-cover w-full h-40" />
                                        <button onClick={(e) => { e.stopPropagation(); removePhoto(index); }} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {photoFiles.length < 3 && (
                                    <div className="flex flex-col items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors h-40 relative group w-full" onClick={() => fileInputRef.current?.click()}>
                                        <UploadCloud className="w-8 h-8 text-accent mb-2" />
                                        <span className="text-sm">Upload or Drop Photo</span>
                                        <span className="text-xs mt-1">(Max 3, 5MB each)</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} accept="image/jpeg,image/png,image/webp" className="hidden" multiple />
                            {errors.photos && <p className="text-destructive text-sm mt-1">{errors.photos}</p>}
                            {isUploading && (
                                <div className="flex items-center text-secondary mt-2">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    <span>Uploading photos...</span>
                                </div>
                            )}
                        </div>

                        {/* Style Choice */}
                        <div className="space-y-3">
                            <Label>Choose a Style</Label>
                            <RadioGroup 
                                value={formData.style} 
                                onValueChange={(value) => handleChange('style', value as StyleOption)} 
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2"
                            >
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
                                <div>
                                    <RadioGroupItem value="watercolor" id="watercolor" className="peer sr-only" />
                                    <Label htmlFor="watercolor" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors duration-300 ease-in-out hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary">
                                        Watercolor
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="modern_minimalist" id="modern_minimalist" className="peer sr-only" />
                                    <Label htmlFor="modern_minimalist" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors duration-300 ease-in-out hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary">
                                        Minimalist
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="pet-name">Pet's Name(s) (Optional)</Label>
                          <Input id="pet-name" value={formData.petName} onChange={(e) => handleChange('petName', e.target.value)} placeholder="E.g., Bella, Max & Luna" maxLength={50} />
                        </div>
                        
                         <div className="space-y-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Label htmlFor="notes">Notes for the Artist (Optional)</Label>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Provide details like specific features to highlight or background preferences.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Input id="notes" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="E.g., capture the white spot on his chest" maxLength={200} />
                        </div>
                    </div>

                    {/* Right Column: Customer Info, Summary, Payment */}
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl text-foreground">2. Shipping & Payment</h2>
                        
                        <div className="space-y-3">
                            <Label>Contact & Shipping Information</Label>
                            <div className="mt-2 space-y-4">
                                <div>
                                    <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Full Name" required aria-invalid={errors.name ? 'true' : 'false'} />
                                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="your.email@example.com" required aria-invalid={errors.email ? 'true' : 'false'} />
                                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <Input value={formData.addressLine1} onChange={(e) => handleChange('addressLine1', e.target.value)} placeholder="Address Line 1" required aria-invalid={errors.addressLine1 ? 'true' : 'false'} />
                                    {errors.addressLine1 && <p className="text-destructive text-sm mt-1">{errors.addressLine1}</p>}
                                </div>
                                <Input value={formData.addressLine2} onChange={(e) => handleChange('addressLine2', e.target.value)} placeholder="Address Line 2 (Optional)" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Input value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="City" required aria-invalid={errors.city ? 'true' : 'false'} />
                                        {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                                    </div>
                                    <Input value={formData.stateProvinceRegion} onChange={(e) => handleChange('stateProvinceRegion', e.target.value)} placeholder="State / Province" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Input value={formData.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} placeholder="Postal Code" required aria-invalid={errors.postalCode ? 'true' : 'false'} />
                                        {errors.postalCode && <p className="text-destructive text-sm mt-1">{errors.postalCode}</p>}
                                    </div>
                                    <div>
                                        <Input value={formData.country} onChange={(e) => handleChange('country', e.target.value)} placeholder="Country" required aria-invalid={errors.country ? 'true' : 'false'} />
                                        {errors.country && <p className="text-destructive text-sm mt-1">{errors.country}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                         <h3 className="font-headline text-2xl text-foreground pt-4">Order Summary</h3>
                         <Card>
                             <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-start text-md text-foreground">
                                    <span className="font-medium flex items-center"><Package className="mr-2 h-5 w-5 text-accent"/> Product</span>
                                    <span className="text-right">{selectedType?.name || 'N/A'}</span>
                                </div>
                                 <div className="flex justify-between items-start text-md text-foreground">
                                    <span className="font-medium flex items-center"><Ruler className="mr-2 h-5 w-5 text-accent"/> Size</span>
                                    <span className="text-right">{selectedSize?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold text-foreground mt-4 pt-4 border-t">
                                    <span>Total</span>
                                    <span>${(totalPrice).toFixed(2)}</span>
                                </div>
                             </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg"><Truck className="mr-2 text-accent"/>Shipping Information</CardTitle>
                            </CardHeader>
                             <CardContent className="text-sm text-secondary space-y-2">
                                <p>Fulfilled in 3 countries to ensure fast delivery.</p>
                                <p><strong>Economy shipping:</strong> estimated delivery in 4-5 business days.</p>
                                <p><strong>Express shipping:</strong> estimated delivery in 2-3 business days.</p>
                                <p className="text-xs text-muted-foreground pt-2">Delivery time includes order processing, production, and shipping. Estimated times may vary and are not guaranteed.</p>
                             </CardContent>
                        </Card>


                        <PayPalButton 
                            amount={totalPrice}
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
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <Suspense fallback={<div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
                        <OrderForm />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}
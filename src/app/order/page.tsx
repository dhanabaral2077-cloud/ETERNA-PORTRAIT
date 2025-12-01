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
import { UploadCloud, CheckCircle, Loader2, Package, Ruler, Truck, Trash2 } from "lucide-react";
import PayPalButton from "@/components/paypal-button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/lib/supabase-client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PRODUCT_PRICES, SIZE_MODIFIERS, calculatePrice, ProductType, SizeType } from "@/lib/pricing";

type StyleOption = "artist" | "renaissance" | "classic_oil" | "watercolor" | "modern_minimalist";

function OrderForm() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const router = useRouter();

    const [step, setStep] = useState(0); // 0: Form, 1: Success

    const selectedPlan = searchParams.get('plan') || 'signature';

    // Convert PRODUCT_PRICES object to array for UI
    const productTypes = useMemo(() => {
        return Object.entries(PRODUCT_PRICES).map(([id, details]) => ({
            id: id as ProductType,
            ...details
        }));
    }, []);

    const availableProductTypes = useMemo(() => {
        return productTypes.filter(type => type.plan === selectedPlan);
    }, [selectedPlan, productTypes]);

    const [formData, setFormData] = useState({
        printType: (availableProductTypes[0]?.id || 'canvas') as ProductType,
        orientation: 'vertical',
        size: '12x16' as SizeType,
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

    const [errors, setErrors] = useState<Record<string, string | null>>({
        name: null,
        email: null,
        addressLine1: null,
        city: null,
        postalCode: null,
        country: null,
        photos: null,
    });

    useEffect(() => {
        const isCurrentTypeAvailable = availableProductTypes.some(type => type.id === formData.printType);
        if (!isCurrentTypeAvailable && availableProductTypes.length > 0) {
            handleChange('printType', availableProductTypes[0].id);
        }
    }, [selectedPlan, availableProductTypes, formData.printType]);

    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
                error = !value.trim() ? 'Full name is required.' : null;
                break;
            case 'email':
                error = !value.trim() ? 'Email is required.' : !/\S+@\S+\.\S+/.test(value) ? 'Invalid email format.' : null;
                break;
            case 'addressLine1':
                error = !value.trim() ? 'Address is required.' : null;
                break;
            case 'city':
                error = !value.trim() ? 'City is required.' : null;
                break;
            case 'postalCode':
                error = !value.trim() ? 'Postal code is required.' : null;
                break;
            case 'country':
                error = !value.trim() ? 'Country is required.' : null;
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files).filter(file => {
                if (file.size > 5 * 1024 * 1024) {
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
            setPhotoPreviews(prev => [...prev, ...newFiles.map(file => URL.createObjectURL(file))]);
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

    // Calculate price using shared logic
    const totalPrice = useMemo(() => {
        try {
            return calculatePrice(formData.printType, formData.size);
        } catch (e) {
            return 0;
        }
    }, [formData.printType, formData.size]);

    const selectedTypeName = PRODUCT_PRICES[formData.printType]?.name;
    const selectedSizeName = SIZE_MODIFIERS[formData.size]?.name;

    const onPaymentSuccess = async (paypalOrderId: string) => {
        if (!validateForm()) {
            toast({ variant: "destructive", title: "Form Incomplete", description: "Please complete all required fields." });
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
                name: `${selectedTypeName} (${selectedSizeName})`,
                id: `${formData.printType}_${formData.size}`
            };

            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    pkg,
                    // We don't send price anymore, or if we do, server ignores/verifies it.
                    // But for now let's send it for reference, but server MUST verify.
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
        let errorMessage = "There was an issue finalizing your commission. Please contact our concierge team.";
        if (error instanceof Error) {
            errorMessage = error.message.includes('upload')
                ? "Photo upload failed. Please try again."
                : error.message.includes('save order')
                    ? "Order processing failed. Please try again."
                    : error.message;
        }
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: errorMessage,
        });
        setIsSubmitting(false);
    };

    const isFormIncomplete = Object.values(errors).some(err => err !== null) || photoFiles.length === 0;

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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-card p-8 md:p-12 rounded-2xl shadow-xl w-full grid md:grid-cols-2 gap-x-12 gap-y-8"
                >
                    {/* Left Column: Commission Details */}
                    <div className="space-y-8">
                        <h2 className="font-headline text-3xl md:text-4xl text-foreground">1. Craft Your Masterpiece</h2>

                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">Product Type</Label>
                            <Select value={formData.printType} onValueChange={(value) => handleChange('printType', value)}>
                                <SelectTrigger className="rounded-full"><SelectValue placeholder="Select a product type" /></SelectTrigger>
                                <SelectContent>
                                    {availableProductTypes.map(type => (
                                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <Label className="text-lg font-semibold">Orientation</Label>
                                <Select value={formData.orientation} onValueChange={(value) => handleChange('orientation', value)}>
                                    <SelectTrigger className="rounded-full"><SelectValue placeholder="Select orientation" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vertical">Vertical</SelectItem>
                                        <SelectItem value="horizontal">Horizontal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-lg font-semibold">Size</Label>
                                <Select value={formData.size} onValueChange={(value) => handleChange('size', value)}>
                                    <SelectTrigger className="rounded-full"><SelectValue placeholder="Select a size" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(SIZE_MODIFIERS).map(([id, details]) => (
                                            <SelectItem key={id} value={id}>{details.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">Upload Your Pet's Photo(s)</Label>
                            <div ref={dropZoneRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-2 border-dashed border-accent rounded-xl p-4 min-h-[10rem]">
                                {photoPreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <Image
                                            src={preview}
                                            alt={`Pet photo ${index + 1}${formData.petName ? ` of ${formData.petName}` : ''}`}
                                            width={150}
                                            height={150}
                                            className="rounded-lg object-cover w-full h-40"
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {photoFiles.length < 3 && (
                                    <div
                                        className="flex flex-col items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors h-40 relative group w-full"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <UploadCloud className="w-8 h-8 text-accent mb-2" />
                                        <span className="text-sm font-medium">Upload or Drop Photo</span>
                                        <span className="text-xs mt-1 text-muted-foreground">(Max 3, 5MB each)</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e.target.files)}
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                multiple
                            />
                            {errors.photos && <p className="text-destructive text-sm mt-1">{errors.photos}</p>}
                            {isUploading && (
                                <div className="flex items-center text-secondary mt-2">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    <span>Uploading your masterpiece's inspiration...</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">Choose a Style</Label>
                            <RadioGroup
                                value={formData.style}
                                onValueChange={(value) => handleChange('style', value as StyleOption)}
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2"
                            >
                                {['artist', 'renaissance', 'classic_oil', 'watercolor', 'modern_minimalist'].map(style => (
                                    <div key={style}>
                                        <RadioGroupItem value={style} id={style} className="peer sr-only" />
                                        <Label
                                            htmlFor={style}
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors duration-300 ease-in-out hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                            {style.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="pet-name" className="text-lg font-semibold">Pet's Name(s) (Optional)</Label>
                            <Input
                                id="pet-name"
                                value={formData.petName}
                                onChange={(e) => handleChange('petName', e.target.value)}
                                placeholder="E.g., Bella, Max & Luna"
                                maxLength={50}
                                className="rounded-full"
                            />
                        </div>

                        <div className="space-y-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="notes" className="text-lg font-semibold">Notes for the Artist (Optional)</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Share details like specific features to highlight or background preferences.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                placeholder="E.g., Emphasize the white spot on her chest"
                                maxLength={200}
                                className="rounded-full"
                            />
                        </div>
                    </div>

                    {/* Right Column: Customer Info, Summary, Payment */}
                    <div className="space-y-8">
                        <h2 className="font-headline text-3xl md:text-4xl text-foreground">2. Shipping & Payment</h2>

                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">Contact & Shipping Information</Label>
                            <div className="mt-2 space-y-4">
                                <div>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="Full Name"
                                        required
                                        aria-invalid={errors.name ? 'true' : 'false'}
                                        className="rounded-full"
                                    />
                                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="your.email@example.com"
                                        required
                                        aria-invalid={errors.email ? 'true' : 'false'}
                                        className="rounded-full"
                                    />
                                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <Input
                                        value={formData.addressLine1}
                                        onChange={(e) => handleChange('addressLine1', e.target.value)}
                                        placeholder="Address Line 1"
                                        required
                                        aria-invalid={errors.addressLine1 ? 'true' : 'false'}
                                        className="rounded-full"
                                    />
                                    {errors.addressLine1 && <p className="text-destructive text-sm mt-1">{errors.addressLine1}</p>}
                                </div>
                                <Input
                                    value={formData.addressLine2}
                                    onChange={(e) => handleChange('addressLine2', e.target.value)}
                                    placeholder="Address Line 2 (Optional)"
                                    className="rounded-full"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => handleChange('city', e.target.value)}
                                            placeholder="City"
                                            required
                                            aria-invalid={errors.city ? 'true' : 'false'}
                                            className="rounded-full"
                                        />
                                        {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                                    </div>
                                    <Input
                                        value={formData.stateProvinceRegion}
                                        onChange={(e) => handleChange('stateProvinceRegion', e.target.value)}
                                        placeholder="State / Province"
                                        className="rounded-full"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Input
                                            value={formData.postalCode}
                                            onChange={(e) => handleChange('postalCode', e.target.value)}
                                            placeholder="Postal Code"
                                            required
                                            aria-invalid={errors.postalCode ? 'true' : 'false'}
                                            className="rounded-full"
                                        />
                                        {errors.postalCode && <p className="text-destructive text-sm mt-1">{errors.postalCode}</p>}
                                    </div>
                                    <div>
                                        <Input
                                            value={formData.country}
                                            onChange={(e) => handleChange('country', e.target.value)}
                                            placeholder="Country"
                                            required
                                            aria-invalid={errors.country ? 'true' : 'false'}
                                            className="rounded-full"
                                        />
                                        {errors.country && <p className="text-destructive text-sm mt-1">{errors.country}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-headline text-2xl md:text-3xl text-foreground pt-4">Commission Summary</h3>
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-start text-md text-foreground">
                                    <span className="font-medium flex items-center"><Package className="mr-2 h-5 w-5 text-accent" /> Product</span>
                                    <span className="text-right">{selectedTypeName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-start text-md text-foreground">
                                    <span className="font-medium flex items-center"><Ruler className="mr-2 h-5 w-5 text-accent" /> Size</span>
                                    <span className="text-right">{selectedSizeName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold text-foreground mt-4 pt-4 border-t">
                                    <span>Total</span>
                                    <span>${(totalPrice).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg"><Truck className="mr-2 text-accent" />Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-secondary space-y-2">
                                <p>Fulfilled in 3 countries to ensure swift delivery.</p>
                                <p><strong>Economy shipping:</strong> Estimated 4-5 business days.</p>
                                <p><strong>Express shipping:</strong> Estimated 2-3 business days.</p>
                                <p className="text-xs text-muted-foreground pt-2">Delivery times include order processing, artisan crafting, and shipping. Estimates may vary.</p>
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
                                <span>Finalizing your bespoke commission...</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {step === 1 && (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center p-12 md:p-16 bg-card rounded-2xl shadow-xl flex flex-col items-center max-w-2xl mx-auto"
                >
                    <CheckCircle className="w-16 h-16 text-accent mb-6" />
                    <h2 className="font-headline text-3xl md:text-4xl text-foreground">Your Masterpiece is Commissioned!</h2>
                    <p className="mt-4 text-secondary max-w-md text-lg">
                        We are thrilled to begin crafting your bespoke portrait for {formData.petName || 'your cherished pet'}. Our master artisans are inspired and will ensure a creation of timeless elegance. Expect an email confirmation with all details shortly.
                    </p>
                    <p className="mt-6 text-secondary max-w-md text-base">
                        Join our exclusive community to follow the artistry behind your masterpiece and discover more luxurious creations.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <a href="https://x.com/EternaPortrait" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors" title="Follow us on X">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/eter.naportrait/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors" title="Follow us on Instagram">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.02.049 1.717.209 2.328.444a4.69 4.69 0 011.702 1.113 4.69 4.69 0 011.113 1.702c.235.611.395 1.308.444 2.328.047 1.024.06 1.378.06 3.808s-.013 2.784-.06 3.808c-.049 1.02-.209 1.717-.444 2.328a4.69 4.69 0 01-1.113 1.702 4.69 4.69 0 01-1.702 1.113c-.611.235-1.308.395-2.328.444 1.024.047-1.378.06-3.808.06zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.339-9.87a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/people/Eterna-Portrait/61580466892802/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors" title="Follow us on Facebook">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@eternaportrait" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors" title="Follow us on TikTok">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.81 2.89 2.89 0 011.1.22v-3.4a6.28 6.28 0 00-1.1-.12 6.29 6.29 0 00 0 12.57 6.29 6.29 0 004.78-2.07 6.29 6.29 0 001.51-4.46V8.43a8.27 8.27 0 004.82 1.55V6.69z" />
                            </svg>
                        </a>
                        <a href="https://www.pinterest.com/eternaportrait/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors" title="Follow us on Pinterest">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489-.093-.783-.179-1.983.037-2.837.196-.771 1.256-4.828 1.256-4.828s-.32-.642-.32-1.591c0-1.491.865-2.604 1.941-2.604.914 0 1.356.687 1.356 1.509 0 .92-.584 2.295-.885 3.567-.251 1.062.531 1.929 1.575 1.929 1.891 0 3.345-1.991 3.345-4.861 0-2.541-1.825-4.317-4.431-4.317-3.016 0-4.786 2.264-4.786 4.601 0 .912.351 1.891.789 2.424.087.105.149.197.107.305-.031.079-.101.242-.146.312-.064.098-.204.119-.297.073-1.389-.685-2.242-2.837-2.242-4.567 0-3.345 2.432-6.419 7.013-6.419 3.678 0 6.537 2.622 6.537 6.128 0 3.651-2.304 6.591-5.502 6.591-1.077 0-2.087-.561-2.432-1.222 0 0-.531 2.023-.66 2.519-.24.91-.885 2.052-1.317 2.746C9.432 21.945 10.678 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                    <Button asChild className="mt-8 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold px-8">
                        <Link href="/">Explore More Creations</Link>
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

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle, Loader2, Package, Trash2, ShieldCheck, HeartHandshake, Palette, Gift, Zap, FileCheck, ChevronLeft, ChevronRight } from "lucide-react";
import PayPalButton from "@/components/paypal-button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/lib/supabase-client';
import { trackEvent } from "@/lib/analytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ART_STYLES, SIZE_MODIFIERS, calculatePrice, ProductType, SizeType } from "@/lib/pricing";
import { useProducts } from "@/hooks/use-products";

type StyleOption = "artist" | "renaissance" | "classic_oil" | "watercolor" | "modern_minimalist";

export const SUPPORTED_COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AO', name: 'Angola' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BR', name: 'Brazil' },
    { code: 'CA', name: 'Canada' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'GR', name: 'Greece' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IN', name: 'India' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russia' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'ES', name: 'Spain' },
    { code: 'SE', name: 'Sweden' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'ZW', name: 'Zimbabwe' },
];

// --- Visual Selector Components ---

interface VisualOptionProps {
    id: string;
    title: string;
    description?: string;
    price?: string;
    selected: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    image?: string;
    gallery?: string[];
}

const VisualOption = ({ id, title, description, price, selected, onClick, icon, image, gallery }: VisualOptionProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Determine which images to use: gallery first, then single image, then empty array
    const images = gallery && gallery.length > 0 ? gallery : (image ? [image] : []);

    // Handle image navigation
    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent selecting the option when clicking arrow
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Reset index if id changes (although usually component is remounted or key changes)
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [id]);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative flex flex-col rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group
                ${selected
                    ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                    : 'border-muted/40 hover:border-primary/50 hover:bg-white/40 bg-white/20'}
            `}
        >
            {images.length > 0 ? (
                <div className="relative w-full h-32 md:h-40 overflow-hidden bg-muted/10">
                    <Image
                        src={images[currentImageIndex]}
                        alt={`${title} - View ${currentImageIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Carousel Controls - Only show if multiple images and hovered/selected */}
                    {images.length > 1 && (isHovered || selected) && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                                aria-label="Next image"
                            >
                                <ChevronRight size={16} />
                            </button>
                            {/* Dots indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Overlay Checkmark */}
                    <div className={`absolute top-3 right-3 rounded-full p-1.5 shadow-sm transition-all duration-300 z-20 ${selected ? 'bg-primary text-white scale-100' : 'bg-black/30 text-transparent scale-90 opacity-0'}`}>
                        <CheckCircle className="w-4 h-4" />
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-start mb-2 p-4 pb-0">
                    <div className={`p-2 rounded-full ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {icon || <Package size={20} />}
                    </div>
                    {selected && <CheckCircle className="text-primary w-5 h-5" />}
                </div>
            )}

            <div className="p-4">
                <h3 className="font-headline text-lg font-medium leading-tight">{title}</h3>
                {description && <p className="text-sm text-secondary mt-1 line-clamp-2">{description}</p>}
                {price && <p className="text-sm font-semibold mt-2 text-primary">{price}</p>}
            </div>
        </div>
    );
};

export function OrderForm() {
    const { products: PRODUCT_PRICES, loading: productsLoading } = useProducts();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const router = useRouter();

    const [step, setStep] = useState(0); // 0: Form, 1: Success



    if (productsLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const selectedPlan = searchParams.get('plan') || 'signature';

    // Convert PRODUCT_PRICES object to array for UI
    const productTypes = useMemo(() => {
        return Object.entries(PRODUCT_PRICES).map(([id, details]) => ({
            id: id as ProductType,
            ...details
        }));
    }, [PRODUCT_PRICES]);

    const availableProductTypes = useMemo(() => {
        return productTypes.filter(type => type.plan === selectedPlan);
    }, [selectedPlan, productTypes]);

    const isGift = selectedPlan === 'gift';

    // 1. Initialize formData with correct default size for Gifts
    const [formData, setFormData] = useState({
        printType: (availableProductTypes[0]?.id || (isGift ? 'gift_card' : 'canvas')) as ProductType,
        orientation: 'vertical',
        size: (isGift ? 'gift_100' : '12x16') as SizeType,
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
        rushProcessing: false,
        digitalBackup: false,
    });

    const [shippingEstimate, setShippingEstimate] = useState<string | null>(null);

    // Fetch shipping estimate when country changes
    useEffect(() => {
        const fetchShipping = async () => {
            if (!formData.country || formData.country.length < 2) return;

            try {
                const res = await fetch(`/api/shipping-methods?country=${formData.country}`);
                if (!res.ok) return;
                const data = await res.json();

                // Gelato V1 response has shipment_methods array
                const methods = data.shipment_methods || [];
                if (methods.length > 0) {
                    // Find standard or cheapest
                    const standard = methods.find((m: any) => m.name.toLowerCase().includes('standard')) || methods[0];
                    if (standard && standard.delivery_days) {
                        setShippingEstimate(`${standard.delivery_days.min}-${standard.delivery_days.max} business days`);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch shipping", error);
            }
        };

        const timeoutId = setTimeout(fetchShipping, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [formData.country]);

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

    // Analytics: Track View Item on Mount
    useEffect(() => {
        trackEvent('view_item', {
            currency: "USD",
            value: productTypes.find(p => p.id === formData.printType)?.basePrice,
            items: [
                {
                    item_id: formData.printType,
                    item_name: productTypes.find(p => p.id === formData.printType)?.name
                }
            ]
        });
    }, []);

    // --- Abandoned Cart Recovery (Local Storage) ---
    useEffect(() => {
        // Load saved draft on mount
        const savedDraft = localStorage.getItem('eterna_order_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setFormData(prev => ({ ...prev, ...parsed }));
                if (parsed.name) toast({ title: "Welcome back!", description: "We've restored your progress." });
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []); // Run only once on mount

    useEffect(() => {
        // Save draft on change (debounced slightly by nature of effect)
        if (formData.name || formData.petName || formData.email) {
            localStorage.setItem('eterna_order_draft', JSON.stringify(formData));

            // Also save to backend for abandoned cart recovery
            const saveToBackend = async () => {
                try {
                    await fetch('/api/orders/draft', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: formData.email,
                            session_id: localStorage.getItem('eterna_session_id') || 'anon', // You might want to generate this
                            form_data: formData
                        })
                    });
                } catch (e) {
                    // Silent fail for drafts
                }
            };
            // Debounce this in a real app, but for now we'll just fire it if email is present
            if (formData.email && formData.email.includes('@')) {
                const timeoutId = setTimeout(saveToBackend, 2000); // 2s debounce
                return () => clearTimeout(timeoutId);
            }
        }
    }, [formData]);

    const clearDraft = () => {
        localStorage.removeItem('eterna_order_draft');
    };
    // -----------------------------------------------

    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dropZoneRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (typeof value === 'string') validateField(field, value);
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
                validateField(key, formData[key as keyof typeof formData] as string);
                if (errors[key]) isValid = false;
            }
        });
        // Skip photo check for Gifts
        if (!isGift && photoFiles.length === 0) {
            setErrors(prev => ({ ...prev, photos: 'At least one photo is required.' }));
            isValid = false;
        }
        return isValid;
    };

    // Calculate price using shared logic
    const totalPriceBeforeDiscount = useMemo(() => {
        try {
            let price = calculatePrice(formData.printType, formData.size);
            if (formData.rushProcessing) price += 20;
            if (formData.digitalBackup) price += 10;
            return price;
        } catch (e) {
            return 0;
        }
    }, [formData.printType, formData.size, formData.rushProcessing, formData.digitalBackup]);

    const [discountCode, setDiscountCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string, percent: number } | null>(null);
    const [verifyingDiscount, setVerifyingDiscount] = useState(false);

    const handleApplyDiscount = async () => {
        if (!discountCode) return;
        setVerifyingDiscount(true);
        try {
            const res = await fetch('/api/discounts/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: discountCode })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setAppliedDiscount({ code: data.code, percent: data.percent });
                toast({ title: "Discount Applied!", description: `You saved ${data.percent}%!` });
            } else {
                toast({ variant: "destructive", title: "Invalid Code", description: data.error || "This code is invalid or expired." });
                setAppliedDiscount(null);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not verify discount code." });
        } finally {
            setVerifyingDiscount(false);
        }
    };

    const finalPrice = useMemo(() => {
        if (!appliedDiscount) return totalPriceBeforeDiscount;
        const discountAmount = Math.round(totalPriceBeforeDiscount * (appliedDiscount.percent / 100));
        return totalPriceBeforeDiscount - discountAmount;
    }, [totalPriceBeforeDiscount, appliedDiscount]);

    const selectedTypeName = PRODUCT_PRICES[formData.printType]?.name;
    const selectedSizeName = SIZE_MODIFIERS[formData.size]?.name;

    const onPaymentSuccess = async (paypalOrderId: string) => {
        if (!validateForm()) {
            toast({ variant: "destructive", title: "Form Incomplete", description: "Please complete all required fields." });
            return;
        }

        // Track Begin Checkout
        trackEvent('begin_checkout', {
            currency: "USD",
            value: finalPrice,
            items: [{ item_id: formData.printType, item_name: selectedTypeName }]
        });

        setIsSubmitting(true);
        setIsUploading(true);

        try {
            const orderFolderName = `orders/${Date.now()}`;

            // Only upload photos if not a gift card
            let photoUrls: string[] = [];
            if (!isGift) {
                const uploadPromises = photoFiles.map(file => {
                    const filePath = `${orderFolderName}/${file.name}`;
                    return supabase.storage.from('orders').upload(filePath, file);
                });

                const uploadResults = await Promise.all(uploadPromises);

                for (const result of uploadResults) {
                    if (result.error) throw new Error(`File upload failed: ${result.error.message}`);
                    const { data } = supabase.storage.from('orders').getPublicUrl(result.data.path);
                    photoUrls.push(data.publicUrl);
                }
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
                    price: finalPrice,
                    photoUrls,
                    storageFolder: orderFolderName,
                    paypalOrderId,
                    // Pass isGift flag if needed by backend, though pkg name implies it
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to save order.');
            }

            // Track Purchase
            trackEvent('purchase', {
                transaction_id: responseData.orderId || paypalOrderId,
                value: finalPrice,
                currency: "USD",
                items: [{
                    item_id: formData.printType,
                    item_name: selectedTypeName,
                    price: finalPrice
                }]
            });

            // Redirect to success page for tracking
            const params = new URLSearchParams();
            params.set('orderId', responseData.orderId || 'unknown');
            params.set('name', formData.name.split(' ')[0]);
            router.push(`/order/success?${params.toString()}`);
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

    const isFormIncomplete = Object.values(errors).some(err => err !== null) || (!isGift && photoFiles.length === 0);

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
                    className="glass-card p-8 md:p-12 rounded-3xl w-full grid md:grid-cols-2 gap-x-16 gap-y-12"
                >
                    {/* Left Column: Commission Details */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="font-headline text-3xl md:text-4xl text-foreground mb-2">
                                {isGift ? '1. Select Gift Option' : '1. Craft Your Masterpiece'}
                            </h2>
                            <p className="text-secondary">
                                {isGift ? 'Choose the perfect gift amount.' : 'Customize every detail of your unique portrait.'}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg font-serif text-foreground">Product Type</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {availableProductTypes.map(type => (
                                    <VisualOption
                                        key={type.id}
                                        id={type.id}
                                        title={type.name}
                                        description={`Starting at $${type.basePrice}`}
                                        selected={formData.printType === type.id}
                                        onClick={() => handleChange('printType', type.id)}
                                        icon={isGift ? <Gift size={20} /> : <Palette size={20} />}
                                        image={(type as any).image}
                                        gallery={(type as any).gallery} // Pass gallery if available
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Orientation - Hide for Gifts */}
                        {!isGift && (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label className="text-lg font-serif text-foreground">Orientation</Label>
                                    <Select value={formData.orientation} onValueChange={(value) => handleChange('orientation', value)}>
                                        <SelectTrigger className="rounded-xl h-12 glass-input"><SelectValue placeholder="Select orientation" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vertical">Vertical (Portrait)</SelectItem>
                                            <SelectItem value="horizontal">Horizontal (Landscape)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-lg font-serif text-foreground">Size</Label>
                                    <Select value={formData.size} onValueChange={(value) => handleChange('size', value as SizeType)}>
                                        <SelectTrigger className="rounded-xl h-12 glass-input"><SelectValue placeholder="Select a size" /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SIZE_MODIFIERS).filter(([id]) => !id.startsWith('gift_')).map(([id, details]) => (
                                                <SelectItem key={id} value={id}>{details.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Special Size Selector for Gifts (Amount) */}
                        {isGift && (
                            <div className="space-y-4">
                                <Label className="text-lg font-serif text-foreground">Gift Amount</Label>
                                <Select value={formData.size} onValueChange={(value) => handleChange('size', value as SizeType)}>
                                    <SelectTrigger className="rounded-xl h-12 glass-input"><SelectValue placeholder="Select amount" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(SIZE_MODIFIERS).filter(([id]) => id.startsWith('gift_')).map(([id, details]) => (
                                            <SelectItem key={id} value={id}>{details.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Photo Upload - Hide for Gifts */}
                        {!isGift && (
                            <div className="space-y-4">
                                <Label className="text-lg font-serif text-foreground">Upload Your Pet's Photo(s)</Label>
                                <div ref={dropZoneRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-2 border-dashed border-primary/30 rounded-2xl p-6 min-h-[12rem] bg-white/30 transition-colors hover:bg-white/50">
                                    {photoPreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <Image
                                                src={preview}
                                                alt={`Pet photo ${index + 1}${formData.petName ? ` of ${formData.petName}` : ''}`}
                                                width={150}
                                                height={150}
                                                className="rounded-xl object-cover w-full h-40 shadow-sm"
                                            />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {photoFiles.length < 3 && (
                                        <div
                                            className="flex flex-col items-center justify-center cursor-pointer h-40 relative group w-full text-center"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-primary/20 transition-colors">
                                                <UploadCloud className="w-6 h-6 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground">Click to Upload</span>
                                            <span className="text-xs mt-1 text-muted-foreground">or drag & drop (Max 5MB)</span>
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
                                    <div className="flex items-center text-primary mt-2">
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        <span className="text-sm font-medium">Uploading your masterpiece's inspiration...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Style - Hide for Gifts */}
                        {!isGift && (
                            <div className="space-y-4">
                                <Label className="text-lg font-serif text-foreground">Choose a Style</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.values(ART_STYLES).map(style => (
                                        <VisualOption
                                            key={style.id}
                                            id={style.id}
                                            title={style.title}
                                            description={style.description}
                                            selected={formData.style === style.id}
                                            onClick={() => handleChange('style', style.id as StyleOption)}
                                            icon={<Palette size={18} />}
                                            image={style.image}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pet Name & Notes - Hide for Gifts */}
                        {!isGift && (
                            <>
                                <div className="space-y-4">
                                    <Label htmlFor="pet-name" className="text-lg font-serif text-foreground">Pet's Name(s) (Optional)</Label>
                                    <Input
                                        id="pet-name"
                                        value={formData.petName}
                                        onChange={(e) => handleChange('petName', e.target.value)}
                                        placeholder="E.g., Bella, Max & Luna"
                                        maxLength={50}
                                        className="rounded-xl h-12 glass-input"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Label htmlFor="notes" className="text-lg font-serif text-foreground cursor-help decoration-dotted underline underline-offset-4">Notes for the Artist (Optional)</Label>
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
                                        className="rounded-xl h-12 glass-input"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column: Customer Info, Summary, Payment */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="font-headline text-3xl md:text-4xl text-foreground mb-2">2. Shipping & Payment</h2>
                            <p className="text-secondary">Secure delivery to your doorstep.</p>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg font-serif text-foreground">Contact & Shipping Information</Label>
                            <div className="space-y-4">
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Full Name"
                                    required
                                    className="rounded-xl h-12 glass-input"
                                />
                                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}

                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="rounded-xl h-12 glass-input"
                                />
                                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}

                                <Input
                                    value={formData.addressLine1}
                                    onChange={(e) => handleChange('addressLine1', e.target.value)}
                                    placeholder="Address Line 1"
                                    required
                                    className="rounded-xl h-12 glass-input"
                                />
                                {errors.addressLine1 && <p className="text-destructive text-sm">{errors.addressLine1}</p>}

                                <Input
                                    value={formData.addressLine2}
                                    onChange={(e) => handleChange('addressLine2', e.target.value)}
                                    placeholder="Address Line 2 (Optional)"
                                    className="rounded-xl h-12 glass-input"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => handleChange('city', e.target.value)}
                                            placeholder="City"
                                            required
                                            className="rounded-xl h-12 glass-input"
                                        />
                                        {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <Select value={formData.country} onValueChange={(value) => handleChange('country', value)}>
                                            <SelectTrigger className="rounded-xl h-12 glass-input"><SelectValue placeholder="Country" /></SelectTrigger>
                                            <SelectContent>
                                                {SUPPORTED_COUNTRIES.map((c) => (
                                                    <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.country && <p className="text-destructive text-sm">{errors.country}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Input
                                            value={formData.stateProvinceRegion}
                                            onChange={(e) => handleChange('stateProvinceRegion', e.target.value)}
                                            placeholder="State / Province"
                                            className="rounded-xl h-12 glass-input"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            value={formData.postalCode}
                                            onChange={(e) => handleChange('postalCode', e.target.value)}
                                            placeholder="Postal Code"
                                            required
                                            className="rounded-xl h-12 glass-input"
                                        />
                                        {errors.postalCode && <p className="text-destructive text-sm">{errors.postalCode}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Bumps / Upgrades */}
                        <div className="grid grid-cols-1 gap-4">
                            <div
                                onClick={() => handleChange('rushProcessing', !formData.rushProcessing)}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.rushProcessing ? 'border-amber-500 bg-amber-50/50' : 'border-muted/40 hover:border-amber-500/30'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${formData.rushProcessing ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                        <Zap size={20} className={formData.rushProcessing ? "fill-current" : ""} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Rush Processing</h4>
                                        <p className="text-xs text-secondary">24hr Preview (Skip the line)</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-amber-600">+$20</span>
                                    {formData.rushProcessing && <CheckCircle className="w-4 h-4 text-amber-600 ml-auto mt-1" />}
                                </div>
                            </div>

                            <div
                                onClick={() => handleChange('digitalBackup', !formData.digitalBackup)}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.digitalBackup ? 'border-blue-500 bg-blue-50/50' : 'border-muted/40 hover:border-blue-500/30'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${formData.digitalBackup ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                        <FileCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Digital Backup</h4>
                                        <p className="text-xs text-secondary">High-Res file for safekeeping</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-blue-600">+$10</span>
                                    {formData.digitalBackup && <CheckCircle className="w-4 h-4 text-blue-600 ml-auto mt-1" />}
                                </div>
                            </div>
                        </div>

                        {/* Receipt Style Summary */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-muted/40 relative overflow-hidden">
                            {/* Receipt jagged edge effect (visual only) */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-muted/20 to-transparent" />

                            <h3 className="font-headline text-2xl text-foreground mb-6 text-center">Commission Summary</h3>

                            <div className="space-y-3 font-mono text-sm text-secondary">
                                <div className="flex justify-between">
                                    <span>Product</span>
                                    <span className="font-semibold text-foreground">{selectedTypeName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{isGift ? 'Value' : 'Size'}</span>
                                    <span className="font-semibold text-foreground">{selectedSizeName}</span>
                                </div>
                                {!isGift && (
                                    <div className="flex justify-between">
                                        <span>Style</span>
                                        <span className="font-semibold text-foreground capitalize">{formData.style.replace('_', ' ')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-semibold">
                                        Free {shippingEstimate && <span className="text-xs text-muted-foreground ml-1">({shippingEstimate})</span>}
                                    </span>
                                </div>
                                {formData.rushProcessing && (
                                    <div className="flex justify-between">
                                        <span>Rush Processing</span>
                                        <span className="font-semibold text-foreground">+$20</span>
                                    </div>
                                )}
                                {formData.digitalBackup && (
                                    <div className="flex justify-between">
                                        <span>Digital Backup</span>
                                        <span className="font-semibold text-foreground">+$10</span>
                                    </div>
                                )}
                                {appliedDiscount && (
                                    <div className="flex justify-between text-primary">
                                        <span>Discount ({appliedDiscount.code})</span>
                                        <span className="font-semibold">-{appliedDiscount.percent}% (-${Math.round(totalPriceBeforeDiscount * (appliedDiscount.percent / 100))})</span>
                                    </div>
                                )}
                            </div>


                            <div className="my-6 border-t-2 border-dashed border-muted/50" />

                            {/* Discount Input */}
                            <div className="flex gap-2 mb-6">
                                <Input
                                    placeholder="Discount Code"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                    className="h-10 text-sm"
                                    disabled={!!appliedDiscount}
                                />
                                {appliedDiscount ? (
                                    <Button variant="outline" size="sm" onClick={() => { setAppliedDiscount(null); setDiscountCode(""); }} className="h-10">
                                        Remove
                                    </Button>
                                ) : (
                                    <Button size="sm" onClick={handleApplyDiscount} disabled={!discountCode || verifyingDiscount} className="h-10">
                                        {verifyingDiscount ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                    </Button>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-serif text-lg text-foreground">Total</span>
                                <span className="font-serif text-3xl text-primary font-medium">${finalPrice}</span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                                <ShieldCheck className="w-6 h-6 text-primary mb-1" />
                                <span className="text-xs font-semibold text-foreground">Secure Checkout</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                                <HeartHandshake className="w-6 h-6 text-primary mb-1" />
                                <span className="text-xs font-semibold text-foreground">Satisfaction Guarantee</span>
                            </div>
                        </div>

                        <PayPalButton
                            amount={finalPrice}
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
                    className="glass-card text-center p-12 md:p-16 rounded-3xl flex flex-col items-center max-w-2xl mx-auto"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-4">Commission Confirmed</h2>
                    <p className="text-secondary max-w-md text-lg leading-relaxed">
                        Thank you, {formData.name.split(' ')[0]}. We are thrilled to begin crafting your bespoke portrait for {formData.petName || 'your cherished pet'}.
                    </p>
                    <div className="mt-8 p-6 bg-white/50 rounded-xl border border-white/60 w-full max-w-md">
                        <p className="text-sm text-muted-foreground mb-2">Order Reference</p>
                        <p className="font-mono text-xl text-foreground tracking-widest">#{Date.now().toString().slice(-8)}</p>
                    </div>
                    <Button asChild className="mt-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                        <Link href="/">Return to Gallery</Link>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

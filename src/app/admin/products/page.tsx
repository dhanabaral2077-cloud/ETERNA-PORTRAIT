
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Reorder } from "framer-motion";
import { Loader2, Plus, Trash2, Save, Image as ImageIcon, GripVertical } from "lucide-react";
import Image from "next/image";

// Initialize Supabase Client (Public)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
    id: string;
    name: string;
    base_price: number;
    plan: string;
    image: string;
    gallery: string[];
    is_active: boolean;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            // Convert map back to array for admin list
            const productList = Object.entries(data).map(([id, p]: any) => ({
                id,
                ...p,
                base_price: p.basePrice // Map frontend camelCase to DB snake_case for UI consistency if needed, but API returns map
            }));

            // Actually the public API returns a map formatted for the frontend. 
            // We might want to fetch RAW data for admin or just Map it back. 
            // Let's use a direct DB fetch in a separate component or just use the map.
            // The public API reformats keys. Let's adjust to match.
            const formattedList = Object.entries(data).map(([id, p]: any) => ({
                id: id,
                name: p.name,
                base_price: p.basePrice,
                plan: p.plan,
                image: p.image,
                gallery: p.gallery || [],
                is_active: true // Public API implies active
            }));

            setProducts(formattedList);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch products" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSave = async () => {
        if (!editingProduct) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/products/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingProduct.id,
                    updates: {
                        image: editingProduct.image,
                        gallery: editingProduct.gallery,
                        base_price: editingProduct.base_price, // Assuming DB column matches
                        // Add other fields if editable
                    }
                })
            });

            if (!res.ok) throw new Error('Failed to update');

            toast({ title: "Success", description: "Product updated successfully" });
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not save changes" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
        const file = e.target.files?.[0];
        if (!file || !editingProduct) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${editingProduct.id}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            if (isMain) {
                setEditingProduct(prev => prev ? { ...prev, image: publicUrl } : null);
            } else {
                setEditingProduct(prev => prev ? { ...prev, gallery: [...prev.gallery, publicUrl] } : null);
            }

        } catch (error: any) {
            toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        }
    };

    const removeGalleryImage = (index: number) => {
        setEditingProduct(prev => {
            if (!prev) return null;
            const newGallery = [...prev.gallery];
            newGallery.splice(index, 1);
            return { ...prev, gallery: newGallery };
        });
    };

    // Simple drag-and-drop reorder could be added here later.
    // For MVP, just add/remove.

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
                    <p className="text-muted-foreground">Manage product images, pricing, and details.</p>
                </div>
                <Button onClick={fetchProducts} variant="outline" size="sm">Refresh</Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Card key={product.id} className="overflow-hidden">
                            <div className="relative h-48 w-full bg-muted">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription className="capitalize">{product.plan} Plan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary-foreground">Base Price:</span>
                                    <span className="font-semibold">${product.base_price}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-secondary-foreground">Gallery Images:</span>
                                    <span className="font-semibold">{product.gallery.length}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full" onClick={() => setEditingProduct(product)}>Edit Images & Details</Button>
                                    </DialogTrigger>
                                    {editingProduct?.id === product.id && (
                                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Edit {editingProduct.name}</DialogTitle>
                                                <DialogDescription>Update the main image, gallery, and pricing.</DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-6 py-4">
                                                {/* Base Details */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Base Price ($)</Label>
                                                        <Input
                                                            type="number"
                                                            value={editingProduct.base_price}
                                                            onChange={e => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                    {/* Add more fields like Name/Plan if needed, but usually these are static for specific product types */}
                                                </div>

                                                {/* Main Image */}
                                                <div className="space-y-4 border p-4 rounded-lg">
                                                    <Label className="text-base font-semibold">Main Image</Label>
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative h-32 w-32 border rounded-md overflow-hidden bg-muted">
                                                            <Image src={editingProduct.image} alt="Main" fill className="object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Label htmlFor="main-image-upload" className="cursor-pointer">
                                                                <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                                                                    <ImageIcon size={16} /> Change Main Image
                                                                </div>
                                                                <Input id="main-image-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground mt-1">Recommended: 800x800px or larger.</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Gallery */}
                                                <div className="space-y-4 border p-4 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-base font-semibold">Gallery Images</Label>
                                                        <Label htmlFor="gallery-upload" className="cursor-pointer">
                                                            <Button variant="secondary" size="sm" asChild>
                                                                <span><Plus size={16} className="mr-1" /> Add Image</span>
                                                            </Button>
                                                            <Input id="gallery-upload" type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(e, false)} />
                                                        </Label>
                                                    </div>

                                                    <Reorder.Group
                                                        axis="y"
                                                        values={editingProduct.gallery}
                                                        onReorder={(newOrder) => setEditingProduct({ ...editingProduct, gallery: newOrder })}
                                                        className="grid grid-cols-3 gap-4"
                                                    >
                                                        {editingProduct.gallery.map((img, idx) => (
                                                            <Reorder.Item key={img} value={img} className="relative group aspect-square border rounded-md overflow-hidden bg-muted cursor-grab active:cursor-grabbing">
                                                                <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover pointer-events-none" />
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx); }}
                                                                    className="absolute top-1 right-1 bg-destructive/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                                <div className="absolute bottom-1 left-1 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <GripVertical size={14} />
                                                                </div>
                                                            </Reorder.Item>
                                                        ))}
                                                    </Reorder.Group>
                                                </div>
                                            </div>

                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                                                <Button onClick={handleSave} disabled={isSaving}>
                                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Save Changes
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    )}
                                </Dialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

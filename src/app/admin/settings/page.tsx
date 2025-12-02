"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, UploadCloud, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function AdminSettingsPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Campaign State
    const [campaign, setCampaign] = useState({
        is_active: false,
        title: "",
        description: "",
        discount_code: "",
        discount_percent: 0,
        image_url: "",
        delay_seconds: 3,
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // Fetch User
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || "");
            }

            // Fetch Campaign
            try {
                const res = await fetch('/api/marketing/campaign');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setCampaign({
                            is_active: data.is_active,
                            title: data.title,
                            description: data.description || "",
                            discount_code: data.discount_code || "",
                            discount_percent: data.discount_percent || 0,
                            image_url: data.image_url || "",
                            delay_seconds: data.delay_seconds || 3,
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch campaign", error);
            }

            setLoading(false);
        };
        fetchData();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const fileExt = file.name.split('.').pop();
            const fileName = `popup-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('marketing-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('marketing-assets')
                .getPublicUrl(filePath);

            setCampaign(prev => ({ ...prev, image_url: publicUrl }));
            toast({ title: "Image Uploaded", description: "Don't forget to save your changes." });
        } catch (error) {
            console.error("Upload failed", error);
            toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload image. Ensure you are logged in as admin." });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveCampaign = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/marketing/campaign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(campaign),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast({
                title: "Campaign Updated",
                description: "Your marketing popup settings have been saved.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update campaign settings.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your admin profile and site-wide configurations.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input value={email} disabled />
                            <p className="text-xs text-muted-foreground">
                                Your email is managed via Supabase Auth.
                            </p>
                        </div>
                        <div className="pt-4">
                            <Button variant="outline" asChild className="w-full">
                                <a
                                    href="https://supabase.com/dashboard/project/_/auth/users"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Manage Users in Supabase
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Marketing Campaign Section */}
                <Card className="border-primary/20 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Marketing Popup
                            <Switch
                                checked={campaign.is_active}
                                onCheckedChange={(checked) => setCampaign(prev => ({ ...prev, is_active: checked }))}
                            />
                        </CardTitle>
                        <CardDescription>
                            Configure the promotional popup shown to visitors.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Popup Image</Label>
                            <div className="flex items-center gap-4">
                                <div
                                    className="relative w-24 h-24 rounded-lg border-2 border-dashed border-muted flex items-center justify-center overflow-hidden bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {campaign.image_url ? (
                                        <Image src={campaign.image_url} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <ImageIcon className="text-muted-foreground" />
                                    )}
                                    {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}
                                </div>
                                <div className="flex-1">
                                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        Upload Image
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">Recommended: 800x800px or similar.</p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Campaign Title</Label>
                            <Input
                                value={campaign.title}
                                onChange={(e) => setCampaign(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., Spring Sale"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={campaign.description}
                                onChange={(e) => setCampaign(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="e.g., Get 20% off all portraits this week!"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Discount Code</Label>
                                <Input
                                    value={campaign.discount_code}
                                    onChange={(e) => setCampaign(prev => ({ ...prev, discount_code: e.target.value }))}
                                    placeholder="e.g., SPRING20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Discount %</Label>
                                <Input
                                    type="number"
                                    value={campaign.discount_percent}
                                    onChange={(e) => setCampaign(prev => ({ ...prev, discount_percent: parseInt(e.target.value) || 0 }))}
                                    placeholder="20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Delay (Seconds)</Label>
                            <Input
                                type="number"
                                value={campaign.delay_seconds}
                                onChange={(e) => setCampaign(prev => ({ ...prev, delay_seconds: parseInt(e.target.value) || 0 }))}
                                placeholder="3"
                                min={0}
                            />
                            <p className="text-xs text-muted-foreground">How long to wait before showing the popup.</p>
                        </div>

                        <Button
                            onClick={handleSaveCampaign}
                            disabled={saving}
                            className="w-full mt-4"
                        >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Campaign Settings
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

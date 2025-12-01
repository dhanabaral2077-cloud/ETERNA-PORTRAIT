"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export default function AdminSettingsPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Campaign State
    const [campaign, setCampaign] = useState({
        is_active: false,
        title: "",
        description: "",
        discount_code: "",
        discount_percent: 0,
    });
    const [saving, setSaving] = useState(false);

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

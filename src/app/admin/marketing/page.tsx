"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

// Types
interface Campaign {
    id: string;
    title: string;
    description: string;
    discount_code: string;
    discount_percent: number;
    is_active: boolean;
    delay_seconds: number;
}

export default function MarketingAdminPage() {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchCampaign();
    }, []);

    const fetchCampaign = async () => {
        try {
            const res = await fetch("/api/marketing/campaign");
            const data = await res.json();
            if (data) setCampaign(data);
        } catch (error) {
            console.error("Failed to fetch campaign", error);
            toast({ title: "Error", description: "Failed to load campaign settings", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!campaign) return;
        setSaving(true);
        try {
            const res = await fetch("/api/marketing/campaign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(campaign),
            });

            if (!res.ok) throw new Error("Failed to save");

            const updated = await res.json();
            setCampaign(updated);
            toast({ title: "Success", description: "Campaign settings saved successfully." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save campaign", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!campaign) return <div>No campaign data found. Check database initialization.</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
            <div>
                <h1 className="text-3xl font-bold">Marketing Strategy</h1>
                <p className="text-muted-foreground">Manage your popups and sticky offers.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Global Campaign</CardTitle>
                            <CardDescription>This offer appears in the Popup and Sticky CTA.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={campaign.is_active}
                                onCheckedChange={(checked) => setCampaign({ ...campaign, is_active: checked })}
                            />
                            <Label>Active</Label>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Campaign Title</Label>
                            <Input
                                value={campaign.title}
                                onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                                placeholder="e.g. Welcome Offer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Discount Code</Label>
                            <Input
                                value={campaign.discount_code}
                                onChange={(e) => setCampaign({ ...campaign, discount_code: e.target.value })}
                                placeholder="e.g. WELCOME10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Discount Percentage</Label>
                            <Input
                                type="number"
                                value={campaign.discount_percent}
                                onChange={(e) => setCampaign({ ...campaign, discount_percent: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Popup Delay (seconds)</Label>
                            <Input
                                type="number"
                                value={campaign.delay_seconds}
                                onChange={(e) => setCampaign({ ...campaign, delay_seconds: parseInt(e.target.value) || 3 })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={campaign.description}
                            onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                            placeholder="Marketing copy for the popup..."
                            rows={3}
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleSave} disabled={saving} size="lg">
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

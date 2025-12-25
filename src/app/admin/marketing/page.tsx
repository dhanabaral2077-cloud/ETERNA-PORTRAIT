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
import { Loader2, Save, Trash2 } from "lucide-react";

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

interface DiscountCode {
    id: string;
    created_at: string;
    code: string;
    discount_percent: number;
    description: string;
    is_active: boolean;
    usage_count: number;
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

            {/* Promo Code Manager */}
            <PromoCodeManager />

            {/* Subscribers List */}
            <SubscribersList />
        </div>
    );
}

function PromoCodeManager() {
    const [codes, setCodes] = useState<DiscountCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCode, setNewCode] = useState({ code: '', percent: 10, description: '' });
    const { toast } = useToast();

    const fetchCodes = async () => {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false });
        if (data) setCodes(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const toggleActive = async (id: string, currentState: boolean) => {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error } = await supabase.from('discount_codes').update({ is_active: !currentState }).eq('id', id);
        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update code status.' });
        } else {
            fetchCodes();
        }
    };

    const addCode = async () => {
        if (!newCode.code || !newCode.percent) return;
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error } = await supabase.from('discount_codes').insert({
            code: newCode.code.toUpperCase(),
            discount_percent: newCode.percent,
            description: newCode.description
        });

        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } else {
            toast({ title: 'Success', description: 'Discount code created!' });
            setNewCode({ code: '', percent: 10, description: '' });
            fetchCodes();
        }
    };

    const deleteCode = async (id: string) => {
        if (!confirm('Are you sure you want to delete this code?')) return;
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error } = await supabase.from('discount_codes').delete().eq('id', id);
        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete code.' });
        } else {
            fetchCodes();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Promo Code Manager</CardTitle>
                <CardDescription>Create and manage standalone discount codes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-4 items-end bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-2 flex-1">
                        <Label>Code</Label>
                        <Input
                            value={newCode.code}
                            onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                            placeholder="e.g. VIP20"
                        />
                    </div>
                    <div className="space-y-2 w-24">
                        <Label>% Off</Label>
                        <Input
                            type="number"
                            value={newCode.percent}
                            onChange={(e) => setNewCode({ ...newCode, percent: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2 flex-1">
                        <Label>Description</Label>
                        <Input
                            value={newCode.description}
                            onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                            placeholder="Internal note"
                        />
                    </div>
                    <Button onClick={addCode}><Save className="w-4 h-4 mr-2" /> Add Code</Button>
                </div>

                <div className="rounded-md border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 font-medium">Code</th>
                                <th className="p-3 font-medium">Discount</th>
                                <th className="p-3 font-medium">Active</th>
                                <th className="p-3 font-medium">Usage</th>
                                <th className="p-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codes.map((code) => (
                                <tr key={code.id} className="border-t">
                                    <td className="p-3 font-bold">{code.code}</td>
                                    <td className="p-3">{code.discount_percent}%</td>
                                    <td className="p-3">
                                        <Switch checked={code.is_active} onCheckedChange={() => toggleActive(code.id, code.is_active)} />
                                    </td>
                                    <td className="p-3 text-muted-foreground">{code.usage_count || 0}</td>
                                    <td className="p-3">
                                        <Button variant="ghost" size="sm" onClick={() => deleteCode(code.id)} className="text-destructive h-8 w-8 p-0">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {codes.length === 0 && !loading && (
                                <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No active codes.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function SubscribersList() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubs = async () => {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
            if (data) setSubscribers(data);
            setLoading(false);
        };
        fetchSubs();
    }, []);

    const copyEmails = () => {
        const emails = subscribers.map(s => s.email).join(', ');
        navigator.clipboard.writeText(emails);
        alert('Emails copied to clipboard!');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Newsletter Subscribers ({subscribers.length})</CardTitle>
                        <CardDescription>Export this list to your email marketing tool.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={copyEmails} disabled={loading}>
                        Copy All Emails
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3 font-medium">Email</th>
                                    <th className="p-3 font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map((sub) => (
                                    <tr key={sub.id} className="border-t">
                                        <td className="p-3">{sub.email}</td>
                                        <td className="p-3 text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {subscribers.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="p-6 text-center text-muted-foreground">No subscribers yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || "");
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your admin profile and preferences.
                </p>
            </div>

            <Card className="max-w-xl">
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
                        <Button variant="outline" asChild>
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
        </div>
    );
}

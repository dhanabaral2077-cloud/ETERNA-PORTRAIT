"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, Settings2 } from "lucide-react";
import { OrderDetailsModal } from "@/components/admin/order-details-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@supabase/supabase-js";

interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    price: number;
    status: string;
    package: string;
    [key: string]: any; // Allow for extra properties from the API update
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "POST",
                body: JSON.stringify({}), // Password check removed in API
            });

            const data = await res.json();
            if (data.orders) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders & Drafts</h1>
                    <p className="text-muted-foreground">
                        Manage customer orders and recover abandoned carts.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="orders">Active Orders</TabsTrigger>
                    <TabsTrigger value="drafts">Abandoned Carts</TabsTrigger>
                </TabsList>

                <TabsContent value="orders">
                    <OrdersTable orders={orders} isLoading={isLoading} onManage={handleManageOrder} />
                </TabsContent>

                <TabsContent value="drafts">
                    <DraftsTable />
                </TabsContent>
            </Tabs>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStatusUpdate={fetchOrders}
            />
        </div>
    );
}

function OrdersTable({ orders, isLoading, onManage }: { orders: Order[], isLoading: boolean, onManage: (o: Order) => void }) {
    // ... (Existing Table Logic wrapped in component)
    const getStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'default';
            case 'in progress': return 'secondary';
            case 'shipped': return 'outline';
            case 'completed': return 'default';
            default: return 'secondary';
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                                <p>Loading...</p>
                            </TableCell>
                        </TableRow>
                    ) : orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No orders found.</TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/5">
                                <TableCell className="font-mono text-xs font-medium">#{order.id.slice(0, 8)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{order.customer_name}</span>
                                        <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">{order.package}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {format(new Date(order.created_at), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="font-medium">${order.price}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="ghost" onClick={() => onManage(order)} className="h-8 px-2">
                                        <Settings2 className="w-4 h-4 mr-2" /> Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function DraftsTable() {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrafts = async () => {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data } = await supabase.from('order_drafts').select('*').order('updated_at', { ascending: false });
            if (data) setDrafts(data);
            setLoading(false);
        };
        fetchDrafts();
    }, []);

    const copyRecoveryLink = (draft: any) => {
        // Construct a link that would pre-fill data or identify the session
        // For now, simpler: just copy email
        navigator.clipboard.writeText(draft.email);
        alert(`Email copied: ${draft.email}`);
    };

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-orange-50/50">
                        <TableHead>Email</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Pet Name</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow><TableCell colSpan={4} className="text-center p-4">Loading Drafts...</TableCell></TableRow>
                    ) : drafts.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center p-8 text-muted-foreground">No abandoned carts found.</TableCell></TableRow>
                    ) : (
                        drafts.map((draft) => (
                            <TableRow key={draft.id}>
                                <TableCell className="font-medium">{draft.email || 'Anonymous'}</TableCell>
                                <TableCell className="text-muted-foreground">{new Date(draft.updated_at).toLocaleString()}</TableCell>
                                <TableCell>{draft.form_data?.petName || '-'}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => copyRecoveryLink(draft)} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                        Recover
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

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

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'default'; // Blue-ish usually
            case 'in progress': return 'secondary';
            case 'shipped': return 'outline'; // Or success color if available in theme
            case 'completed': return 'default';
            default: return 'secondary';
        }
    };

    const getStatusLabel = (status: string) => {
        // Capitalize or format if needed
        return status;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">
                        View and manage customer orders.
                    </p>
                </div>
                <Button onClick={fetchOrders} variant="outline" size="sm" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Refresh List"}
                </Button>
            </div>

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
                                    <div className="flex flex-col justify-center items-center text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                                        <p>Loading your orders...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    No orders found.
                                </TableCell>
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
                                        <Badge variant={getStatusVariant(order.status) as any}>
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleManageOrder(order)}
                                            className="h-8 px-2 lg:px-3"
                                        >
                                            <Settings2 className="w-4 h-4 mr-2" />
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStatusUpdate={fetchOrders}
            />
        </div>
    );
}

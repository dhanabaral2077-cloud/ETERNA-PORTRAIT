import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Package, Truck, CheckCircle, Loader2, Download, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose, onStatusUpdate }: OrderDetailsModalProps) {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [carrier, setCarrier] = useState("");

    // Status color helper
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-blue-100 text-blue-800';
            case 'in progress': return 'bg-yellow-100 text-yellow-800';
            case 'shipped': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: `${label} copied to clipboard.` });
    };

    const getGelatoAddress = () => {
        const c = order.customer_address; // This is the full object from our API update
        if (!c || typeof c === 'string') return order.customer_full_address_string || "No address data";

        // Format for Gelato (Standard format)
        return `${c.name}
${c.address_line1}
${c.address_line2 ? c.address_line2 : ''}
${c.city}, ${c.state_province_region} ${c.postal_code}
${c.country}
${c.email}`;
    };

    const handleUpdateStatus = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch('/api/admin/orders/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    status: newStatus,
                    trackingNumber,
                    carrier
                })
            });

            if (res.ok) {
                toast({ title: "Status Updated", description: `Order marked as ${newStatus}. Email sent to customer.` });
                onStatusUpdate();
                onClose();
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not update status." });
        } finally {
            setIsUpdating(false);
        }
    };

    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl font-headline flex items-center gap-3">
                                Order #{order.id.slice(0, 8)}
                                <Badge className={getStatusColor(order.status)} variant="outline">
                                    {order.status}
                                </Badge>
                            </DialogTitle>
                            <DialogDescription>
                                Placed on {new Date(order.created_at).toLocaleDateString()} by {order.customer_name}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details">Order Details</TabsTrigger>
                        <TabsTrigger value="fulfillment">Fulfillment & Gelato</TabsTrigger>
                        <TabsTrigger value="assets">Assets & Photos</TabsTrigger>
                    </TabsList>

                    {/* --- DETAILS TAB --- */}
                    <TabsContent value="details" className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center"><Package className="w-5 h-5 mr-2" /> Product Info</h3>
                                <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Package:</span> <span className="font-medium">{order.package}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Style:</span> <span className="font-medium capitalize">{order.style || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Pet Name:</span> <span className="font-medium">{order.pet_name || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Price:</span> <span className="font-medium">${order.price}</span></div>
                                </div>

                                {order.notes && (
                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
                                        <p className="font-semibold flex items-center mb-1"><AlertCircle className="w-4 h-4 mr-1" /> Customer Notes:</p>
                                        "{order.notes}"
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center"><Truck className="w-5 h-5 mr-2" /> Shipping Info</h3>
                                <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm relative group">
                                    <p className="font-medium">{order.customer_name}</p>
                                    <p>{order.customer_email}</p>
                                    <div className="my-2 border-t border-muted/20" />
                                    <p className="whitespace-pre-line">{order.customer_full_address_string}</p>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => copyToClipboard(getGelatoAddress(), "Address")}
                                    >
                                        <Copy className="w-3 h-3 mr-1" /> Copy
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* --- FULFILLMENT TAB --- */}
                    <TabsContent value="fulfillment" className="space-y-6 pt-4">
                        <div className="grid gap-6">
                            <div className="border border-blue-100 bg-blue-50/50 p-6 rounded-xl">
                                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                                    1. Gelato Fulfillment Helper
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-blue-700">Use this to quickly copy-paste data into Gelato's "New Order" screen.</p>
                                    <div className="flex gap-3">
                                        <Button onClick={() => copyToClipboard(getGelatoAddress(), "Full Address")} className="bg-blue-600 hover:bg-blue-700">
                                            <Copy className="w-4 h-4 mr-2" /> Copy Full Address Block
                                        </Button>
                                        <Button variant="outline" onClick={() => window.open('https://gelato.com/dashboard', '_blank')}>
                                            <ExternalLink className="w-4 h-4 mr-2" /> Open Gelato
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-green-100 bg-green-50/50 p-6 rounded-xl">
                                <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                                    2. Update Status & Notify
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Carrier (e.g. USPS, DHL)</Label>
                                            <Input
                                                placeholder="e.g. USPS"
                                                value={carrier}
                                                onChange={(e) => setCarrier(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tracking Number</Label>
                                            <Input
                                                placeholder="e.g. 9400..."
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {order.status !== 'In Progress' && (
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleUpdateStatus('In Progress')}
                                                disabled={isUpdating}
                                            >
                                                Mark as "In Progress"
                                            </Button>
                                        )}
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleUpdateStatus('Shipped')}
                                            disabled={isUpdating || !trackingNumber}
                                        >
                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Truck className="w-4 h-4 mr-2" />}
                                            Mark as "Shipped" & Notify
                                        </Button>
                                    </div>
                                    {!trackingNumber && <p className="text-xs text-muted-foreground">* Tracking number required to mark as shipped.</p>}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* --- ASSETS TAB --- */}
                    <TabsContent value="assets" className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {order.photo_urls && order.photo_urls.map((url: string, index: number) => (
                                <div key={index} className="group relative aspect-square bg-muted rounded-xl overflow-hidden border">
                                    {/* Using standard img for admin dashboard can be safer for varying external URLs than Next Image if not configured */}
                                    <img src={url} alt={`Reference ${index + 1}`} className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="secondary" size="sm" asChild>
                                            <a href={url} target="_blank" rel="noopener noreferrer" download>
                                                <Download className="w-4 h-4 mr-2" /> Download
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {(!order.photo_urls || order.photo_urls.length === 0) && (
                                <div className="col-span-full py-12 text-center text-muted-foreground">
                                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    No photos found for this order.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

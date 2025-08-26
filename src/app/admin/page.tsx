// src/app/admin/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Search, DollarSign, Package, BarChart } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  package: string;
  price: number;
  status: string;
  photo_urls: string[];
  notes?: string;
};

type Stats = {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
}

const ORDER_STATUSES = ['Paid', 'In Progress', 'Shipped', 'Completed', 'Canceled'];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchOrders = async (currentPassword?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: currentPassword || password, search: searchTerm }),
      });

      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Authentication failed' : 'Failed to fetch orders');
      }

      const data = await res.json();
      setOrders(data.orders);
      setStats(data.stats);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      if (err.message.includes('Authentication')) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchOrders(password);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  }
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
        const response = await fetch('/api/admin/orders/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, orderId, status: newStatus }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update status');
        }

        // Optimistically update the UI
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        
        toast({ title: "Success", description: "Order status updated successfully." });

    } catch (error: any) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(order =>
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.package?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);


  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-sm p-8 space-y-6 bg-card rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-center font-headline text-foreground">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
            </Button>
            {error && <p className="text-sm text-center text-destructive">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-headline text-foreground">Order Dashboard</h1>
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
                <Input 
                    placeholder="Search by name, email, or package..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </form>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${(stats.totalRevenue / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${(stats.averageOrderValue / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </CardContent>
            </Card>
        </div>
      
      <div className="p-4 bg-card rounded-2xl shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24"><Loader2 className="animate-spin mx-auto" /></TableCell>
                </TableRow>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{order.customer_name}</div>
                    <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                  </TableCell>
                  <TableCell>{order.package}</TableCell>
                  <TableCell>${(order.price / 100).toFixed(2)}</TableCell>
                  <TableCell>
                     <Select value={order.status} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue>
                                <Badge variant={order.status === 'Paid' ? 'default' : 'secondary'}>{order.status}</Badge>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {ORDER_STATUSES.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                     </Select>
                  </TableCell>
                  <TableCell>
                     <div className="flex space-x-2">
                        {order.photo_urls && order.photo_urls.map((url, i) => (
                          url && <a href={url} key={i} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={order.notes}>{order.notes}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No orders found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

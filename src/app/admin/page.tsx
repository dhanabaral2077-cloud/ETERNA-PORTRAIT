"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, FileText, Users } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        blogPosts: 0,
        activeUsers: 0, // This would ideally come from analytics
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Orders & Revenue
                const ordersRes = await fetch("/api/admin/orders", {
                    method: "POST",
                    body: JSON.stringify({}), // No password needed now
                });
                const ordersData = await ordersRes.json();

                // Fetch Blog Count
                const blogRes = await fetch("/api/blog");
                const blogData = await blogRes.json();

                setStats({
                    totalRevenue: ordersData.stats?.totalRevenue || 0,
                    totalOrders: ordersData.stats?.totalOrders || 0,
                    blogPosts: Array.isArray(blogData) ? blogData.length : 0,
                    activeUsers: 142, // Mock for now as we don't have real-time analytics API
                });

                setRecentOrders(ordersData.orders?.slice(0, 5) || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: "Lifetime",
            icon: DollarSign,
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toString(),
            change: "Lifetime",
            icon: ShoppingBag,
        },
        {
            title: "Blog Posts",
            value: stats.blogPosts.toString(),
            change: "Published",
            icon: FileText,
        },
        {
            title: "Active Users",
            value: stats.activeUsers.toString(),
            change: "Currently Online",
            icon: Users,
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isLoading ? "..." : stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-md">
                            <p>Revenue Chart Integration Coming Soon</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {isLoading ? (
                                <p>Loading orders...</p>
                            ) : recentOrders.length === 0 ? (
                                <p className="text-muted-foreground">No recent orders.</p>
                            ) : (
                                recentOrders.map((order: any) => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {order.customer_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.customer_email}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">+${order.price}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

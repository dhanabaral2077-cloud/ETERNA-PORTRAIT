"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, FileText, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        blogPosts: 0,
        activeUsers: 142,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate real-time active users
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                activeUsers: Math.max(100, Math.floor(prev.activeUsers + (Math.random() - 0.5) * 10))
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Orders & Revenue
                const ordersRes = await fetch("/api/admin/orders", {
                    method: "POST",
                    body: JSON.stringify({}),
                });
                const ordersData = await ordersRes.json();

                // Fetch Blog Count
                const blogRes = await fetch("/api/blog");
                const blogData = await blogRes.json();

                // Process Revenue Data for Chart
                if (ordersData.orders) {
                    const chartDataMap = new Map();

                    // Sort orders by date ascending first
                    const sortedOrders = [...ordersData.orders].sort((a: any, b: any) =>
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    );

                    sortedOrders.forEach((order: any) => {
                        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const current = chartDataMap.get(date) || 0;
                        chartDataMap.set(date, current + order.price);
                    });

                    // Take last 7 days or entries for the chart if too many
                    const chartData = Array.from(chartDataMap.entries()).map(([name, total]) => ({
                        name,
                        total
                    })).slice(-7);

                    setRevenueData(chartData);
                }

                setStats(prev => ({
                    ...prev,
                    totalRevenue: ordersData.stats?.totalRevenue || 0,
                    totalOrders: ordersData.stats?.totalOrders || 0,
                    blogPosts: Array.isArray(blogData) ? blogData.length : 0,
                }));

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
                                <div className="text-2xl font-bold">{isLoading && index !== 3 ? "..." : stat.value}</div>
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
                        <div className="h-[350px] w-full">
                            {revenueData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#adfa1d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#adfa1d" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
                                            itemStyle={{ color: '#000' }}
                                            formatter={(value: any) => [`$${value}`, "Revenue"]}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#adfa1d"
                                            fillOpacity={1}
                                            fill="url(#colorTotal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    {isLoading ? "Loading chart..." : "No revenue data available"}
                                </div>
                            )}
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

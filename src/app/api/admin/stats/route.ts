import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET(request: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // Fetch specific fields to minimize data transfer, though we need price and created_at for all
        const { data: orders, error } = await supabase
            .from('orders')
            .select('id, price, created_at, status')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate trailing 30 days revenue
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = startOfDay(subDays(new Date(), 29 - i));
            return {
                date: format(date, 'MMM dd'),
                isoDate: date.toISOString(),
                revenue: 0,
                orders: 0
            };
        });

        orders.forEach(order => {
            const orderDate = startOfDay(new Date(order.created_at));
            const dayStat = last30Days.find(day => startOfDay(new Date(day.isoDate)).getTime() === orderDate.getTime());
            if (dayStat) {
                dayStat.revenue += (order.price || 0);
                dayStat.orders += 1;
            }
        });

        // Get 5 recent orders
        const recentOrders = orders.slice(0, 5).map(order => ({
            id: order.id,
            price: order.price,
            date: order.created_at,
            status: order.status
        }));

        return NextResponse.json({
            summary: {
                totalRevenue,
                totalOrders,
                averageOrderValue
            },
            chartData: last30Days.map(d => ({ name: d.date, revenue: d.revenue })),
            recentOrders
        });

    } catch (error: any) {
        console.error('Stats fetch failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

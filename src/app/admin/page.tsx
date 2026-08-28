import React from 'react';
import { verifySession } from '@/lib/session';
import { AuthService } from '@/services/authService';
import prisma from '@/lib/prisma';
import { AdminDashboardClient } from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const session = await verifySession();
  const user = session ? await AuthService.getUserById(session.userId) : null;

  if (!user) return null;

  // 1. KPI Stats
  const totalProjects = await prisma.project.count({ where: { archived: false } });
  const totalUnits = await prisma.propertyUnit.count({ where: { archived: false } });
  const totalCustomers = await prisma.customer.count();
  
  // Calculate total revenue from Booked/Sold properties (Or just use Booking table)
  // Let's use Booking table for confirmed bookings
  const confirmedBookings = await prisma.booking.findMany({
    where: { status: { in: ['Confirmed', 'Awaiting Payment'] } },
    select: { price: true }
  });
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.price, 0);

  const stats = {
    totalProjects,
    totalUnits,
    totalCustomers,
    totalRevenue
  };

  // 2. Recent Bookings
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: {
      customer: { select: { name: true } }
    }
  });

  // 3. Recent Customers
  const recentCustomers = await prisma.customer.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  // 4. Unit Status Data (for Bar/Donut Chart)
  // We need the names of statuses, so we group by statusId and then map it
  const properties = await prisma.propertyUnit.findMany({
    where: { archived: false },
    select: { propertyStatus: { select: { name: true, colorHex: true } } }
  });
  
  const statusCountMap: Record<string, { value: number, colorHex: string }> = {};
  properties.forEach(p => {
    const name = p.propertyStatus?.name || 'Unknown';
    if (!statusCountMap[name]) {
      statusCountMap[name] = { value: 0, colorHex: p.propertyStatus?.colorHex || '#ccc' };
    }
    statusCountMap[name].value += 1;
  });
  
  const unitStatusData = Object.entries(statusCountMap).map(([name, data]) => ({
    name,
    value: data.value,
    colorHex: data.colorHex
  })).sort((a, b) => b.value - a.value);

  // 5. Chart Data (Revenue by month for the last 6 months)
  // Generate last 6 months labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = [];
  const now = new Date();
  
  // To make the chart look nice even if there's no data, we'll initialize 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    chartData.push({
      month: `${months[d.getMonth()]} ${d.getFullYear().toString().substr(2)}`,
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      revenue: 0
    });
  }

  // Fetch all bookings from last 6 months
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const recentValidBookings = await prisma.booking.findMany({
    where: { 
      date: { gte: sixMonthsAgo },
      status: { in: ['Confirmed', 'Awaiting Payment'] }
    },
    select: { date: true, price: true }
  });

  recentValidBookings.forEach(b => {
    const bMonth = b.date.getMonth();
    const bYear = b.date.getFullYear();
    const match = chartData.find(c => c.monthIndex === bMonth && c.year === bYear);
    if (match) {
      match.revenue += b.price;
    }
  });

  return (
    <AdminDashboardClient 
      stats={stats}
      recentBookings={recentBookings}
      recentCustomers={recentCustomers}
      chartData={chartData}
      unitStatusData={unitStatusData}
    />
  );
}

import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAuthContext } from '@/lib/authGuard';
import {
  AdminDashboardClient,
  DashboardActivityItem,
  DashboardLeadItem,
  DashboardProjectSummary,
  DashboardStats,
  DashboardUnitItem,
} from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const ctx = await getAuthContext();

  // Role-based dashboard dispatching:
  // Petugas Lapangan / Field Agent langsung diarahkan ke menu Progres Konstruksi
  if (ctx.isFieldAgent) {
    redirect('/admin/construction');
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    activeProjectsRaw,
    allUnitsRaw,
    totalCustomers,
    allLeadStatusesRaw,
    recentLeadsRaw,
    activeBookingsRaw,
    activeSalesRaw,
    recentBookingsRaw,
    recentCustomersRaw,
    recentStatusHistoriesRaw,
    recentConstructionUpdatesRaw,
  ] = await Promise.all([
    prisma.project.findMany({
      where: { archived: false },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        status: true,
        overallProgress: true,
        targetCompletion: true,
        totalUnits: true,
        availableUnits: true,
      },
    }),
    prisma.propertyUnit.findMany({
      where: { archived: false },
      orderBy: [{ unitNumber: 'asc' }],
      include: {
        propertyStatus: { select: { id: true, name: true, colorHex: true, order: true } },
        customer: { select: { id: true, name: true } },
        project: { select: { id: true, title: true, slug: true } },
        phase: { select: { id: true, name: true } },
      },
    }),
    prisma.customer.count(),
    prisma.lead.findMany({
      select: { status: true },
    }),
    prisma.lead.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.booking.findMany({
      where: { status: { in: ['Confirmed', 'Awaiting Payment'] } },
      select: {
        id: true,
        price: true,
        date: true,
        status: true,
        sales: {
          where: { status: { not: 'Cancelled' } },
          select: { id: true },
        },
      },
    }),
    prisma.sale.findMany({
      where: { status: { not: 'Cancelled' } },
      select: {
        id: true,
        contractPrice: true,
        status: true,
        date: true,
      },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        customer: { select: { name: true } },
      },
    }),
    prisma.customer.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.unitStatusHistory.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        propertyUnit: { select: { unitNumber: true, projectTitle: true } },
        customer: { select: { name: true } },
        agency: { select: { name: true } },
      },
    }),
    prisma.unitConstructionUpdate.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        propertyUnit: { select: { unitNumber: true, projectTitle: true } },
      },
    }),
  ]);

  // 1. Klasifikasi Status Kavling Nyata
  let availableUnits = 0;
  let soldUnits = 0;
  let bookedUnits = 0;

  const statusCountMap: Record<string, { value: number; colorHex: string }> = {};
  for (const unit of allUnitsRaw) {
    const statusName = unit.propertyStatus?.name || 'Unknown';
    const lower = statusName.toLowerCase();

    if (lower.includes('avail') || lower.includes('ready') || lower.includes('tersedia')) {
      availableUnits += 1;
    } else if (lower.includes('sold') || lower.includes('terjual') || lower.includes('akad') || lower.includes('lunas')) {
      soldUnits += 1;
    } else if (lower.includes('book') || lower.includes('hold') || lower.includes('nup') || lower.includes('sp3k') || lower.includes('pesan')) {
      bookedUnits += 1;
    }

    if (!statusCountMap[statusName]) {
      statusCountMap[statusName] = {
        value: 0,
        colorHex: unit.propertyStatus?.colorHex || '#94A3B8',
      };
    }
    statusCountMap[statusName].value += 1;
  }

  const unitStatusData = Object.entries(statusCountMap)
    .map(([name, data]) => ({
      name,
      value: data.value,
      colorHex: data.colorHex,
    }))
    .sort((a, b) => b.value - a.value);

  // 2. Kalkulasi Nilai Transaksi & Pipeline Tanpa Double-Counting
  const salesRevenue = activeSalesRaw.reduce((sum, s) => sum + (s.contractPrice || 0), 0);
  const bookingsWithoutSale = activeBookingsRaw.filter((b) => !b.sales || b.sales.length === 0);
  const bookingOnlyRevenue = bookingsWithoutSale.reduce((sum, b) => sum + (b.price || 0), 0);
  const totalPipelineValue = salesRevenue + bookingOnlyRevenue;

  const thisMonthSales = activeSalesRaw.filter((s) => s.date >= startOfMonth);
  const thisMonthBookingsWithoutSale = bookingsWithoutSale.filter((b) => b.date >= startOfMonth);
  const thisMonthTransactionCount = thisMonthSales.length + thisMonthBookingsWithoutSale.length;
  const thisMonthTransactionValue =
    thisMonthSales.reduce((sum, s) => sum + (s.contractPrice || 0), 0) +
    thisMonthBookingsWithoutSale.reduce((sum, b) => sum + (b.price || 0), 0);

  // 3. Lead Counts Per Stage Nyata
  const leadStageCounts = {
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Lost: 0,
  };
  for (const row of allLeadStatusesRaw) {
    if (row.status === 'New') leadStageCounts.New += 1;
    else if (row.status === 'Contacted') leadStageCounts.Contacted += 1;
    else if (row.status === 'Qualified') leadStageCounts.Qualified += 1;
    else if (row.status === 'Lost') leadStageCounts.Lost += 1;
  }

  const totalLeads = allLeadStatusesRaw.length;
  const convertedCount = activeSalesRaw.length + bookingsWithoutSale.length;
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 1000) / 10 : 0;

  const stats: DashboardStats = {
    totalProjects: activeProjectsRaw.length,
    totalUnits: allUnitsRaw.length,
    availableUnits,
    bookedUnits,
    soldUnits,
    totalCustomers,
    totalLeads,
    leadStageCounts,
    totalSales: activeSalesRaw.length,
    activeBookingsCount: activeBookingsRaw.length,
    totalPipelineValue,
    thisMonthTransactionCount,
    thisMonthTransactionValue,
    conversionRate,
  };

  // 4. Chart Data 6 Bulan Terakhir (Real Sales + Unconverted Active Bookings)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const chartData: { month: string; monthIndex: number; year: number; revenue: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    chartData.push({
      month: `${months[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`,
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      revenue: 0,
    });
  }

  for (const s of activeSalesRaw) {
    if (s.date >= sixMonthsAgo) {
      const match = chartData.find(
        (c) => c.monthIndex === s.date.getMonth() && c.year === s.date.getFullYear()
      );
      if (match) match.revenue += s.contractPrice || 0;
    }
  }

  for (const b of bookingsWithoutSale) {
    if (b.date >= sixMonthsAgo) {
      const match = chartData.find(
        (c) => c.monthIndex === b.date.getMonth() && c.year === b.date.getFullYear()
      );
      if (match) match.revenue += b.price || 0;
    }
  }

  // 5. Serialize Leads, Units, Projects, Bookings, Customers, Activity Feed
  const recentLeads: DashboardLeadItem[] = recentLeadsRaw.map((l) => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    email: l.email,
    projectId: l.projectId,
    projectTitle: l.project?.title || null,
    propertyType: l.propertyType || null,
    budget: l.budget || null,
    message: l.message || '',
    source: l.source || 'Website',
    status: l.status || 'New',
    createdAt: l.createdAt.toISOString(),
  }));

  const units: DashboardUnitItem[] = allUnitsRaw.map((u) => ({
    id: u.id,
    projectId: u.projectId,
    projectTitle: u.project?.title || u.projectTitle,
    projectSlug: u.project?.slug || '',
    phaseName: u.phase?.name || null,
    unitNumber: u.unitNumber,
    typeName: u.typeName,
    landSize: u.landSize,
    buildingSize: u.buildingSize,
    bedrooms: u.bedrooms,
    bathrooms: u.bathrooms,
    price: u.price,
    constructionProgress: u.constructionProgress,
    statusName: u.propertyStatus?.name || 'Unknown',
    statusColorHex: u.propertyStatus?.colorHex || '#64748B',
    customerName: u.customer?.name || null,
  }));

  const projects: DashboardProjectSummary[] = activeProjectsRaw.map((p) => {
    const prjUnits = units.filter((u) => u.projectId === p.id);
    const prjAvail = prjUnits.filter((u) => {
      const lower = u.statusName.toLowerCase();
      return lower.includes('avail') || lower.includes('ready') || lower.includes('tersedia');
    }).length;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      location: p.location,
      status: p.status,
      overallProgress: p.overallProgress,
      targetCompletion: p.targetCompletion,
      totalUnitsCount: prjUnits.length > 0 ? prjUnits.length : p.totalUnits,
      availableUnitsCount: prjUnits.length > 0 ? prjAvail : p.availableUnits,
    };
  });

  const activityItems: DashboardActivityItem[] = [
    ...recentStatusHistoriesRaw.map((h) => ({
      id: `hist-${h.id}`,
      type: 'status' as const,
      title: `Status Unit ${h.propertyUnit.unitNumber.toUpperCase()} → ${h.statusName}`,
      description: `${h.propertyUnit.projectTitle}${h.customer?.name ? ` • Konsumen: ${h.customer.name}` : ''}${h.notes ? ` — ${h.notes}` : ''}`,
      createdAt: h.createdAt.toISOString(),
    })),
    ...recentConstructionUpdatesRaw.map((c) => ({
      id: `const-${c.id}`,
      type: 'construction' as const,
      title: `Progres Bangunan ${c.propertyUnit.unitNumber.toUpperCase()} (${Math.round(c.progress)}%)`,
      description: `${c.propertyUnit.projectTitle}${c.notes ? ` — ${c.notes}` : ' • Pembaruan progres lapangan'}`,
      createdAt: c.createdAt.toISOString(),
    })),
    ...recentBookingsRaw.map((b) => ({
      id: `book-${b.id}`,
      type: 'booking' as const,
      title: `Booking Unit ${b.unitNumber.toUpperCase()} (${b.status})`,
      description: `${b.projectTitle} • ${b.customer?.name || 'Konsumen'} • Rp ${b.price.toLocaleString('id-ID')}`,
      createdAt: b.date.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const recentBookings = recentBookingsRaw.map((b) => ({
    id: b.id,
    projectTitle: b.projectTitle,
    unitNumber: b.unitNumber,
    price: b.price,
    status: b.status,
    customerName: b.customer?.name || 'Unknown',
    date: b.date.toISOString(),
  }));

  const recentCustomers = recentCustomersRaw.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      stats={stats}
      projects={projects}
      units={units}
      recentLeads={recentLeads}
      activityFeed={activityItems}
      recentBookings={recentBookings}
      recentCustomers={recentCustomers}
      chartData={chartData}
      unitStatusData={unitStatusData}
    />
  );
}

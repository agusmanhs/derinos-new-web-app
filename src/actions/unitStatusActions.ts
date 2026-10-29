'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';
import { AuthService } from '@/services/authService';

import { SalesService } from '@/services/salesService';

export interface DealInputData {
  createDeal?: boolean;
  paymentMethod?: 'Cash' | 'Mortgage' | 'Installment';
  contractPrice?: number;
  dealStatus?: 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
}

export async function updateUnitStatusFromSitePlan(
  propertyUnitId: string,
  newStatusId: string,
  newStatusName: string, // "Available", "Booking", "Sold", dll
  customerId?: string,
  agencyId?: string,
  bookingFee?: number,
  notes?: string,
  dealData?: DealInputData
) {
  try {
    const session = await verifySession();
    if (!session) {
      return { success: false, message: 'Unauthorized' };
    }
    const liveUser = await AuthService.getUserById(session.userId);
    const userPerms = liveUser?.role?.permissions || session.permissions || [];
    const roleName = liveUser?.role?.name || session.roleName || '';
    const canUpdateStatus = roleName === 'Super Admin' || userPerms.includes('manage_projects') || userPerms.includes('update_unit_status');
    if (!canUpdateStatus) {
      return { success: false, message: 'Forbidden: Anda tidak memiliki izin untuk mengubah status unit' };
    }
    const unit = await prisma.propertyUnit.findUnique({
      where: { id: propertyUnitId },
      include: { project: true }
    });

    if (!unit) {
      return { success: false, message: 'Property unit not found' };
    }

    const isAvailable = newStatusName === 'Available' || newStatusName === 'Unmapped / Other';
    const finalCustomerId = isAvailable ? null : (customerId || null);

    // 1. Update the property unit status
    await prisma.propertyUnit.update({
      where: { id: propertyUnitId },
      data: {
        statusId: newStatusId,
        customerId: finalCustomerId,
      }
    });

    // 1.5. Record the status change in UnitStatusHistory
    const historyCustomerId = isAvailable ? (unit.customerId || customerId || null) : finalCustomerId;
    const finalNotes = dealData?.notes || notes || null;
    await prisma.unitStatusHistory.create({
      data: {
        propertyUnitId,
        statusId: newStatusId,
        statusName: newStatusName,
        customerId: historyCustomerId,
        agencyId: agencyId || null,
        notes: finalNotes
      }
    });

    // 2. Logic based on status transition
    const requiresCustomer = !isAvailable;
    if (requiresCustomer && !customerId) {
      throw new Error(`Customer is required when changing status to ${newStatusName}`);
    }

    const latestBooking = await prisma.booking.findFirst({
      where: { propertyUnitId, status: { not: 'Cancelled' } },
      orderBy: { date: 'desc' }
    });

    if (newStatusName === 'Available') {
      // If returning to Available, cancel the latest active booking and any associated deal
      if (latestBooking) {
        await prisma.booking.update({
          where: { id: latestBooking.id },
          data: { status: 'Cancelled' }
        });

        const existingSale = await prisma.sale.findUnique({
          where: { bookingId: latestBooking.id }
        });
        if (existingSale) {
          await prisma.sale.update({
            where: { id: existingSale.id },
            data: { status: 'Cancelled' }
          });
        }
      }
    } else if (requiresCustomer && customerId) {
      let activeBookingId = latestBooking?.id;

      const isClosingStatus = newStatusName === 'Sudah Akad' || newStatusName === 'Cash/Lunas' || newStatusName === 'Sold' || newStatusName === 'Lunas';

      if (latestBooking) {
        await prisma.booking.update({
          where: { id: latestBooking.id },
          data: {
            customerId,
            agencyId: agencyId || null,
            ...(bookingFee !== undefined && bookingFee > 0 ? { bookingFee } : {}),
            status: isClosingStatus ? 'Confirmed' : latestBooking.status,
            paymentStatus: isClosingStatus ? 'Paid' : latestBooking.paymentStatus,
          }
        });
      } else {
        // No active booking exists (e.g. jumped straight from Available to Akad/Lunas)
        const newBooking = await prisma.booking.create({
          data: {
            customerId,
            agencyId: agencyId || null,
            projectId: unit.projectId,
            projectTitle: unit.projectTitle,
            propertyUnitId,
            unitNumber: unit.unitNumber,
            price: unit.price,
            bookingFee: bookingFee || 0,
            paymentStatus: isClosingStatus ? 'Paid' : 'Pending',
            status: isClosingStatus || dealData?.createDeal ? 'Confirmed' : 'Awaiting Payment'
          }
        });
        activeBookingId = newBooking.id;
      }

      // Check if we should create or update a Sales Deal
      const shouldCreateDeal = dealData?.createDeal || isClosingStatus;
      if (shouldCreateDeal && activeBookingId) {
        const paymentMethod = dealData?.paymentMethod || (newStatusName === 'Cash/Lunas' ? 'Cash' : 'Mortgage');
        const contractPrice = Number(dealData?.contractPrice) || unit.price;
        const dealStatus = dealData?.dealStatus || (isClosingStatus ? 'Completed' : 'In Progress');

        await SalesService.createOrUpdateSale({
          bookingId: activeBookingId,
          customerId,
          agencyId: agencyId || null,
          projectTitle: unit.projectTitle,
          unitNumber: unit.unitNumber,
          contractPrice,
          paymentMethod,
          status: dealStatus,
          notes: dealData?.notes || notes || null
        });
      }
    }

    revalidatePath(`/admin/projects/${unit.projectId}`);
    revalidatePath('/admin/sales');
    revalidatePath('/admin/bookings');
    revalidatePath('/admin/properties', 'layout');

    return { success: true, message: `Successfully updated status to ${newStatusName}` };

  } catch (error: any) {
    console.error('Error updating unit status:', error);
    return { success: false, message: error.message || 'Failed to update status' };
  }
}

import fs from 'fs/promises';
import path from 'path';

export async function updateConstructionProgressAction(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) {
      return { success: false, message: 'Unauthorized' };
    }
    const liveUser = await AuthService.getUserById(session.userId);
    const userPerms = liveUser?.role?.permissions || session.permissions || [];
    const roleName = liveUser?.role?.name || session.roleName || '';
    const canUpdateProgress = roleName === 'Super Admin' || userPerms.includes('manage_projects') || userPerms.includes('update_construction_progress');
    if (!canUpdateProgress) {
      return { success: false, message: 'Forbidden: Anda tidak memiliki izin untuk mengupdate progress konstruksi unit' };
    }

    const propertyUnitId = formData.get('propertyUnitId') as string;
    const progress = parseFloat(formData.get('progress') as string);
    const notes = (formData.get('notes') as string) || null;
    const files = formData.getAll('photos') as File[];

    if (isNaN(progress) || progress < 0 || progress > 100) {
      return { success: false, message: 'Invalid progress value' };
    }

    const unit = await prisma.propertyUnit.findUnique({
      where: { id: propertyUnitId },
      include: { project: true, phase: true }
    });

    if (!unit) {
      return { success: false, message: 'Property unit not found' };
    }

    const uploadedUrls: string[] = [];

    // Process file uploads
    if (files && files.length > 0) {
      const projectSlug = unit.project.slug;
      const phaseName = unit.phase?.name.replace(/[^a-zA-Z0-9]/g, '-') || 'default-phase';
      const unitNum = unit.unitNumber.replace(/[^a-zA-Z0-9]/g, '-');
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects', projectSlug, phaseName, unitNum);
      
      await fs.mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        if (file.size === 0) continue;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = path.join(uploadDir, filename);
        
        await fs.writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/projects/${projectSlug}/${phaseName}/${unitNum}/${filename}`);
      }
    }

    // Prepare transaction
    const operations = [
      prisma.unitConstructionUpdate.create({
        data: {
          propertyUnitId,
          progress,
          notes,
          photos: uploadedUrls
        }
      }),
      prisma.propertyUnit.update({
        where: { id: propertyUnitId },
        data: { constructionProgress: progress }
      })
    ];

    await prisma.$transaction(operations);

    revalidatePath(`/admin/projects/${unit.projectId}`);
    return { success: true, message: 'Construction progress updated successfully' };
  } catch (error: any) {
    console.error('Error updating construction progress:', error);
    return { success: false, message: error.message || 'Failed to update construction progress' };
  }
}

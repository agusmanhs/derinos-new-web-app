'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateUnitStatusFromSitePlan(
  propertyUnitId: string,
  newStatusId: string,
  newStatusName: string, // "Available", "Booking", "Sold", dll
  customerId?: string,
  agencyId?: string,
  bookingFee?: number,
  notes?: string
) {
  try {
    const unit = await prisma.propertyUnit.findUnique({
      where: { id: propertyUnitId },
      include: { project: true }
    });

    if (!unit) {
      return { success: false, message: 'Property unit not found' };
    }

    // Prepare transaction operations
    const operations: any[] = [];

    // 1. Update the property unit status
    operations.push(
      prisma.propertyUnit.update({
        where: { id: propertyUnitId },
        data: {
          statusId: newStatusId,
          customerId: customerId || null,
        }
      })
    );

    // 2. Logic based on status transition
    const requiresCustomer = newStatusName !== 'Available' && newStatusName !== 'Unmapped / Other';
    if (requiresCustomer && !customerId) {
      throw new Error(`Customer is required when changing status to ${newStatusName}`);
    }

    const latestBooking = await prisma.booking.findFirst({
      where: { propertyUnitId, status: { not: 'Cancelled' } },
      orderBy: { date: 'desc' }
    });

    if (newStatusName === 'Available') {
      // If returning to Available, cancel the latest active booking
      if (latestBooking) {
        operations.push(
          prisma.booking.update({
            where: { id: latestBooking.id },
            data: { status: 'Cancelled' }
          })
        );
      }
    } else if (requiresCustomer) {
      // For all active statuses, ensure we either update the existing booking or create a new one
      if (latestBooking) {
        operations.push(
          prisma.booking.update({
            where: { id: latestBooking.id },
            data: {
              customerId,
              agencyId: agencyId || null,
              ...(bookingFee ? { bookingFee } : {})
            }
          })
        );
      } else {
        // No active booking exists (e.g. jumped straight from Available to Lunas)
        operations.push(
          prisma.booking.create({
            data: {
              customerId,
              agencyId: agencyId || null,
              projectId: unit.projectId,
              projectTitle: unit.projectTitle,
              propertyUnitId,
              unitNumber: unit.unitNumber,
              price: unit.price,
              bookingFee: bookingFee || 0,
              paymentStatus: 'Pending',
              status: newStatusName === 'Sold' || newStatusName === 'Lunas' || newStatusName === 'Cash' ? 'Confirmed' : 'Awaiting Payment'
            }
          })
        );
      }
    }

    // Execute transaction
    await prisma.$transaction(operations);

    revalidatePath(`/admin/projects/${unit.projectId}`);
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

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return settings;
}

export async function updateSiteSettings(data: any) {
  try {
    const settings = await getSiteSettings();
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data
    });
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getMasterFacilities() {
  return prisma.masterFacility.findMany({ orderBy: { order: 'asc' } });
}

export async function upsertMasterFacility(data: any) {
  try {
    if (data.id) {
      await prisma.masterFacility.update({ where: { id: data.id }, data });
    } else {
      await prisma.masterFacility.create({ data });
    }
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteMasterFacility(id: string) {
  try {
    await prisma.masterFacility.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getMasterGallery() {
  return prisma.masterGallery.findMany({ orderBy: { order: 'asc' } });
}

export async function addGalleryImage(data: any) {
  try {
    await prisma.masterGallery.create({ data });
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const img = await prisma.masterGallery.findUnique({ where: { id } });
    if (img && img.imageUrl.startsWith('/uploads/')) {
      // Optional: Delete physical file
      const filePath = path.join(process.cwd(), 'public', img.imageUrl);
      await fs.unlink(filePath).catch(() => {});
    }
    await prisma.masterGallery.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function uploadImageAjaxAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, message: 'No file uploaded' };

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    
    return { success: true, url: `/uploads/gallery/${filename}` };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
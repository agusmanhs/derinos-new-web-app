'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'landingSettings.json');

const DEFAULT_SETTINGS = {
  heroTitle: "Temukan Hunian yang Tepat untuk Masa Depan Anda",
  heroSubtitle: "Hunian modern dengan lokasi strategis, lingkungan nyaman, dan fasilitas yang memudahkan kehidupan keluarga.",
  heroImage: "/mockups/hero_placeholder.jpg",
  heroBadgeText: "SOLUSI PROPERTI MASA DEPAN",
  trustBadge1: "Legalitas Jelas & SHM",
  trustBadge2: "Fasilitas Komplit",
  trustBadge3: "Lokasi Bebas Banjir",
  
  statsBadgeText: "TERPERCAYA & BERPENGALAMAN",
  yearsExperience: "15+",
  yearsExperienceLabel: "Tahun Pengalaman",
  yearsExperienceDesc: "Dedikasi melayani dan membangun hunian berkualitas tinggi sejak 2014",
  completedProjects: "24",
  completedProjectsLabel: "Proyek Selesai",
  completedProjectsDesc: "Cluster perumahan terpadu di kawasan strategis berkembang",
  unitsSold: "1.000+",
  unitsSoldLabel: "Unit Terjual",
  unitsSoldDesc: "Keluarga yang telah mempercayakan hunian impian mereka",
  customerSatisfaction: "95%",
  customerSatisfactionLabel: "Kepuasan Klien",
  customerSatisfactionDesc: "Testimoni positif terhadap kualitas bangunan & legalitas",

  introTitle: "Experience Modern Living",
  introDescription: "Derinos Group berkomitmen menciptakan lingkungan hunian yang asri, nyaman, dan bernilai investasi tinggi.",
  introImageMain: "/mockups/gallery_1.jpg",
  introImageSecondary: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop",

  contactEmail: "info@derinosgroup.com",
  contactPhone: "+62 812-9843-1122",
  contactAddress: "Jl. Boulevard Utama No. 88, Parahyangan, Bandung Barat",
};

export async function getSiteSettings() {
  let dbSettings: any = {};
  try {
    const rawDb = await prisma.siteSettings.findFirst();
    if (rawDb) {
      for (const [k, v] of Object.entries(rawDb)) {
        if (v !== null && v !== undefined && v !== '') {
          dbSettings[k] = v;
        }
      }
    }
  } catch (err) {
    console.warn('Prisma getSiteSettings fallback:', err);
  }

  let localSettings: any = {};
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    localSettings = JSON.parse(raw);
  } catch {
    // Local JSON doesn't exist yet
  }

  return {
    ...DEFAULT_SETTINGS,
    ...dbSettings,
    ...localSettings,
  };
}

export async function updateSiteSettings(data: any) {
  try {
    // 1. Sync supported fields to database if available
    try {
      const settings = await prisma.siteSettings.findFirst();
      if (settings) {
        const dbFields = [
          'heroTitle', 'heroSubtitle', 'heroImage', 'introTitle', 
          'introDescription', 'introImageMain', 'introImageSecondary', 
          'yearsExperience', 'completedProjects', 'contactEmail', 
          'contactPhone', 'contactAddress'
        ];
        const dbData: any = {};
        for (const k of dbFields) {
          if (data[k] !== undefined) dbData[k] = data[k];
        }
        await prisma.siteSettings.update({
          where: { id: settings.id },
          data: dbData
        });
      }
    } catch (e) {
      console.warn('Prisma updateSiteSettings warning:', e);
    }

    // 2. Persist all fields including extended stats and badges to data/landingSettings.json
    let currentSettings = {};
    try {
      const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
      currentSettings = JSON.parse(raw);
    } catch {}

    const merged = { ...currentSettings, ...data };
    await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf-8');

    revalidatePath('/');
    revalidatePath('/admin/landing/general');
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
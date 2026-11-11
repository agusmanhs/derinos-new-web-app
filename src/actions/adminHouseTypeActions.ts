'use server';

import prisma from '@/lib/prisma';
import { assertActionPermission } from '@/lib/authGuard';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export interface HouseTypeInput {
  id?: string;
  name: string;
  buildingSize: number;
  landSize: number;
  bedrooms: number;
  bathrooms: number;
  carports: number;
  price: number;
  description?: string;
  image?: string;
}

export async function saveHouseTypeAction(
  projectId: string,
  data: HouseTypeInput,
  projectSlug: string
) {
  try {
    const auth = await assertActionPermission(['manage_projects']);
    if (!auth.authorized) {
      return { success: false, message: auth.message };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    const currentHouseTypes = (project.houseTypes as any[]) || [];
    const houseTypeId = data.id || `type-${Date.now()}`;

    const normalized: any = {
      id: houseTypeId,
      name: data.name.trim(),
      buildingSize: Number(data.buildingSize) || 0,
      landSize: Number(data.landSize) || 0,
      bedrooms: Number(data.bedrooms) || 0,
      bathrooms: Number(data.bathrooms) || 0,
      carports: Number(data.carports) || 0,
      price: Number(data.price) || 0,
      description: data.description || '',
      image: data.image || '',
      // Backwards compatible fields with HouseType interface
      size: {
        building: Number(data.buildingSize) || 0,
        land: Number(data.landSize) || 0,
      },
      specs: {
        bedrooms: Number(data.bedrooms) || 0,
        bathrooms: Number(data.bathrooms) || 0,
        carports: Number(data.carports) || 0,
      },
      startingPrice: Number(data.price) ? `Rp ${Number(data.price).toLocaleString('id-ID')}` : '0',
    };

    const existingIndex = currentHouseTypes.findIndex((ht: any) => ht.id === houseTypeId);
    let updatedList: any[];

    if (existingIndex >= 0) {
      updatedList = [...currentHouseTypes];
      updatedList[existingIndex] = normalized;
    } else {
      updatedList = [...currentHouseTypes, normalized];
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { houseTypes: updatedList },
    });

    revalidatePath(`/admin/projects/${projectSlug}`);
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/admin/projects');
    revalidatePath(`/projects/${projectSlug}`);
    revalidatePath('/');

    return { success: true, message: 'Tipe rumah berhasil disimpan', houseType: normalized };
  } catch (error: any) {
    console.error('Error in saveHouseTypeAction:', error);
    return { success: false, message: error.message || 'Gagal menyimpan tipe rumah' };
  }
}

export async function deleteHouseTypeAction(
  projectId: string,
  houseTypeId: string,
  projectSlug: string
) {
  try {
    const auth = await assertActionPermission(['manage_projects']);
    if (!auth.authorized) {
      return { success: false, message: auth.message };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    const currentHouseTypes = (project.houseTypes as any[]) || [];
    const updatedList = currentHouseTypes.filter((ht: any) => ht.id !== houseTypeId);

    await prisma.project.update({
      where: { id: projectId },
      data: { houseTypes: updatedList },
    });

    revalidatePath(`/admin/projects/${projectSlug}`);
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/admin/projects');
    revalidatePath(`/projects/${projectSlug}`);
    revalidatePath('/');

    return { success: true, message: 'Tipe rumah berhasil dihapus' };
  } catch (error: any) {
    console.error('Error in deleteHouseTypeAction:', error);
    return { success: false, message: error.message || 'Gagal menghapus tipe rumah' };
  }
}

export async function seedInitialHouseTypesFromUnitsAction(
  projectId: string,
  projectSlug: string
) {
  try {
    const auth = await assertActionPermission(['manage_projects']);
    if (!auth.authorized) {
      return { success: false, message: auth.message };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    // Find distinct units in this project
    const distinctUnits = await prisma.propertyUnit.findMany({
      where: { projectId, archived: false },
      select: {
        typeName: true,
        landSize: true,
        buildingSize: true,
        bedrooms: true,
        bathrooms: true,
        carports: true,
        price: true,
      },
    });

    const typeMap = new Map<string, any>();

    for (const u of distinctUnits) {
      const trimmed = u.typeName.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();

      if (!typeMap.has(key)) {
        typeMap.set(key, {
          id: `type-${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: trimmed,
          buildingSize: u.buildingSize || 0,
          landSize: u.landSize || 0,
          bedrooms: u.bedrooms || 0,
          bathrooms: u.bathrooms || 0,
          carports: u.carports || 0,
          price: u.price || 0,
          description: `Spesifikasi standar ${trimmed}`,
          size: {
            building: u.buildingSize || 0,
            land: u.landSize || 0,
          },
          specs: {
            bedrooms: u.bedrooms || 0,
            bathrooms: u.bathrooms || 0,
            carports: u.carports || 0,
          },
          startingPrice: u.price ? `Rp ${u.price.toLocaleString('id-ID')}` : '0',
        });
      } else {
        // If current stored has 0s and this one has real values, update
        const existing = typeMap.get(key);
        if (existing.buildingSize === 0 && u.buildingSize > 0) existing.buildingSize = u.buildingSize;
        if (existing.landSize === 0 && u.landSize > 0) existing.landSize = u.landSize;
        if (existing.price === 0 && u.price > 0) existing.price = u.price;
        if (existing.bedrooms === 0 && u.bedrooms > 0) existing.bedrooms = u.bedrooms;
      }
    }

    const seededList = Array.from(typeMap.values());

    if (seededList.length === 0) {
      return { success: false, message: 'Tidak ditemukan data tipe unit pada proyek ini.' };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { houseTypes: seededList },
    });

    revalidatePath(`/admin/projects/${projectSlug}`);
    revalidatePath(`/admin/projects/${projectId}`);

    return {
      success: true,
      message: `Berhasil mengekstrak ${seededList.length} tipe rumah dari kavling eksisting`,
      count: seededList.length,
    };
  } catch (error: any) {
    console.error('Error in seedInitialHouseTypesFromUnitsAction:', error);
    return { success: false, message: error.message || 'Gagal mengekstrak tipe rumah' };
  }
}

export async function uploadHouseTypeImageAction(formData: FormData) {
  try {
    const auth = await assertActionPermission(['manage_projects']);
    if (!auth.authorized) {
      return { success: false, message: auth.message };
    }

    const file = formData.get('file') as File;
    if (!file || !file.size) {
      return { success: false, message: 'Berkas gambar tidak ditemukan' };
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, message: 'Berkas harus berupa file gambar (JPG, PNG, WebP)' };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, message: 'Ukuran gambar maksimal 10MB' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${Date.now()}-${cleanBase}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'house-types');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    return { 
      success: true, 
      url: `/uploads/house-types/${filename}`,
      message: 'Foto tipe rumah berhasil diunggah'
    };
  } catch (err: any) {
    console.error('Error in uploadHouseTypeImageAction:', err);
    return { success: false, message: err.message || 'Gagal mengunggah foto tipe rumah' };
  }
}



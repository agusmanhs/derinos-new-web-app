'use client';
import React, { useState, useTransition } from 'react';
import { updateSiteSettings, uploadImageAjaxAction } from '@/actions/adminLandingActions';
import { Button } from '@/components/ui/Button/Button';
import styles from './GeneralSettings.module.css';

interface GeneralSettingsClientProps {
  initialSettings: any;
}

export const GeneralSettingsClient: React.FC<GeneralSettingsClientProps> = ({ initialSettings }) => {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [heroImage, setHeroImage] = useState(initialSettings?.heroImage || '/mockups/hero_placeholder.jpg');
  const [introImageMain, setIntroImageMain] = useState(initialSettings?.introImageMain || '/mockups/gallery_1.jpg');
  const [introImageSecondary, setIntroImageSecondary] = useState(
    initialSettings?.introImageSecondary || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop'
  );
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'introImageMain' | 'introImageSecondary') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploadingField(field);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadImageAjaxAction(formData);
    setUploadingField(null);

    if (res.success && res.url) {
      if (field === 'heroImage') setHeroImage(res.url);
      if (field === 'introImageMain') setIntroImageMain(res.url);
      if (field === 'introImageSecondary') setIntroImageSecondary(res.url);
    } else {
      alert('Gagal mengupload gambar: ' + (res.message || 'Terjadi kesalahan'));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      // Hero Banner
      heroTitle: formData.get('heroTitle'),
      heroSubtitle: formData.get('heroSubtitle'),
      heroBadgeText: formData.get('heroBadgeText'),
      heroImage,
      trustBadge1: formData.get('trustBadge1'),
      trustBadge2: formData.get('trustBadge2'),
      trustBadge3: formData.get('trustBadge3'),

      // Statistics Counter Strip
      statsBadgeText: formData.get('statsBadgeText'),
      yearsExperience: formData.get('yearsExperience'),
      yearsExperienceLabel: formData.get('yearsExperienceLabel'),
      yearsExperienceDesc: formData.get('yearsExperienceDesc'),
      completedProjects: formData.get('completedProjects'),
      completedProjectsLabel: formData.get('completedProjectsLabel'),
      completedProjectsDesc: formData.get('completedProjectsDesc'),
      unitsSold: formData.get('unitsSold'),
      unitsSoldLabel: formData.get('unitsSoldLabel'),
      unitsSoldDesc: formData.get('unitsSoldDesc'),
      customerSatisfaction: formData.get('customerSatisfaction'),
      customerSatisfactionLabel: formData.get('customerSatisfactionLabel'),
      customerSatisfactionDesc: formData.get('customerSatisfactionDesc'),

      // Intro Section
      introTitle: formData.get('introTitle'),
      introDescription: formData.get('introDescription'),
      introImageMain,
      introImageSecondary,

      // Contact Info
      contactEmail: formData.get('contactEmail'),
      contactPhone: formData.get('contactPhone'),
      contactAddress: formData.get('contactAddress'),
    };

    startTransition(async () => {
      const res = await updateSiteSettings(data);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Semua pengaturan berhasil disimpan dan landing page telah diperbarui!' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStatusMessage({ type: 'error', text: 'Gagal menyimpan pengaturan: ' + res.message });
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pengaturan Umum Landing Page</h1>
        <p className={styles.subtitle}>
          Kelola konten visual dan teks untuk Hero Banner, 4 Indikator Statistik Counter, Intro Section, dan Kontak resmi.
        </p>
      </div>

      {statusMessage && (
        <div className={`${styles.statusBar} ${statusMessage.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
          <span>{statusMessage.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ========================================================
            1. HERO BANNER
        ======================================================== */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrap}>
              <h2 className={styles.cardTitle}>Hero Banner</h2>
              <p className={styles.cardDesc}>Bagian paling atas landing page dengan gambar latar full screen dan call-to-action.</p>
            </div>
            <span className={styles.sectionBadge}>HERO SECTION</span>
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Top Pill Badge
                <span className={styles.helperText}>(Teks pill kecil di atas judul)</span>
              </label>
              <input
                type="text"
                name="heroBadgeText"
                className={styles.input}
                defaultValue={initialSettings?.heroBadgeText || 'SOLUSI PROPERTI MASA DEPAN'}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Background Image
                <span className={styles.helperText}>(URL gambar latar atau upload file baru)</span>
              </label>
              <div className={styles.imageRow}>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className={styles.input}
                  placeholder="https://..."
                />
                <input
                  type="file"
                  id="heroUploadInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'heroImage')}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('heroUploadInput')?.click()}
                  disabled={uploadingField === 'heroImage'}
                >
                  {uploadingField === 'heroImage' ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>

          {heroImage && (
            <div className={styles.previewThumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="Hero Preview" />
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Judul Utama Hero (H1)
              <span className={styles.helperText}>(Mendukung tag &lt;br/&gt; untuk baris baru)</span>
            </label>
            <textarea
              name="heroTitle"
              className={styles.textarea}
              rows={2}
              defaultValue={initialSettings?.heroTitle || 'Temukan Hunian yang Tepat untuk Masa Depan Anda'}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Subjudul / Paragraf Hero</label>
            <textarea
              name="heroSubtitle"
              className={styles.textarea}
              rows={3}
              defaultValue={initialSettings?.heroSubtitle || 'Hunian modern dengan lokasi strategis, lingkungan nyaman, dan fasilitas yang memudahkan kehidupan keluarga.'}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Trust Badges (3 Poin Keunggulan Utama di Bawah Tombol)
            </label>
            <div className={styles.grid3}>
              <input
                type="text"
                name="trustBadge1"
                className={styles.input}
                defaultValue={initialSettings?.trustBadge1 || 'Legalitas Jelas & SHM'}
                placeholder="Badge 1 (e.g. Legalitas Jelas & SHM)"
              />
              <input
                type="text"
                name="trustBadge2"
                className={styles.input}
                defaultValue={initialSettings?.trustBadge2 || 'Fasilitas Komplit'}
                placeholder="Badge 2 (e.g. Fasilitas Komplit)"
              />
              <input
                type="text"
                name="trustBadge3"
                className={styles.input}
                defaultValue={initialSettings?.trustBadge3 || 'Lokasi Bebas Banjir'}
                placeholder="Badge 3 (e.g. Lokasi Bebas Banjir)"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            2. STATISTIC COUNTER (4 METRIK UTAMA)
        ======================================================== */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrap}>
              <h2 className={styles.cardTitle}>Statistik Counter (4 Indikator Pencapaian)</h2>
              <p className={styles.cardDesc}>
                Data pencapaian kredibilitas yang tampil di bawah Hero Banner. Menggantikan seluruh data mockup statis.
              </p>
            </div>
            <span className={styles.sectionBadge}>STATS STRIP</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Top Badge Counter Strip
              <span className={styles.helperText}>(Label lencana di atas angka counter)</span>
            </label>
            <input
              type="text"
              name="statsBadgeText"
              className={styles.input}
              defaultValue={initialSettings?.statsBadgeText || 'TERPERCAYA & BERPENGALAMAN'}
              required
            />
          </div>

          <div className={styles.statsGrid}>
            {/* Stat 1 */}
            <div className={styles.statItemCard}>
              <div className={styles.statItemHeader}>
                <span>Statistik 1: Pengalaman</span>
                <span className={styles.statItemNumber}>1</span>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Angka / Nilai</label>
                <input
                  type="text"
                  name="yearsExperience"
                  className={styles.input}
                  defaultValue={initialSettings?.yearsExperience || '15+'}
                  placeholder="e.g. 15+"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Judul Indikator</label>
                <input
                  type="text"
                  name="yearsExperienceLabel"
                  className={styles.input}
                  defaultValue={initialSettings?.yearsExperienceLabel || 'Tahun Pengalaman'}
                  placeholder="e.g. Tahun Pengalaman"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Keterangan Singkat</label>
                <textarea
                  name="yearsExperienceDesc"
                  className={styles.textarea}
                  rows={2}
                  defaultValue={initialSettings?.yearsExperienceDesc || 'Dedikasi melayani dan membangun hunian berkualitas tinggi sejak 2014'}
                  required
                />
              </div>
            </div>

            {/* Stat 2 */}
            <div className={styles.statItemCard}>
              <div className={styles.statItemHeader}>
                <span>Statistik 2: Proyek Portofolio</span>
                <span className={styles.statItemNumber}>2</span>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Angka / Nilai</label>
                <input
                  type="text"
                  name="completedProjects"
                  className={styles.input}
                  defaultValue={initialSettings?.completedProjects || '24'}
                  placeholder="e.g. 24"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Judul Indikator</label>
                <input
                  type="text"
                  name="completedProjectsLabel"
                  className={styles.input}
                  defaultValue={initialSettings?.completedProjectsLabel || 'Proyek Selesai'}
                  placeholder="e.g. Proyek Selesai"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Keterangan Singkat</label>
                <textarea
                  name="completedProjectsDesc"
                  className={styles.textarea}
                  rows={2}
                  defaultValue={initialSettings?.completedProjectsDesc || 'Cluster perumahan terpadu di kawasan strategis berkembang'}
                  required
                />
              </div>
            </div>

            {/* Stat 3 */}
            <div className={styles.statItemCard}>
              <div className={styles.statItemHeader}>
                <span>Statistik 3: Unit Terjual</span>
                <span className={styles.statItemNumber}>3</span>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Angka / Nilai</label>
                <input
                  type="text"
                  name="unitsSold"
                  className={styles.input}
                  defaultValue={initialSettings?.unitsSold || '1.000+'}
                  placeholder="e.g. 1.000+"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Judul Indikator</label>
                <input
                  type="text"
                  name="unitsSoldLabel"
                  className={styles.input}
                  defaultValue={initialSettings?.unitsSoldLabel || 'Unit Terjual'}
                  placeholder="e.g. Unit Terjual"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Keterangan Singkat</label>
                <textarea
                  name="unitsSoldDesc"
                  className={styles.textarea}
                  rows={2}
                  defaultValue={initialSettings?.unitsSoldDesc || 'Keluarga yang telah mempercayakan hunian impian mereka'}
                  required
                />
              </div>
            </div>

            {/* Stat 4 */}
            <div className={styles.statItemCard}>
              <div className={styles.statItemHeader}>
                <span>Statistik 4: Kepuasan Konsumen</span>
                <span className={styles.statItemNumber}>4</span>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Angka / Nilai</label>
                <input
                  type="text"
                  name="customerSatisfaction"
                  className={styles.input}
                  defaultValue={initialSettings?.customerSatisfaction || '95%'}
                  placeholder="e.g. 95%"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Judul Indikator</label>
                <input
                  type="text"
                  name="customerSatisfactionLabel"
                  className={styles.input}
                  defaultValue={initialSettings?.customerSatisfactionLabel || 'Kepuasan Klien'}
                  placeholder="e.g. Kepuasan Klien"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Keterangan Singkat</label>
                <textarea
                  name="customerSatisfactionDesc"
                  className={styles.textarea}
                  rows={2}
                  defaultValue={initialSettings?.customerSatisfactionDesc || 'Testimoni positif terhadap kualitas bangunan & legalitas'}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. INTRO SECTION ("EXPERIENCE MODERN LIVING")
        ======================================================== */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrap}>
              <h2 className={styles.cardTitle}>Section Intro ("Experience Modern Living")</h2>
              <p className={styles.cardDesc}>Narasi visi dan perkenalan portofolio Derinos Group.</p>
            </div>
            <span className={styles.sectionBadge}>INTRO</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Judul Intro</label>
            <input
              type="text"
              name="introTitle"
              className={styles.input}
              defaultValue={initialSettings?.introTitle || 'Experience Modern Living'}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Deskripsi Lengkap Intro</label>
            <textarea
              name="introDescription"
              className={styles.textarea}
              rows={4}
              defaultValue={initialSettings?.introDescription || 'Derinos Group berkomitmen menciptakan lingkungan hunian yang asri, nyaman, dan bernilai investasi tinggi.'}
              required
            />
          </div>

          <div className={styles.grid2}>
            {/* Main Image */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Gambar Utama Arsitektur</label>
              <div className={styles.imageRow}>
                <input
                  type="text"
                  value={introImageMain}
                  onChange={(e) => setIntroImageMain(e.target.value)}
                  className={styles.input}
                />
                <input
                  type="file"
                  id="introMainUpload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'introImageMain')}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('introMainUpload')?.click()}
                  disabled={uploadingField === 'introImageMain'}
                >
                  {uploadingField === 'introImageMain' ? '...' : 'Upload'}
                </Button>
              </div>
              {introImageMain && (
                <div className={styles.previewThumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={introImageMain} alt="Intro Main Preview" />
                </div>
              )}
            </div>

            {/* Secondary Image */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Gambar Sekunder Interior</label>
              <div className={styles.imageRow}>
                <input
                  type="text"
                  value={introImageSecondary}
                  onChange={(e) => setIntroImageSecondary(e.target.value)}
                  className={styles.input}
                />
                <input
                  type="file"
                  id="introSecUpload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'introImageSecondary')}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('introSecUpload')?.click()}
                  disabled={uploadingField === 'introImageSecondary'}
                >
                  {uploadingField === 'introImageSecondary' ? '...' : 'Upload'}
                </Button>
              </div>
              {introImageSecondary && (
                <div className={styles.previewThumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={introImageSecondary} alt="Intro Secondary Preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            4. INFORMASI KONTAK
        ======================================================== */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrap}>
              <h2 className={styles.cardTitle}>Informasi Kontak & Alamat Kantor</h2>
              <p className={styles.cardDesc}>Data kontak yang ditampilkan pada footer dan formulir konsultasi.</p>
            </div>
            <span className={styles.sectionBadge}>KONTAK</span>
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Email Resmi</label>
              <input
                type="email"
                name="contactEmail"
                className={styles.input}
                defaultValue={initialSettings?.contactEmail || 'info@derinosgroup.com'}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                name="contactPhone"
                className={styles.input}
                defaultValue={initialSettings?.contactPhone || '+62 812-9843-1122'}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Alamat Kantor Pemasaran / Gallery</label>
            <input
              type="text"
              name="contactAddress"
              className={styles.input}
              defaultValue={initialSettings?.contactAddress || 'Jl. Boulevard Utama No. 88, Parahyangan, Bandung Barat'}
            />
          </div>
        </div>

        {/* ========================================================
            SUBMIT ACTION BAR
        ======================================================== */}
        <div className={styles.stickyFooter}>
          <span style={{ fontSize: '14px', color: '#64748B' }}>
            Perubahan akan langsung tercermin secara instan di landing page publik.
          </span>
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? 'Menyimpan Pengaturan...' : 'Simpan Semua Pengaturan'}
          </Button>
        </div>
      </form>
    </div>
  );
};
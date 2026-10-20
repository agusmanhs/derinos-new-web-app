'use client';

import React, { useState, useMemo } from 'react';
import styles from './KprCalculatorBar.module.css';

const PRICE_PRESETS = [
  { label: '450 Jt', value: 450000000 },
  { label: '650 Jt (Populer)', value: 650000000 },
  { label: '950 Jt', value: 950000000 },
  { label: '1.5 M', value: 1500000000 },
];

const TENOR_OPTIONS = [
  { label: '10 Tahun (120 bln)', value: 10 },
  { label: '15 Tahun (180 bln)', value: 15 },
  { label: '20 Tahun (240 bln)', value: 20 },
  { label: '25 Tahun (300 bln)', value: 25 },
];

const RATE_OPTIONS = [
  { label: '3.75% Fixed (Promo BTN / Mandiri)', value: 3.75 },
  { label: '3.99% Fixed 2 Thn (BCA Prioritas)', value: 3.99 },
  { label: '4.25% Fixed 3 Thn (Bank Mandiri)', value: 4.25 },
  { label: '4.50% Eq. (BTN Syariah)', value: 4.50 },
];

export const KprCalculatorBar: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(650000000);
  const [dpPercent, setDpPercent] = useState<number>(10);
  const [tenorYears, setTenorYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(3.75);

  // Computed values
  const { dpAmount, loanPrincipal, monthlyInstallment } = useMemo(() => {
    const dp = Math.round(propertyPrice * (dpPercent / 100));
    const principal = Math.max(0, propertyPrice - dp);
    const monthlyRate = (interestRate / 100) / 12;
    const totalMonths = tenorYears * 12;

    let installment = 0;
    if (principal > 0 && totalMonths > 0) {
      if (monthlyRate === 0) {
        installment = Math.round(principal / totalMonths);
      } else {
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        installment = Math.round((principal * monthlyRate * factor) / (factor - 1));
      }
    }

    return {
      dpAmount: dp,
      loanPrincipal: principal,
      monthlyInstallment: installment,
    };
  }, [propertyPrice, dpPercent, tenorYears, interestRate]);

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  // WhatsApp consultation link
  const waMessage = `Halo Derinos Group, saya tertarik dengan rumah seharga ${formatRupiah(propertyPrice)}. Dari simulasi website, estimasi cicilan Rp ${monthlyInstallment.toLocaleString('id-ID')}/bln (DP ${dpPercent}%, Tenor ${tenorYears} Thn). Mohon info ketersediaan unit dan promo perbankannya. Terima kasih.`;
  const waUrl = `https://wa.me/6281298431122?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Card Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.iconCircle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                <line x1="8" y1="6" x2="16" y2="6"></line>
                <line x1="16" y1="14" x2="16" y2="18"></line>
                <path d="M16 10h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M8 10h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M8 14h.01"></path>
                <path d="M12 18h.01"></path>
                <path d="M8 18h.01"></path>
              </svg>
            </div>
            <div className={styles.titleTextGroup}>
              <h3 className={styles.title}>Simulasi Cepat Angsuran KPR</h3>
              <p className={styles.subtitle}>
                Hitung estimasi cicilan bulanan rumah idaman Anda bersama bank rekanan resmi Derinos Group
              </p>
            </div>
          </div>

          <div className={styles.promoBadge}>
            <span className={styles.promoDot}></span>
            <span>Promo Bunga KPR 3.75% Fixed</span>
          </div>
        </div>

        {/* Card Body */}
        <div className={styles.bodyGrid}>
          {/* Controls Left Column */}
          <div className={styles.controlsPane}>
            <div className={styles.inputGrid}>
              {/* 1. Harga Properti */}
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>
                  <span>Harga Properti</span>
                  <span className={styles.controlSubHint}>{formatRupiah(propertyPrice)}</span>
                </label>
                <select 
                  className={styles.selectInput}
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                >
                  <option value={450000000}>Rp 450.000.000 (Tipe Minimalist)</option>
                  <option value={650000000}>Rp 650.000.000 (Tipe 36/72 Bougenville)</option>
                  <option value={750000000}>Rp 750.000.000 (Tipe 45/84 Deluxe)</option>
                  <option value={980000000}>Rp 980.000.000 (Tipe 45/90 Comfort)</option>
                  <option value={1450000000}>Rp 1.450.000.000 (Tipe 60/120 Signature)</option>
                  <option value={1850000000}>Rp 1.850.000.000 (Villa Luxury)</option>
                </select>
                <div className={styles.presetsRow}>
                  {PRICE_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`${styles.presetBtn} ${propertyPrice === p.value ? styles.presetBtnActive : ''}`}
                      onClick={() => setPropertyPrice(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Uang Muka (DP) */}
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>
                  <span>Uang Muka (DP)</span>
                  <span className={styles.controlSubHint}>Nominal: {formatRupiah(dpAmount)}</span>
                </label>
                <select 
                  className={styles.selectInput}
                  value={dpPercent}
                  onChange={(e) => setDpPercent(Number(e.target.value))}
                >
                  <option value={0}>0% (Promo DP 0% Khusus BUMN/PNS)</option>
                  <option value={5}>5% (DP Ringan Rp {(propertyPrice * 0.05).toLocaleString('id-ID')})</option>
                  <option value={10}>10% (Standar Rp {(propertyPrice * 0.1).toLocaleString('id-ID')})</option>
                  <option value={20}>20% (Cicilan Lebih Rendah)</option>
                </select>
                <div className={styles.presetsRow}>
                  {[0, 5, 10, 20].map((dp) => (
                    <button
                      key={dp}
                      type="button"
                      className={`${styles.presetBtn} ${dpPercent === dp ? styles.presetBtnActive : ''}`}
                      onClick={() => setDpPercent(dp)}
                    >
                      {dp === 0 ? 'DP 0%' : `${dp}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Jangka Waktu (Tenor) */}
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>
                  <span>Jangka Waktu KPR</span>
                  <span className={styles.controlSubHint}>{tenorYears * 12} Bulan</span>
                </label>
                <select 
                  className={styles.selectInput}
                  value={tenorYears}
                  onChange={(e) => setTenorYears(Number(e.target.value))}
                >
                  {TENOR_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Suku Bunga KPR */}
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>
                  <span>Suku Bunga Bank</span>
                  <span className={styles.controlSubHint}>{interestRate}% p.a.</span>
                </label>
                <select 
                  className={styles.selectInput}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                >
                  {RATE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Result Right Column */}
          <div className={styles.resultPane}>
            <div className={styles.resultBox}>
              <div className={styles.resultLabel}>Estimasi Angsuran Bulanan</div>
              <div className={styles.installmentValueRow}>
                <span className={styles.installmentAmount}>
                  Rp {monthlyInstallment.toLocaleString('id-ID')}
                </span>
                <span className={styles.installmentPeriod}>/ bulan</span>
              </div>
              <div className={styles.resultBreakdown}>
                Plafond KPR: <strong>{formatRupiah(loanPrincipal)}</strong> • Tenor: <strong>{tenorYears} Tahun</strong> • Suku Bunga: <strong>{interestRate}% Fixed</strong>
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>Konsultasi KPR via WhatsApp</span>
            </a>

            <div className={styles.bankStrip}>
              <span>Bank Rekanan:</span>
              <span className={styles.bankNames}>Bank BTN • Mandiri • BCA • BSI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PropertyService as RealPropertyService } from '@/services/propertyService';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await RealPropertyService.getPropertyById(id);

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <main className={styles.main}>
      {/* 1. Header & Quick Specs (Sticky or Top) */}
      <div className={styles.headerArea}>
        <div className={styles.container}>
          <div className={styles.headerSplit}>
            <div>
              <div className={styles.badges}>
                <Badge variant={property.status === 'Available' ? 'success' : property.status === 'Sold' ? 'neutral' : 'warning'}>
                  {property.status}
                </Badge>
                <Badge variant="neutral">{property.projectTitle}</Badge>
              </div>
              <h1 className={styles.title}>Unit {property.unitNumber}</h1>
              <p className={styles.subtitle}>{property.typeName}</p>
            </div>
            <div className={styles.priceArea}>
              <span className={styles.priceLabel}>Price</span>
              <div className={styles.price}>{formatPrice(property.price)}</div>
            </div>
          </div>

          <div className={styles.quickSpecs}>
            <div className={styles.specBox}>
              <span className={styles.specLabel}>Bedrooms</span>
              <span className={styles.specValue}>{property.bedrooms}</span>
            </div>
            <div className={styles.specBox}>
              <span className={styles.specLabel}>Bathrooms</span>
              <span className={styles.specValue}>{property.bathrooms}</span>
            </div>
            <div className={styles.specBox}>
              <span className={styles.specLabel}>Carports</span>
              <span className={styles.specValue}>{property.carports}</span>
            </div>
            <div className={styles.specBox}>
              <span className={styles.specLabel}>Building Size</span>
              <span className={styles.specValue}>{property.buildingSize} m²</span>
            </div>
            <div className={styles.specBox}>
              <span className={styles.specLabel}>Land Size</span>
              <span className={styles.specValue}>{property.landSize} m²</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Main Content (Left) */}
          <div className={styles.mainContent}>
            {/* Gallery */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Gallery</h2>
              <div className={styles.gallery}>
                {property.gallery.map((img, idx) => (
                  <div key={idx} className={`${styles.galleryItem} ${idx === 0 ? styles.galleryMain : ''}`}>
                    <Image src={img} alt={`Gallery ${idx}`} fill className={styles.imageCover} />
                  </div>
                ))}
              </div>
            </section>

            {/* Floor Plan */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Floor Plan</h2>
              <div className={styles.floorPlanWrapper}>
                <Image src={property.floorPlanImage} alt="Floor Plan" fill className={styles.imageCover} />
              </div>
            </section>

            {/* Facilities */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Facilities</h2>
              <div className={styles.facilitiesGrid}>
                {property.facilities.map(facility => (
                  <div key={facility.id} className={styles.facilityCard}>
                    <div className={styles.facilityIcon}>
                      {facility.iconImage && <Image src={facility.iconImage} alt={facility.name} fill className={styles.imageCover} />}
                    </div>
                    <h4>{facility.name}</h4>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar CTA (Right) */}
          <div className={styles.sidebar}>
            <div className={styles.stickyCTA}>
              <h3>Interested in Unit {property.unitNumber}?</h3>
              <p>Get in touch with our sales team to schedule a viewing or secure this unit.</p>
              
              <div className={styles.actionButtons}>
                <Button variant="primary" fullWidth className={styles.btn}>Schedule a Visit</Button>
                <Button variant="outlined" fullWidth className={styles.btn}>Contact Sales</Button>
              </div>

              <div className={styles.sidebarContact}>
                <span>Need help? Call us at</span>
                <strong>+1 234 567 890</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

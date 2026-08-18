import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyService } from '@/services/propertyService';
import { PropertyFilters } from '@/components/public/Properties/PropertyFilters';
import { Pagination } from '@/components/public/Properties/Pagination';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import styles from './page.module.css';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const search = params.search;
  const project = params.project;
  const type = params.type;
  const status = params.status;
  const sort = params.sort;
  const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined;
  const bedrooms = params.bedrooms ? parseInt(params.bedrooms) : undefined;
  
  const page = params.page ? parseInt(params.page) : 1;
  const limit = 9;

  const { data: properties, totalPages } = await PropertyService.getProperties(
    { search, project, type, status, minPrice, maxPrice, bedrooms },
    sort,
    page,
    limit
  );

  const filterOptions = await PropertyService.getFilterOptions();

  // Helper for formatting currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Available Properties</h1>
        <p className={styles.subtitle}>Find your perfect home across our exclusive developments.</p>
      </div>

      <div className={styles.container}>
        <PropertyFilters 
          projects={filterOptions.projects} 
          types={filterOptions.types} 
          statuses={filterOptions.statuses} 
        />

        {properties.length === 0 ? (
          <EmptyState 
            title="No properties found" 
            description="We couldn't find any properties matching your current filters. Try adjusting your search criteria." 
          />
        ) : (
          <>
            <div className={styles.grid}>
              {properties.map((property) => (
                <Link href={`/properties/${property.id}`} key={property.id} className={styles.cardLink}>
                  <Card className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <div className={styles.badges}>
                        <Badge variant={property.status === 'Available' ? 'success' : property.status === 'Sold' ? 'neutral' : 'warning'}>
                          {property.status}
                        </Badge>
                      </div>
                      <Image 
                        src={property.gallery[0] || ''} 
                        alt={property.unitNumber} 
                        fill 
                        className={styles.image} 
                      />
                    </div>
                    <Card.Body className={styles.cardBody}>
                      <div className={styles.cardHeader}>
                        <div>
                          <h3 className={styles.unitNumber}>Unit {property.unitNumber}</h3>
                          <p className={styles.projectName}>{property.projectTitle} • {property.typeName}</p>
                        </div>
                        <div className={styles.price}>{formatPrice(property.price)}</div>
                      </div>
                      
                      <div className={styles.specs}>
                        <div className={styles.specItem}>
                          <span className={styles.specLabel}>Beds</span>
                          <span className={styles.specValue}>{property.bedrooms}</span>
                        </div>
                        <div className={styles.specItem}>
                          <span className={styles.specLabel}>Baths</span>
                          <span className={styles.specValue}>{property.bathrooms}</span>
                        </div>
                        <div className={styles.specItem}>
                          <span className={styles.specLabel}>LB</span>
                          <span className={styles.specValue}>{property.buildingSize}m²</span>
                        </div>
                        <div className={styles.specItem}>
                          <span className={styles.specLabel}>LT</span>
                          <span className={styles.specValue}>{property.landSize}m²</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              ))}
            </div>
            
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </main>
  );
}

import React from 'react';
import { notFound } from 'next/navigation';
import { ProjectService } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';

export default async function ViewProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await ProjectService.getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader 
        title={project.title} 
        description={`Status: ${project.status} | Location: ${project.location}`}
        action={
          <Link href={`/admin/projects/${project.id}/edit`}>
            <Button variant="primary">Edit Project</Button>
          </Link>
        }
      />
      
      <div style={{ background: 'white', padding: '24px', border: '1px solid #e5e5e5' }}>
        <h3>Details</h3>
        <p><strong>Starting Price:</strong> {project.startingPrice}</p>
        <p><strong>Total Units:</strong> {project.totalUnits}</p>
        <p><strong>Area:</strong> {project.totalArea}</p>
        <p><strong>Description:</strong> {project.description}</p>
        
        <h3 style={{ marginTop: '24px' }}>SEO</h3>
        <p><strong>Meta Title:</strong> {project.metaTitle}</p>
        <p><strong>Meta Description:</strong> {project.metaDescription}</p>
      </div>
    </div>
  );
}

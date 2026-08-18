'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { saveConstructionProgressAction } from '@/actions/adminConstructionActions';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';

interface Props {
  project: Project;
}

const initialState = {
  success: true,
  message: '',
};

export const ConstructionForm: React.FC<Props> = ({ project }) => {
  const [state, formAction, isPending] = useActionState(saveConstructionProgressAction, initialState);

  return (
    <form action={formAction} style={{ background: 'white', padding: '24px', border: '1px solid #e5e7eb', borderRadius: '4px', maxWidth: '600px' }}>
      {!state.success && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {state.message}
        </div>
      )}
      
      <input type="hidden" name="id" value={project.id} />

      <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Overview</h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <Input 
          name="overallProgress" 
          label="Overall Progress (%) *" 
          type="number"
          min="0"
          max="100"
          defaultValue={project.overallProgress.toString()} 
          required 
        />
        <Input 
          name="targetCompletion" 
          label="Target Completion Date *" 
          defaultValue={project.targetCompletion} 
          required 
          placeholder="e.g. Q4 2025"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
        <Link href="/admin/construction">
          <Button variant="outlined" type="button">Cancel</Button>
        </Link>
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Progress'}
        </Button>
      </div>
    </form>
  );
};

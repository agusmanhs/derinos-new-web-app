'use client';

import React, { useActionState } from 'react';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { loginAction } from '@/actions/authActions';
import styles from './page.module.css';

const initialState = {
  success: true,
  message: '',
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className={styles.main}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1>Derinos Group</h1>
          <p>Sign in to the administration portal</p>
        </div>

        <form className={styles.form} action={formAction}>
          {!state.success && (
            <div className={styles.errorAlert}>{state.message}</div>
          )}
          
          <Input 
            name="email" 
            label="Email Address" 
            type="email" 
            placeholder="admin@derinos.com" 
            required 
          />
          <Input 
            name="password" 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isPending}
            className={styles.submitBtn}
          >
            {isPending ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className={styles.mockAccounts}>
          <h4>Mock Accounts for Testing</h4>
          <ul>
            <li><code>admin@derinos.com</code> (SUPER_ADMIN)</li>
            <li><code>salesmgr@derinos.com</code> (SALES_MANAGER)</li>
          </ul>
          <p>Any password &gt; 3 chars will work.</p>
        </div>
      </div>
    </main>
  );
}

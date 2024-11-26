'use client';

import { Suspense } from 'react';
import Dashboard from './dashboard';

export default function DashboardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
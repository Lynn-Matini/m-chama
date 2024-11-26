'use client';

import { useState, useEffect, Suspense } from 'react';
import Dashboard from './dashboard';

export default function DashboardClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
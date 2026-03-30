'use client';

import { useEffect } from 'react';

export default function WebOnlineLog() {
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'not configured';
    console.log('PURENorway web online');
    console.log(`Web frontend connected to backend: ${backendUrl}`);
  }, []);

  return null;
}

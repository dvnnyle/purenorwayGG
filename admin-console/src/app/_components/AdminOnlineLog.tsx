'use client';

import { useEffect } from 'react';

export default function AdminOnlineLog() {
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'not configured';
    console.log('PURENorway admin online');
    console.log(`Admin frontend connected to backend: ${backendUrl}`);
  }, []);

  return null;
}

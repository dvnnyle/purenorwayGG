import { Suspense } from 'react';
import UnsubscribeClient from '@/app/unsubscribe/UnsubscribeClient';

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeClient />
    </Suspense>
  );
}

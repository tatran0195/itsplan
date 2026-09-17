import { Suspense } from 'react';
import OAuthConsentPage from '@/features/mcp/components/OAuthConsentPage';

export default function ConsentRoute() {
  return (
    <Suspense>
      <OAuthConsentPage />
    </Suspense>
  );
}

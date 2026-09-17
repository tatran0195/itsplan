import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import BrandPanel from '@/components/common/page/BrandPanel';
import AuthLegalNotice from './AuthLegalNotice';

import { LocaleToggle } from '@/components/locale-toggle';
import { ThemeToggle } from '@/components/theme-toggle';

// The card shared by every logged-out screen. The forms read the URL (an invite
// parameter, a reset token, a "just confirmed" flag), so they render inside a
// Suspense boundary — useSearchParams needs one for these pages to prerender.
export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LocaleToggle />
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-4 md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Suspense fallback={null}>{children}</Suspense>
            <BrandPanel />
          </CardContent>
        </Card>
        <AuthLegalNotice />
      </div>
    </div>
  );
}

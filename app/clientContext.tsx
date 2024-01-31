'use client';

import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

export default function ClientContext({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <Providers>
      <div className="xl:container mx-auto">
        <Header />
        {mounted && children}
        <Footer />
        <Toaster />
      </div>
    </Providers>
  );
}

'use client';

import * as React from 'react';
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientContext({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <Providers>
            <div className="xl:container mx-auto">
                <Header />
                {mounted && children}
                <Footer />
            </div>
        </Providers>
    );
}
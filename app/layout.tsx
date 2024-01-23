import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

const chakra = Chakra_Petch({
  weight: ['300', '400', '500', '600', '700'], 
  subsets: ['latin'],
  style: ['normal']  
});

export const metadata: Metadata = {
  title: "BeCrowd",
  description: "Like-minded people makes your idea great.",
  icons: {
    icon: {url: '/icons/iconlogo.svg', href: '/icons/iconlogo.svg'}
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={chakra.className}>
        <div>
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}

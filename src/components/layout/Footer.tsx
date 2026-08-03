"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <footer className="border-t py-3 md:py-5 bg-muted/40 print:hidden">
      {isHome && (
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          <h3 className="font-bold text-2xl mb-4 text-primary">sinauin.id</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Platform manajemen sekolah modern yang terintegrasi dengan game edukasi untuk pengalaman belajar yang lebih baik.
          </p>
        </div>
      )}
      <div className={`container mx-auto text-center text-sm text-muted-foreground px-4 md:px-8 ${isHome ? 'mt-6 border-t pt-6' : ''}`}>
        © {new Date().getFullYear()} sinauin.id. All rights reserved.
      </div>
    </footer>
  );
}

"use client";

import Link from 'next/link';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isFiturActive = pathname === '/fitur';
  const isCetakNisnActive = pathname === '/cetak-nisn';
  const isGameEdukasiActive = pathname === '/game-edukasi';
  const isHargaActive = pathname === '/harga';

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="font-bold text-2xl text-primary">sinauin.id</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link 
              href="/fitur" 
              className={`relative text-sm font-semibold transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-blue-600 after:transition-transform after:duration-300 hover:after:scale-x-100 ${isFiturActive ? 'text-blue-600 after:scale-x-100' : 'text-slate-600 hover:text-blue-600 after:scale-x-0'}`}
            >
              Fitur
            </Link>
            <Link 
              href="/cetak-nisn" 
              className={`relative text-sm font-semibold transition-colors py-1 flex items-center gap-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-blue-600 after:transition-transform after:duration-300 hover:after:scale-x-100 ${isCetakNisnActive ? 'text-blue-600 after:scale-x-100' : 'text-slate-600 hover:text-blue-600 after:scale-x-0'}`}
            >
              Cetak NISN <span className="bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">Baru</span>
            </Link>
            <Link 
              href="/game-edukasi" 
              className={`relative text-sm font-semibold transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-blue-600 after:transition-transform after:duration-300 hover:after:scale-x-100 ${isGameEdukasiActive ? 'text-blue-600 after:scale-x-100' : 'text-slate-600 hover:text-blue-600 after:scale-x-0'}`}
            >
              Game Edukasi
            </Link>
            <Link 
              href="/harga" 
              className={`relative text-sm font-semibold transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-blue-600 after:transition-transform after:duration-300 hover:after:scale-x-100 ${isHargaActive ? 'text-blue-600 after:scale-x-100' : 'text-slate-600 hover:text-blue-600 after:scale-x-0'}`}
            >
              Harga
            </Link>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline">Coba Gratis</Button>
            <Button>Login Sekolah</Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 text-slate-600 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 top-16">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative border-t bg-white w-full p-4 shadow-lg flex flex-col gap-4 origin-top"
            >
              <nav className="flex flex-col gap-2">
                <Link 
                  href="/fitur" 
                  className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all hover:translate-x-1 ${isFiturActive ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Fitur
                </Link>
                <Link 
                  href="/cetak-nisn" 
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all hover:translate-x-1 flex items-center justify-between ${isCetakNisnActive ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Cetak NISN</span>
                  <span className="bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-bold">Baru</span>
                </Link>
                <Link 
                  href="/game-edukasi" 
                  className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all hover:translate-x-1 ${isGameEdukasiActive ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Game Edukasi
                </Link>
                <Link 
                  href="/harga" 
                  className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all hover:translate-x-1 ${isHargaActive ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Harga
                </Link>
              </nav>
              <div className="flex flex-col gap-2 mt-2 pt-4 border-t">
                <Button variant="outline" className="w-full justify-center">Coba Gratis</Button>
                <Button className="w-full justify-center">Login Sekolah</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

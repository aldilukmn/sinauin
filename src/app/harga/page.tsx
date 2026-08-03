"use client";

import React from 'react';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Harga() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div 
        className="text-center max-w-md w-full flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Coming Soon Lottie Animation */}
        <div className="w-full max-w-[320px] aspect-square mb-2 mx-auto overflow-hidden">
          <DotLottieReact
            src="/coming_soon.lottie" 
            loop
            autoplay
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Segera Hadir!</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Halaman Harga dan Paket Berlangganan sedang dalam tahap penyusunan. Kami akan segera kembali dengan penawaran yang paling pas untuk sekolah Anda.
        </p>

        <Link href="/">
          <Button className="w-full sm:w-auto px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-sm transition-transform hover:scale-105 active:scale-95">
            <Home className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

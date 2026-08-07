"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, GraduationCap, Gamepad2, Server, ShieldCheck, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { RotatingText } from "@/components/animations/RotatingText";

export default function Home() {
  const [schoolName, setSchoolName] = useState("");
  const [searchStatus, setSearchStatus] = useState<"idle" | "error">("idle");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (schoolName.toLowerCase().includes("kalimati")) {
      window.location.href = "https://sdn2kalimati.sinauin.id";
    } else {
      setSearchStatus("error");
    }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 lg:py-32 bg-linear-to-b from-blue-50 to-white overflow-hidden">
        <motion.div 
          className="container mx-auto relative z-10 text-center max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Transformasi Digital Sekolah Anda dalam <RotatingText texts={["Satu Platform", "Satu Ekosistem", "Satu Sentuhan"]} className="text-blue-600 overflow-hidden inline-flex" staggerDuration={0.03} rotationInterval={3000} />
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Sistem manajemen sekolah terintegrasi dengan edukasi interaktif. Dapatkan subdomain khusus untuk sekolah Anda hari ini juga!
          </motion.p>
          
          <motion.div variants={fadeUp} className="max-w-md mx-auto bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/5">
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <label htmlFor="school" className="text-sm font-semibold text-slate-700 text-left">
                Masuk ke Portal Sekolah Anda
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="school"
                    placeholder="Contoh: SDN 2 Kalimati" 
                    className="pl-11 h-12 text-base border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all"
                    value={schoolName}
                    onChange={(e) => {
                      setSchoolName(e.target.value);
                      setSearchStatus("idle");
                    }}
                  />
                </div>
                <Button type="submit" className="h-12 px-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-sm transition-transform duration-300 ease-out hover:scale-105">Cari</Button>
              </div>
              {searchStatus === "error" && (
                <p className="text-xs text-red-500 text-left">
                  Sekolah tidak ditemukan. Pastikan nama sudah benar atau hubungi Admin.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
        
        {/* Decorative elements (Hidden on mobile for performance) */}
        <div className="hidden md:block absolute top-1/4 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="hidden md:block absolute top-1/3 right-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="hidden md:block absolute -bottom-8 left-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fitur Utama sinauin.id</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Kami menyediakan semua yang Anda butuhkan untuk mengelola operasional sekolah secara modern dan efisien.</p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <Card className="border-slate-100 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle>Sistem Manajemen Terpadu</CardTitle>
                  <CardDescription>Kelola absensi, nilai, dan jadwal secara otomatis dan akurat.</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border-slate-100 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                  Segera Hadir
                </div>
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <CardTitle>Game Edukasi Interaktif</CardTitle>
                  <CardDescription>Ubah cara belajar menjadi lebih menyenangkan dengan misi dan pencapaian.</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border-slate-100 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Server className="h-6 w-6" />
                  </div>
                  <CardTitle>Subdomain Eksklusif</CardTitle>
                  <CardDescription>Identitas resmi untuk sekolah Anda dengan format sekolahanda.sinauin.id</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Multi-tenant Explanation Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Keamanan Data & Privasi Terjamin</h2>
              <p className="text-lg text-slate-600">
                Sistem kami menggunakan arsitektur <em>Multi-Tenant</em> tingkat lanjut. Artinya, setiap sekolah memiliki ruang datanya sendiri yang sepenuhnya terisolasi dan aman.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700">
                  <ShieldCheck className="text-blue-600 h-5 w-5" /> Data absensi & nilai hanya bisa diakses oleh warga sekolah Anda
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <ShieldCheck className="text-blue-600 h-5 w-5" /> Server cloud berkecepatan tinggi dengan uptime 99.9%
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <ShieldCheck className="text-blue-600 h-5 w-5" /> Backup data harian secara otomatis
                </li>
              </ul>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }} className="flex-1 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full">
              <div className="flex items-center justify-center space-x-2 text-xl md:text-2xl font-mono text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-hidden">
                <span className="text-blue-600 font-bold">sdn2kalimati</span>
                <span>.sinauin.id</span>
              </div>
              <p className="text-center text-sm text-slate-500 mt-4">Simulasi URL portal khusus untuk sekolah Anda</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white text-center">
        <motion.div 
          className="container mx-auto px-4 md:px-8 max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-6">Siap Mendigitalkan Sekolah Anda?</motion.h2>
          <motion.p variants={fadeUp} className="text-blue-100 mb-10 text-lg">
            Bergabunglah dengan sekolah-sekolah modern lainnya. Jadwalkan demo atau coba gratis hari ini.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 font-bold transition-transform duration-300 ease-out hover:scale-105">
              Jadwalkan Demo Gratis
            </Button>
            <Button size="lg" variant="outline" className="border-white border-[1.5px] text-white bg-transparent hover:bg-blue-700 hover:text-white transition-all duration-300 ease-out hover:scale-105">
              Hubungi Kami <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

"use client";
import { useState, startTransition } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSekolah } from "@/components/cetak-nisn/FormSekolah";
import { FormSiswa } from "@/components/cetak-nisn/FormSiswa";
import { FormSiswaBulk } from "@/components/cetak-nisn/FormSiswaBulk";
import { FormCard } from "@/components/cetak-nisn/FormCard";
import { BulkPrintLayout } from "@/components/cetak-nisn/BulkPrintLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { NisnCard, NisnCardBack } from "@/components/cetak-nisn/NisnCard";
import { useCetakNisn } from "./useCetakNisn";
import {
  Printer,
  Upload,
  AlertCircle,
  Info,
  CalendarIcon,
  RotateCw,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  ShieldCheck,
  School,
  FileText,
} from "lucide-react";

export default function CetakNisnPage() {
  const [isExitingPreview, setIsExitingPreview] = useState(false);
  
  const {
    data,
    setData,
    isFlipped,
    setIsFlipped,
    fileName,
    schoolLogoName,
    activeTab,
    setActiveTab,
    showMobilePreview,
    setShowMobilePreview,
    printMode,
    setPrintMode,
    paperSize,
    setPaperSize,
    isChangingMode,
    setIsChangingMode,
    bulkStudents,
    setBulkStudents,
    csvFileName,
    setCsvFileName,
    printCount,
    fileInputRef,
    schoolLogoInputRef,
    isFormComplete,
    previewData,
    handleModeSwitch,
    handleChange,
    handleReset,
    handleSchoolLogoUpload,
    handlePhotoUpload,
    handlePrint
  } = useCetakNisn();
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row bg-white relative print:hidden">
        {/* LEFT PANE (Brand & Preview) */}
        <div
          className={cn(
            "relative w-full lg:w-[45%] xl:w-[45%] bg-[#0f172a] shrink-0 transition-all",
            showMobilePreview
              ? "min-h-[calc(100vh-4rem)] block"
              : "hidden lg:flex flex-col",
          )}
        >
          {/* Decorative mesh gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/40 via-transparent to-emerald-900/20 pointer-events-none" />

          <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] w-full flex flex-col">
            <div className="p-6 md:p-10 lg:p-12 flex flex-col flex-1 relative z-10 justify-center">
              {/* Live Preview Container */}
              <div
                className={cn(
                  "flex-1 flex flex-col",
                  showMobilePreview ? "flex" : "hidden lg:flex",
                )}
              >
                {/* Mobile Back Button */}
                <div className="flex lg:hidden mb-32">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsExitingPreview(true);
                      setTimeout(() => {
                        setShowMobilePreview(false);
                        setIsExitingPreview(false);
                      }, 400); // Wait for exit animation
                    }}
                    className="w-full bg-white/10 border-white/20 text-white font-medium shadow-sm h-11 hover:bg-white/20 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali Edit Data
                  </Button>
                </div>

                <motion.div
                  key={showMobilePreview ? "preview-active" : "preview-hidden"}
                  className="w-full flex-1 flex flex-col justify-center items-center"
                  initial={{ opacity: 0, scale: 0.3, y: 20 }}
                  animate={{ 
                    opacity: isExitingPreview ? 0 : 1, 
                    scale: isExitingPreview ? 0.3 : 1, 
                    y: isExitingPreview ? 20 : 0 
                  }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                >
                  <div className="w-full max-w-[8.56cm] flex flex-col gap-6">
                    <div className="w-full flex justify-center border-b border-white/10 pb-4 shrink-0 mb-2">
                      <h2 className="text-xs font-bold text-white bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest text-center border border-white/20 flex items-center gap-2 lg:backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="lg:animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75 hidden lg:block"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Preview
                      </h2>
                    </div>

                    {/* 3D Flip Container */}
                    <div
                      className="relative cursor-pointer group"
                      style={{
                        perspective: "1000px",
                        width: "8.56cm",
                        height: "5.398cm",
                      }}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <div
                        className="w-full h-full relative transition-transform duration-700"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        }}
                      >
                        {/* Front Face */}
                        <div
                          className="absolute inset-0 w-full h-full shadow-sm border border-slate-200 rounded-md overflow-hidden bg-white"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          {isChangingMode ? (
                            <div className="absolute inset-0 z-50 bg-slate-50 flex items-center justify-center p-4">
                              <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="w-full h-full flex flex-col justify-between"
                              >
                                <div className="w-full h-[25%] bg-slate-200 rounded-md mb-2"></div>
                                <div className="flex gap-2 h-[50%] mb-2">
                                  <div className="w-[30%] bg-slate-200 rounded-md"></div>
                                  <div className="w-[70%] flex flex-col gap-2">
                                    <div className="h-3 w-full bg-slate-200 rounded-full"></div>
                                    <div className="h-3 w-5/6 bg-slate-200 rounded-full"></div>
                                    <div className="h-3 w-4/6 bg-slate-200 rounded-full"></div>
                                  </div>
                                </div>
                                <div className="w-full h-[20%] bg-slate-200 rounded-md"></div>
                              </motion.div>
                            </div>
                          ) : (
                            <NisnCard data={previewData} />
                          )}

                          {/* Premium Glossy Shimmer Effect (Desktop Only) */}
                          <div className="hidden lg:block">
                            <motion.div
                              className="absolute inset-0 z-10 pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%)",
                              }}
                              animate={{ x: ["-150%", "200%"] }}
                              transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut",
                                repeatDelay: 2,
                              }}
                            />
                          </div>

                          {/* Hover overlay explaining flip */}
                          <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <RotateCw className="w-8 h-8 text-white mb-2" />
                            <p className="text-xs text-white font-medium text-center px-4">
                              Klik untuk melihat bagian belakang
                            </p>
                          </div>
                        </div>

                        {/* Back Face */}
                        <div
                          className="absolute inset-0 w-full h-full shadow-sm border border-slate-200 rounded-md overflow-hidden bg-white"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          {isChangingMode ? (
                            <div className="absolute inset-0 z-50 bg-slate-50 flex items-center justify-center p-4">
                              <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="w-full h-full flex flex-col gap-2"
                              >
                                <div className="h-4 w-1/3 bg-slate-200 rounded-full mb-2"></div>
                                <div className="h-3 w-full bg-slate-200 rounded-full"></div>
                                <div className="h-3 w-11/12 bg-slate-200 rounded-full"></div>
                                <div className="h-3 w-full bg-slate-200 rounded-full"></div>
                                <div className="h-3 w-10/12 bg-slate-200 rounded-full"></div>
                                <div className="h-3 w-full bg-slate-200 rounded-full mt-4"></div>
                                <div className="h-3 w-8/12 bg-slate-200 rounded-full"></div>
                              </motion.div>
                            </div>
                          ) : (
                            <NisnCardBack data={previewData} />
                          )}

                          {/* Premium Glossy Shimmer Effect (Desktop Only) */}
                          <div className="hidden lg:block">
                            <motion.div
                              className="absolute inset-0 z-10 pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%)",
                              }}
                              animate={{ x: ["-150%", "200%"] }}
                              transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut",
                                repeatDelay: 2,
                              }}
                            />
                          </div>

                          {/* Hover overlay explaining flip */}
                          <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <RotateCw className="w-8 h-8 text-white mb-2" />
                            <p className="text-xs text-white font-medium text-center px-4">
                              Klik untuk melihat bagian depan
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {printMode === "bulk" && isFormComplete && (
                      <div className="mt-4 mb-2 flex items-center justify-between bg-slate-50 p-2 rounded-xl text-sm border border-slate-200/80 shadow-sm">
                        <div className="flex items-center gap-2 px-2">
                          <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-slate-700 font-medium">Ukuran Kertas</span>
                        </div>
                        <div className="flex bg-slate-200/60 p-1 rounded-lg relative">
                          {["A4", "F4"].map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                startTransition(() => {
                                  setPaperSize(size as "A4" | "F4");
                                });
                              }}
                              className={cn(
                                "relative px-4 py-1.5 rounded-md text-sm font-medium transition-colors z-10",
                                paperSize === size ? "text-blue-700" : "text-slate-500 hover:text-slate-700"
                              )}
                            >
                              {paperSize === size && (
                                <motion.div
                                  layoutId="paper-size-active"
                                  className="absolute inset-0 bg-white rounded-md shadow-sm"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                  style={{ zIndex: -1 }}
                                />
                              )}
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handlePrint}
                      disabled={!isFormComplete}
                      className={cn(
                        "w-full font-semibold h-12 text-base shadow-sm transition-transform mt-2",
                        isFormComplete
                          ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-[0.98]"
                          : "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed hover:bg-slate-800",
                      )}
                    >
                      <Printer className="w-5 h-5 mr-2" />{" "}
                      {printMode === "bulk"
                        ? "Cetak Massal"
                        : "Cetak Kartu"}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE (Form) */}
        <div
          className={cn(
            "flex-1 bg-slate-50 lg:bg-white flex flex-col relative",
            showMobilePreview ? "hidden lg:flex" : "flex",
          )}
        >
          <div className="w-full max-w-2xl mx-auto p-4 py-8 md:p-8 lg:p-12 lg:py-16 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <div className="mb-4 flex flex-col items-center text-center lg:items-start lg:text-left">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                  Cetak Kartu NISN
                </h1>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-md">
                  Buat dan cetak Kartu Nomor Induk Siswa Nasional (NISN) secara
                  instan.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-2 items-center justify-center lg:justify-start">
                  <div className="flex w-full sm:w-auto items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privasi
                    100% Aman di Perangkat Anda
                  </div>
                  <AnimatePresence>
                    {printCount !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="flex w-full sm:w-auto items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm"
                      >
                        🎉 <AnimatedNumber value={printCount} /> Kartu NISN
                        Diterbitkan
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Header Area */}
              <div className="flex gap-2">
                {/* Tabs / Stepper Header */}
                <div className="flex flex-1 bg-slate-200/60 p-1 md:p-1.5 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] border border-slate-200/50">
                  {[
                    { id: 0, label: "Sekolah", icon: School },
                    { id: 1, label: "Siswa", icon: User },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 0 | 1)}
                      className={cn(
                        "relative cursor-pointer flex-1 py-1.5 md:py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2",
                        activeTab === tab.id
                          ? "text-blue-700"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
                      )}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-white shadow-sm ring-1 ring-slate-900/5 rounded-lg z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  title="Bersihkan Formulir"
                  className="group cursor-pointer flex items-center justify-center gap-2 bg-red-50/50 border border-red-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] text-red-500 hover:text-red-600 hover:bg-red-100/80 hover:border-red-200 rounded-xl px-4 sm:px-5 transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-180" />
                  <span className="text-sm font-bold">Reset</span>
                </button>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {activeTab === 0 && (
                    <motion.div
                      key="sekolah"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-6"
                    >
                      <FormCard
                        title="Informasi Sekolah"
                        description="Identitas sekolah akan tampil di kop/header kartu"
                        icon={<School className="w-5 h-5 text-blue-100" />}
                      >
                        <FormSekolah
                          data={data}
                          handleChange={handleChange}
                          schoolLogoName={schoolLogoName}
                          schoolLogoInputRef={schoolLogoInputRef}
                          handleSchoolLogoUpload={handleSchoolLogoUpload}
                        />
                      </FormCard>
                      <div className="flex lg:hidden mt-2">
                        <Button
                          onClick={() => setActiveTab(1)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-sm shadow-sm"
                        >
                          Lanjut: Data Siswa{" "}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 1 && (
                    <motion.div
                      key="siswa"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-6"
                    >
                      <FormCard
                        title="Data Siswa"
                        description="Lengkapi biodata siswa untuk pencetakan kartu"
                        icon={printMode === 'bulk' ? <Users className="w-5 h-5 text-blue-100" /> : <User className="w-5 h-5 text-blue-100" />}
                      >
                        <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-4">
                          {[
                            { id: "single", label: "Cetak Satuan" },
                            { id: "bulk", label: "Cetak Massal" },
                          ].map((mode) => (
                            <button
                              key={mode.id}
                              onClick={() => handleModeSwitch(mode.id as "single" | "bulk")}
                              className={cn(
                                "relative cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                                printMode === mode.id
                                  ? "text-slate-900"
                                  : "text-slate-500 hover:text-slate-700",
                              )}
                            >
                              {printMode === mode.id && (
                                <motion.div
                                  layoutId="printModeIndicator"
                                  className="absolute inset-0 bg-white shadow-sm rounded-md z-0"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                              <span className="relative z-10">{mode.label}</span>
                            </button>
                          ))}
                        </div>

                        <AnimatePresence mode="wait">
                          {printMode === "single" ? (
                            <motion.div
                              key="single"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FormSiswa
                                data={data}
                                setData={setData}
                                handleChange={handleChange}
                                fileName={fileName}
                                fileInputRef={fileInputRef}
                                handlePhotoUpload={handlePhotoUpload}
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="bulk"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FormSiswaBulk
                                bulkStudents={bulkStudents}
                                setBulkStudents={setBulkStudents}
                                fileName={csvFileName}
                                setFileName={setCsvFileName}
                                photoCount={bulkStudents.filter((s) => s.photoUrl).length}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </FormCard>
                      <div className="flex lg:hidden mt-2">
                        <Button
                          onClick={() => setShowMobilePreview(true)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 text-sm shadow-sm"
                        >
                          Lihat Hasil Kartu{" "}
                          <CheckCircle2 className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 text-slate-700 p-4 rounded-xl text-sm w-full mt-6 shadow-sm">
                <strong className="text-slate-900 flex items-center gap-2 mb-2">
                  <Printer className="w-4 h-4 text-yellow-600" /> Tips Mencetak:
                </strong>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-500">
                  <li>
                    Ukuran cetak CR80 adalah <strong>85.6 mm x 54 mm</strong>.
                  </li>
                  <li>
                    Gunakan <strong>kertas foto atau PVC</strong> untuk hasil
                    terbaik.
                  </li>
                  <li>
                    Atur Scale printer ke <strong>100%</strong>.
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      <BulkPrintLayout
        bulkStudents={printMode === "bulk" ? bulkStudents : [{...data}]}
        paperSize={paperSize}
        schoolData={{
          school: data.school,
          district: data.district,
          regency: data.regency,
          schoolLogoUrl: data.schoolLogoUrl,
        }}
      />
    </>
  );
}

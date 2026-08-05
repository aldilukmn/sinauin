"use client";

import { useState, useRef, useCallback } from "react";
import * as htmlToImage from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
import { NisnCard, NisnData, NisnCardBack, StudentData } from "@/components/cetak-nisn/NisnCard";
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
  ShieldCheck,
} from "lucide-react";

export default function CetakNisnPage() {
  const [data, setData] = useState<NisnData>({
    nisn: "",
    name: "",
    pob: "",
    dob: "",
    gender: "",
    school: "",
    schoolLogoUrl: "",
    district: "",
    regency: "",
    photoUrl: "",
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [schoolLogoName, setSchoolLogoName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [printMode, setPrintMode] = useState<"single" | "bulk">("single");
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [bulkStudents, setBulkStudents] = useState<StudentData[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const schoolLogoInputRef = useRef<HTMLInputElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handleModeSwitch = (mode: "single" | "bulk") => {
    if (printMode === mode) return;
    setIsChangingMode(true);
    setPrintMode(mode);
    setTimeout(() => {
      setIsChangingMode(false);
    }, 600);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let value = e.target.value;

    // Only allow numbers for NISN
    if (e.target.name === "nisn") {
      value = value.replace(/\D/g, "");
    }

    // Only allow letters, spaces, and basic name punctuation (.,'-) for Name and POB
    if (e.target.name === "name" || e.target.name === "pob") {
      value = value.replace(/[^a-zA-Z\s.,'-]/g, "");
    }

    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const handleReset = () => {
    setData({
      nisn: "",
      name: "",
      pob: "",
      dob: "",
      gender: "",
      school: "",
      schoolLogoUrl: "",
      district: "",
      regency: "",
      photoUrl: "",
    });
    setFileName("");
    setSchoolLogoName("");
    setBulkStudents([]);
    setCsvFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (schoolLogoInputRef.current) {
      schoolLogoInputRef.current.value = "";
    }
  };

  const isFormComplete = printMode === "single" ? Boolean(
    data.nisn &&
    data.nisn.length === 10 &&
    data.name &&
    data.pob &&
    data.dob &&
    data.gender &&
    data.school &&
    data.district &&
    data.regency &&
    data.schoolLogoUrl &&
    data.photoUrl,
  ) : Boolean(
    data.school &&
    data.district &&
    data.regency &&
    data.schoolLogoUrl &&
    bulkStudents.length > 0
  );

  const previewData = printMode === 'bulk' && bulkStudents.length > 0
    ? { 
        ...bulkStudents[0], 
        school: data.school, 
        district: data.district, 
        regency: data.regency, 
        schoolLogoUrl: data.schoolLogoUrl 
      }
    : data;

  const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Format file tidak didukung! Harap unggah file gambar.");
        if (schoolLogoInputRef.current) schoolLogoInputRef.current.value = "";
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran logo terlalu besar! Maksimal 2MB.");
        if (schoolLogoInputRef.current) schoolLogoInputRef.current.value = "";
        return;
      }
      setSchoolLogoName(file.name);
      const url = URL.createObjectURL(file);
      setData({ ...data, schoolLogoUrl: url });
      toast.success("Logo sekolah berhasil diunggah!");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate that the file is an image
      if (!file.type.startsWith("image/")) {
        toast.error(
          "Format file tidak didukung! Harap unggah file gambar (JPG / JPEG atau PNG).",
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran foto terlalu besar! Maksimal 2MB.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setData({ ...data, photoUrl: url });
      toast.success("Foto berhasil diunggah!");
    }
  };

  const handlePrint = useCallback(async () => {
    if (printMode === "bulk") {
      window.print();
      return;
    }

    if (printContainerRef.current === null) {
      return;
    }

    try {
      // Configure high resolution export
      const exportOptions = {
        quality: 1.0,
        pixelRatio: 4,
      };

      // Generate the combined image
      const dataUrl = await htmlToImage.toPng(
        printContainerRef.current,
        exportOptions,
      );

      const nisnFormat = data.nisn ? data.nisn : "nisn";
      const nameFormat = data.name ? data.name : "nama";
      const baseFileName = `kartu_${nisnFormat}_${nameFormat}`
        .toLowerCase()
        .replace(/\s+/g, "_");

      // Trigger download
      const link = document.createElement("a");
      link.download = `${baseFileName}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Kartu berhasil diunduh!");
    } catch (err) {
      console.error("Oops, something went wrong!", err);
      toast.error("Gagal mengunduh kartu. Silakan coba lagi.");
    }
  }, [data.nisn, data.name, printMode]);

  return (
    <>
    <div className="w-full flex flex-col lg:flex-row bg-white relative print:hidden">
      
      {/* LEFT PANE (Brand & Preview) */}
      <div className={cn(
        "relative w-full lg:w-[45%] xl:w-[45%] bg-[#0f172a] shrink-0 transition-all",
        showMobilePreview ? "min-h-[calc(100vh-4rem)] block" : "hidden lg:flex flex-col",
      )}>
        {/* Decorative mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-emerald-900/20 pointer-events-none" />
        
        <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] w-full flex flex-col">
          <div className="p-6 md:p-10 lg:p-12 flex flex-col flex-1 relative z-10 justify-center">
          


          {/* Live Preview Container */}
          <div className={cn("flex-1 flex flex-col", showMobilePreview ? "flex" : "hidden lg:flex")}>
            {/* Mobile Back Button */}
            <div className="flex lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowMobilePreview(false)}
                className="w-full bg-white/10 border-white/20 text-white font-medium shadow-sm h-11 hover:bg-white/20 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali Edit Data
              </Button>
            </div>

            <motion.div
              className="w-full flex-1 flex flex-col justify-center items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <div className="w-full max-w-[8.56cm] flex flex-col gap-6">
                
                <div className="w-full flex justify-center border-b border-white/10 pb-4 shrink-0 mb-2">
                  <h2 className="text-xs font-bold text-white bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest text-center border border-white/20 flex items-center gap-2 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
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
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
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

                      {/* Premium Glossy Shimmer Effect */}
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
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
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

                      {/* Premium Glossy Shimmer Effect */}
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

                <Button
                  onClick={handlePrint}
                  disabled={!isFormComplete}
                  className={cn(
                    "w-full font-semibold h-12 text-base shadow-sm transition-transform mt-4",
                    isFormComplete
                      ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed hover:bg-slate-800",
                  )}
                >
                  <Printer className="w-5 h-5 mr-2" /> {printMode === 'bulk' ? 'Cetak Massal (A4)' : 'Unduh Kartu'}
                </Button>


              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>

      {/* RIGHT PANE (Form) */}
      <div className={cn(
        "flex-1 bg-slate-50 lg:bg-white flex flex-col relative",
        showMobilePreview ? "hidden lg:flex" : "flex"
      )}>
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
                Buat dan cetak Kartu Nomor Induk Siswa Nasional (NISN) secara instan.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privasi 100% Aman di Perangkat Anda
              </div>
            </div>

{/* Header Area */}
            <div className="flex gap-2">
              {/* Tabs / Stepper Header */}
              <div className="flex flex-1 bg-slate-200/60 p-1.5 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] border border-slate-200/50">
                <button
                  onClick={() => setActiveTab(0)}
                  className={cn(
                    "cursor-pointer flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                    activeTab === 0
                      ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-900/5"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
                  )}
                >
                  <Info className="w-4 h-4" />
                  Sekolah
                </button>
                <button
                  onClick={() => setActiveTab(1)}
                  className={cn(
                    "cursor-pointer flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                    activeTab === 1
                      ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-900/5"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
                  )}
                >
                  <User className="w-4 h-4" />
                  Siswa
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                title="Bersihkan Formulir"
                className="cursor-pointer flex items-center justify-center gap-2 bg-white border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl px-4 sm:px-5 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
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
                      description="Identitas sekolah akan tampil di kop/header kartu."
                      icon={<Info className="w-5 h-5 text-blue-100" />}
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
                        Lanjut: Data Siswa <ArrowRight className="w-4 h-4 ml-2" />
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
                      description="Isi data siswa di bawah ini."
                      icon={<Info className="w-5 h-5 text-blue-100" />}
                    >
                      <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-4">
                        <button 
                          onClick={() => handleModeSwitch('single')}
                          className={cn("cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md transition-all", printMode === 'single' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                        >
                          Cetak Satuan
                        </button>
                        <button 
                          onClick={() => handleModeSwitch('bulk')}
                          className={cn("cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md transition-all", printMode === 'bulk' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                        >
                          Cetak Massal
                        </button>
                      </div>

                      {printMode === 'single' ? (
                        <FormSiswa 
                          data={data}
                          setData={setData}
                          handleChange={handleChange}
                          fileName={fileName}
                          fileInputRef={fileInputRef}
                          handlePhotoUpload={handlePhotoUpload}
                        />
                      ) : (
                        <FormSiswaBulk
                          bulkStudents={bulkStudents}
                          setBulkStudents={setBulkStudents}
                          fileName={csvFileName}
                          setFileName={setCsvFileName}
                          photoCount={bulkStudents.filter(s => s.photoUrl).length}
                        />
                      )}
                    </FormCard>
                    <div className="flex lg:hidden mt-2">
                      <Button
                        onClick={() => setShowMobilePreview(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 text-sm shadow-sm"
                      >
                        Lihat Hasil Kartu <CheckCircle2 className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          <div className="bg-blue-50/50 border border-blue-100 text-slate-600 p-4 rounded-xl text-sm w-full mt-6">
            <strong className="text-slate-900 flex items-center gap-2 mb-2"><Printer className="w-4 h-4 text-blue-600"/> Tips Mencetak:</strong>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-500">
              <li>Ukuran cetak CR80 adalah <strong>85.6 mm x 54 mm</strong>.</li>
              <li>Gunakan kertas foto atau PVC untuk hasil terbaik.</li>
              <li>Atur Scale printer ke <strong>100%</strong>.</li>
            </ul>
          </div>
          </motion.div>
        </div>
      </div>
      
{/* Hidden Render Area for HTML-to-Image 
          We render un-rotated, clean versions of the cards here side-by-side so they are captured as a single combined image */}
      <div className="fixed top-0 left-[-9999px]">
        {/* We add a transparent background and a small gap so the output image looks neat and is easy to cut */}
        <div
          ref={printContainerRef}
          className="flex gap-4 p-4 bg-transparent items-center justify-center"
        >
          <NisnCard data={data} />
          <NisnCardBack data={data} />
        </div>
      </div>
    </div>
    
    {printMode === 'bulk' && (
      <BulkPrintLayout 
        bulkStudents={bulkStudents} 
        schoolData={{
          school: data.school,
          district: data.district,
          regency: data.regency,
          schoolLogoUrl: data.schoolLogoUrl,
        }}
      />
    )}
    </>
  );
}

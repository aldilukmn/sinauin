"use client";

import { useState, useRef, useCallback } from "react";
import * as htmlToImage from "html-to-image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  NisnCard,
  NisnCardBack,
  NisnData,
} from "@/components/cetak-nisn/NisnCard";
import {
  Printer,
  Upload,
  AlertCircle,
  Info,
  CalendarIcon,
  RotateCw,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function CetakNisnPage() {
  const [data, setData] = useState<NisnData>({
    nisn: "",
    name: "",
    pob: "",
    dob: "",
    gender: "",
    school: "",
    photoUrl: "",
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);

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
      photoUrl: "",
    });
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isFormComplete = Boolean(
    data.nisn &&
    data.nisn.length === 10 &&
    data.name &&
    data.pob &&
    data.dob &&
    data.gender &&
    data.school &&
    data.photoUrl,
  );

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

      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setData({ ...data, photoUrl: url });
      toast.success("Foto berhasil diunggah!");
    }
  };

  const handlePrint = useCallback(async () => {
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
  }, [data.nisn, data.name]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Cetak Kartu NISN Gratis
          </h1>
          <div className="text-slate-600 max-w-4xl mx-auto mt-2 leading-relaxed flex flex-col items-center">
            <p>
              Buat dan cetak Kartu Nomor Induk Siswa Nasional (NISN) dengan
              desain resmi secara instan.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium mt-5 text-center w-fit max-w-full md:whitespace-nowrap">
              <span>
                Privasi 100% Aman: Seluruh data hanya diproses di perangkat Anda
                dan tidak disimpan di server kami.
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left Column: Form */}
          <motion.div
            className="flex-1 flex flex-col order-last lg:order-first"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="flex-1 bg-white rounded-2xl shadow-sm border-slate-200 overflow-hidden pt-0 flex flex-col">
              <CardHeader className="bg-blue-600 border-b border-blue-700 p-6 md:px-8">
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <Info className="w-5 h-5 text-blue-100" /> Lengkapi Data Siswa
                </CardTitle>
                <CardDescription className="text-blue-100/90 font-medium">
                  Isi formulir di bawah ini. Tampilan kartu akan otomatis
                  diperbarui.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6 flex flex-col grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                      NISN (10 Digit)
                    </label>
                    <div className="relative">
                      <Input
                        name="nisn"
                        value={data.nisn}
                        onChange={handleChange}
                        placeholder="Contoh: 0123456789"
                        maxLength={10}
                        inputMode="numeric"
                        className={cn(
                          "peer bg-white hover:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all text-sm placeholder:text-slate-400 pr-9",
                          data.nisn.length === 10
                            ? "border-emerald-400"
                            : data.nisn.length > 0
                              ? "border-red-400"
                              : "border-slate-300",
                        )}
                      />
                      {data.nisn.length === 10 && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-200">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {data.nisn.length > 0 && data.nisn.length < 10 && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-500 animate-in zoom-in duration-200">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <Input
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Nama Lengkap Siswa"
                        maxLength={40}
                        className={cn(
                          "bg-white hover:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all text-sm placeholder:text-slate-400 pr-9",
                          data.name ? "border-emerald-400" : "border-slate-300",
                        )}
                      />
                      {data.name && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-200">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                      Tempat Lahir
                    </label>
                    <div className="relative">
                      <Input
                        name="pob"
                        value={data.pob}
                        onChange={handleChange}
                        placeholder="Kota/Kabupaten"
                        className={cn(
                          "bg-white hover:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all text-sm placeholder:text-slate-400 pr-9",
                          data.pob ? "border-emerald-400" : "border-slate-300",
                        )}
                      />
                      {data.pob && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-200">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                      Tanggal Lahir
                    </label>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger
                        className={cn(
                          "flex w-full min-w-0 h-8 px-2.5 py-1 text-sm font-normal rounded-lg border bg-white hover:bg-white hover:border-blue-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all shadow-none items-center justify-between text-left overflow-hidden placeholder:text-slate-400",
                          data.dob ? "border-emerald-400" : "border-slate-300",
                          !data.dob && "text-slate-500",
                        )}
                      >
                        <span className="truncate flex-1">
                          {data.dob
                            ? format(new Date(data.dob), "d MMMM yyyy", {
                                locale: id,
                              })
                            : "Pilih Tanggal Lahir"}
                        </span>
                        {data.dob ? (
                          <CheckCircle2 className="ml-2 h-4 w-4 shrink-0 text-emerald-500 animate-in zoom-in duration-200" />
                        ) : (
                          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={data.dob ? new Date(data.dob) : undefined}
                          defaultMonth={
                            data.dob ? new Date(data.dob) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const offset = date.getTimezoneOffset();
                              const adjustedDate = new Date(
                                date.getTime() - offset * 60 * 1000,
                              );
                              setData({
                                ...data,
                                dob: adjustedDate.toISOString().split("T")[0],
                              });
                              setIsCalendarOpen(false);
                            } else {
                              setData({ ...data, dob: "" });
                            }
                          }}
                          initialFocus
                          locale={id}
                          captionLayout="dropdown"
                          startMonth={new Date(1990, 0)}
                          endMonth={new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                      Jenis Kelamin
                    </label>
                    <div className="relative">
                      <Select
                        value={data.gender}
                        onValueChange={(value) =>
                          setData({ ...data, gender: value })
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "h-8 w-full rounded-lg bg-white hover:border-blue-400 px-2.5 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all shadow-none border",
                            data.gender
                              ? "border-emerald-400 pr-9 [&>span>svg]:hidden [&>svg]:hidden"
                              : "border-slate-300",
                          )}
                        >
                          <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Jenis Kelamin</SelectLabel>
                            <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {data.gender && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-200 pointer-events-none bg-white">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                      Asal Sekolah
                    </label>
                    <div className="relative">
                      <Input
                        name="school"
                        value={data.school}
                        onChange={handleChange}
                        placeholder="Contoh: SDN 2 Kalimati"
                        className={cn(
                          "bg-white hover:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all text-sm placeholder:text-slate-400 pr-9",
                          data.school
                            ? "border-emerald-400"
                            : "border-slate-300",
                        )}
                      />
                      {data.school && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-200">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">
                    Pas Foto (Rasio 3x4)
                  </label>
                  <div className="flex gap-4 items-center">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      title={fileName || "Unggah Foto"}
                      className={cn(
                        "w-full border transition-all shadow-none truncate px-4",
                        fileName
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 border-solid"
                          : "border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50",
                      )}
                    >
                      <Upload className="w-4 h-4 mr-2 shrink-0" />
                      <span className="truncate">
                        {fileName || "Unggah Foto"}
                      </span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                    Foto hanya diproses di browser Anda dan tidak disimpan di
                    server kami.
                  </p>
                </div>

                {/* Reset Button to fill the empty bottom space */}
                <div className="mt-auto pt-4 sm:pt-6">
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <span className="w-full sm:flex-1 flex justify-center items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm border border-slate-200 text-xs font-medium text-slate-500">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Preview sinkron secara real-time
                    </span>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="w-full sm:flex-1 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4 mr-1.5" />
                      Bersihkan Formulir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>{" "}
          </motion.div>

          {/* Right Column: Preview & Print */}
          <motion.div
            className="grid grid-rows-[1fr_auto] gap-6 order-first lg:order-last w-full lg:w-[420px] shrink-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center gap-6 w-full h-full">
              <div className="w-full flex justify-center border-b border-blue-100 pb-4 shrink-0">
                <h2 className="text-xs font-bold text-white bg-blue-600 px-4 py-1.5 rounded-full uppercase tracking-widest text-center shadow-sm border border-blue-700">
                  Live Preview
                </h2>
              </div>

              <div className="w-full max-w-[8.56cm] flex-1 flex flex-col justify-center gap-6">
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
                      className="absolute inset-0 w-full h-full shadow-sm border border-slate-200 rounded-md overflow-hidden"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <NisnCard data={data} />

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
                      className="absolute inset-0 w-full h-full shadow-sm border border-slate-200 rounded-md overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <NisnCardBack />

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
                    "w-full font-semibold h-12 text-base shadow-sm transition-transform",
                    isFormComplete
                      ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200",
                  )}
                >
                  <Printer className="w-5 h-5 mr-2" /> Unduh Kartu (Depan &
                  Belakang)
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm w-full mt-auto">
              <strong>Tips Mencetak:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li>
                  Ukuran standar cetak ID Card (CR80) adalah{" "}
                  <strong>85.6 mm x 54 mm</strong>.
                </li>
                <li>
                  Anda bisa menempelkan banyak file PNG kartu ke Microsoft Word
                  untuk dicetak sekaligus.
                </li>
                <li>Gunakan kertas foto atau PVC untuk hasil terbaik.</li>
                <li>
                  Atur Scale ke <strong>100%</strong> (Default).
                </li>
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
          <NisnCardBack />
        </div>
      </div>
    </div>
  );
}

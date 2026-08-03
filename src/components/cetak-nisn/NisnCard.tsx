"use client";

import QRCode from "react-qr-code";
import { forwardRef } from "react";

export interface NisnData {
  nisn: string;
  name: string;
  pob: string;
  dob: string;
  gender: string;
  school: string;
  photoUrl: string;
}

interface NisnCardProps {
  data: NisnData;
}

export const NisnCard = forwardRef<HTMLDivElement, NisnCardProps>(({ data }, ref) => {
  const formattedDob = data.dob ? new Date(data.dob).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : "";

  return (
    <div
      ref={ref}
      className="bg-white print-exact-size shrink-0 rounded-md overflow-hidden relative"
      style={{
        width: "8.56cm",
        height: "5.398cm",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Background styling to mimic official card */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-emerald-50 to-amber-100 opacity-60 z-0" />

      {/* Watermark Logo */}
      <div className="absolute bottom-5 right-1.5 opacity-[0.08] z-0 pointer-events-none">
        <img src="/tut_wuri_handayani.png" alt="" className="w-30 h-30 object-contain grayscale" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="bg-blue-600 text-white flex items-center justify-between px-3 py-1.5 border-b-2 border-yellow-400">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="bg-white p-0.5 rounded-full flex items-center justify-center shrink-0 w-[7mm] h-[7mm]">
              <img src="/tut_wuri_handayani_color.png" alt="Logo Kemdikbud" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-[8px] font-bold leading-tight uppercase tracking-wide">
                Kementerian Pendidikan Dasar dan Menengah
              </h1>
              <h2 className="text-[8px] tracking-widest font-medium leading-none text-blue-100">
                Republik Indonesia
              </h2>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-1 flex p-2 gap-3 relative">
          {/* Left Column: Photo */}
          <div className="flex flex-col items-center justify-center w-[2cm] shrink-0 h-full">
            {/* Photo 3x4 aspect ratio placeholder */}
            <div className="w-[2cm] h-[2.67cm] bg-slate-200 border border-slate-300 rounded overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt="Pas Foto"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[8px] text-slate-400">Foto 3x4</span>
              )}
            </div>
          </div>

          {/* Right Column: Data */}
          <div className="flex-1 flex flex-col pt-1">
            <h3 className="text-center text-[10px] font-bold text-blue-900 border-b border-blue-900/30 pb-0.5 mb-1.5 uppercase tracking-wide whitespace-nowrap">
              Kartu Nomor Induk Siswa Nasional
            </h3>

            <div className="text-[12px] font-black text-slate-800 tracking-wider mb-1">
              {data.nisn || "0123456789"}
            </div>

            <div className="flex flex-col gap-0.5 text-[8px] text-slate-900 mt-1">
              <div className="grid grid-cols-[66px_4px_1fr] items-start">
                <span className="font-semibold text-slate-700">
                  Nama Lengkap
                </span>
                <span>:</span>
                <span
                  className="font-bold uppercase truncate"
                  title={data.name}
                >
                  {data.name || "xxxxx xxxxxx xxxxxx"}
                </span>
              </div>
              <div className="grid grid-cols-[66px_4px_1fr] items-start">
                <span className="font-semibold text-slate-700">
                  Tempat Lahir
                </span>
                <span>:</span>
                <span
                  className={`truncate ${data.pob ? "capitalize" : ""}`}
                  title={data.pob}
                >
                  {data.pob || "xxxxx"}
                </span>
              </div>
              <div className="grid grid-cols-[66px_4px_1fr] items-start">
                <span className="font-semibold text-slate-700">
                  Tanggal Lahir
                </span>
                <span>:</span>
                <span
                  className={`truncate ${formattedDob ? "capitalize" : ""}`}
                >
                  {formattedDob || "xx xx xxxx"}
                </span>
              </div>
              <div className="grid grid-cols-[66px_4px_1fr] items-start pr-12">
                <span className="font-semibold text-slate-700">
                  Jenis Kelamin
                </span>
                <span>:</span>
                <span className="truncate">{data.gender || "xxxxxx"}</span>
              </div>
              <div className="grid grid-cols-[66px_4px_1fr] items-start pr-12">
                <span className="font-semibold text-slate-700">
                  Asal Sekolah
                </span>
                <span>:</span>
                <span
                  className="font-semibold uppercase truncate"
                  title={data.school}
                >
                  {data.school || "xxxxxxxxx"}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Right Elements */}
          <div className="absolute bottom-2 right-2 flex items-end gap-1.5">
            {/* QR Code */}
            <div className="bg-white p-0.5 shadow-sm border border-slate-200 rounded-sm">
              {data.nisn ? (
                <QRCode
                  value={`https://nisn.data.kemendikdasmen.go.id`}
                  size={42}
                  level="L"
                  viewBox={`0 0 42 42`}
                />
              ) : (
                <div className="w-[42px] h-[42px] bg-slate-100" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const NisnCardBack = forwardRef<HTMLDivElement, {}>((_, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white print-exact-size shrink-0 rounded-md overflow-hidden relative flex flex-col"
      style={{
        width: "8.56cm",
        height: "5.398cm",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white flex items-center justify-between px-3 py-1.5 border-b-2 border-yellow-400 z-20 relative">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="bg-white p-0.5 rounded-full flex items-center justify-center shrink-0 w-[7mm] h-[7mm]">
            <img
              src="/tut_wuri_handayani_color.png"
              alt="Logo Kemdikbud"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <h1 className="text-[8px] font-bold leading-tight uppercase tracking-wide m-0 p-0">
              Kementerian Pendidikan Dasar dan Menengah
            </h1>
            <h2 className="text-[8px] tracking-widest font-medium leading-none text-blue-100 m-0 p-0">
              Republik Indonesia
            </h2>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-2.5 text-center">
        {/* Background styling to mimic official card */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-emerald-50 to-amber-100 opacity-60 z-0" />

        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] z-0 pointer-events-none">
          <img
            src="/tut_wuri_handayani.png"
            alt=""
            className="w-32 h-32 object-contain grayscale -translate-y-4"
          />
        </div>

        <div className="relative z-10 w-full">
          <h3 className="font-bold text-slate-800 text-[11px] mb-2 border-b-2 border-blue-600 pb-1 inline-block">
            KETENTUAN PENGGUNAAN KARTU
          </h3>

          <ol className="text-[8.7px] tracking-tight text-slate-700 text-left list-decimal pl-3 pr-0 space-y-1 font-medium leading-snug w-full mx-auto">
            <li>
              Kartu ini diterbitkan sebagai tanda pengenal identitas siswa
              secara nasional.
            </li>
            <li>
              Kartu ini berlaku selama yang bersangkutan berstatus sebagai siswa
              aktif.
            </li>
            <li>
              Apabila menemukan kartu ini, mohon kesediaannya untuk
              mengembalikan ke sekolah yang bersangkutan atau Dinas Pendidikan
              setempat.
            </li>
            <li>
              Kartu tidak boleh dipindahtangankan atau digunakan oleh orang
              lain.
            </li>
          </ol>

          <div className="mt-3 text-[8px] text-slate-500 font-semibold uppercase tracking-wider">
            Portal Informasi NISN Resmi:
            <br />
            <span className="text-blue-600 lowercase tracking-normal text-[9px] font-bold mt-0.5 inline-block">
              nisn.data.kemendikdasmen.go.id
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

NisnCard.displayName = "NisnCard";

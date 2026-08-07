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
  schoolLogoUrl: string;
  district: string;
  regency: string;
  photoUrl: string;
}

export type StudentData = Pick<NisnData, "nisn" | "name" | "pob" | "dob" | "gender" | "photoUrl">;

interface NisnCardProps {
  data: NisnData;
}

export const NisnCard = forwardRef<HTMLDivElement, NisnCardProps>(({ data }, ref) => {
  const formattedDob = (() => {
    if (!data.dob) return "";
    try {
      // Check if it's an Excel serial date number
      if (typeof data.dob === 'number' || (!isNaN(Number(data.dob)) && String(data.dob).length > 4)) {
        const excelDate = Number(data.dob);
        if (excelDate > 10000) {
          const date = new Date((excelDate - 25569) * 86400 * 1000);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
          }
        }
      }

      // Try normal JS Date parsing
      const parsedDate = new Date(data.dob);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      }

      // If all fails, return exactly what they typed
      return String(data.dob);
    } catch (e) {
      return String(data.dob);
    }
  })();

  const formattedIssueDate = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

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
      <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-emerald-50 to-amber-100 opacity-60 z-0" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="bg-[#173B8F] bg-linear-to-b from-[#1c45a6] to-[#173B8F] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-white flex items-center px-3 py-1.5 gap-2 relative z-10 border-b-2 border-[#ECA521] overflow-hidden">
          {/* Subtle Guilloche Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none mix-blend-overlay z-0"
            viewBox="0 0 300 50"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" stroke="white" strokeWidth="0.5">
              <path d="M0,25 C50,0 100,50 150,25 C200,0 250,50 300,25" />
              <path d="M0,25 C50,5 100,45 150,25 C200,5 250,45 300,25" />
              <path d="M0,25 C50,10 100,40 150,25 C200,10 250,40 300,25" />
              <path d="M0,25 C50,15 100,35 150,25 C200,15 250,35 300,25" />
              <path d="M0,25 C50,50 100,0 150,25 C200,50 250,0 300,25" />
              <path d="M0,25 C50,45 100,5 150,25 C200,45 250,5 300,25" />
              <path d="M0,25 C50,40 100,10 150,25 C200,40 250,10 300,25" />
              <path d="M0,25 C50,35 100,15 150,25 C200,35 250,15 300,25" />
            </g>
          </svg>
          <div className="flex items-center gap-2.5 relative z-10 w-full">
            {/* Logo */}
            <div className="bg-white p-0.5 rounded-full flex items-center justify-center shrink-0 w-[8mm] h-[8mm] overflow-hidden">
              {data.schoolLogoUrl ? (
                <img
                  src={data.schoolLogoUrl}
                  alt="Logo Sekolah"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 rounded-full" />
              )}
            </div>
            <div className="flex flex-col max-w-[7cm] justify-center">
              <div className="flex flex-col w-fit items-start">
                <h1 className="text-[12px] font-bold leading-[1] uppercase tracking-wider line-clamp-2 break-words">
                  {data.school || "NAMA SEKOLAH"}
                </h1>
                <div className="h-[1px] w-full bg-[#4a72c9] my-0.5" />
              </div>
              <h2 className="text-[7.5px] font-medium text-white/90 truncate tracking-wide leading-[1.2]">
                {data.district || "Kecamatan"} — {data.regency || "Kabupaten"}
              </h2>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-1 flex p-2 gap-3 relative overflow-hidden">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] z-0 pointer-events-none left-36 top-10">
            <img
              src="/tut_wuri_handayani.png"
              alt=""
              className="w-32 h-32 object-contain grayscale"
            />
          </div>

          {/* Abstract Corner Waves */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Bottom-left sweeping waves */}
            <svg
              className="absolute bottom-0 left-0 w-32 h-32 opacity-[0.7]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,100 L0,30 Q40,50 100,100 Z"
                fill="#2563eb"
                opacity="0.05"
              />
              <path
                d="M0,100 L0,50 Q50,70 80,100 Z"
                fill="#059669"
                opacity="0.04"
              />
              <path
                d="M0,100 L0,20 Q60,40 100,100 Z"
                fill="none"
                stroke="#2563eb"
                strokeWidth="0.8"
                opacity="0.15"
              />
              <path
                d="M0,100 L0,40 Q50,50 90,100 Z"
                fill="none"
                stroke="#d97706"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </svg>
            {/* Top-right sweeping waves */}
            <svg
              className="absolute top-0 right-0 w-28 h-28 opacity-[0.7]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100,0 L100,70 Q60,50 0,0 Z"
                fill="#2563eb"
                opacity="0.05"
              />
              <path
                d="M100,0 L100,50 Q50,30 20,0 Z"
                fill="#059669"
                opacity="0.04"
              />
              <path
                d="M100,0 L100,80 Q40,60 0,0 Z"
                fill="none"
                stroke="#2563eb"
                strokeWidth="0.8"
                opacity="0.15"
              />
              <path
                d="M100,0 L100,60 Q50,50 10,0 Z"
                fill="none"
                stroke="#d97706"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </svg>
          </div>

          {/* Left Column: Photo */}
          <div className="flex flex-col items-center justify-center w-[2cm] shrink-0 h-full relative z-10">
            {/* Photo 3x4 aspect ratio placeholder */}
            <div className="w-[2cm] h-[2.67cm] bg-white rounded shrink-0 flex items-center justify-center relative border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-[1px]">
              <div className="w-full h-full bg-slate-200/80 rounded-[3px] overflow-hidden flex flex-col items-center justify-center relative">
                {data.photoUrl ? (
                  <img
                    src={data.photoUrl}
                    alt="Pas Foto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 mb-0.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="text-[6px] font-semibold uppercase tracking-widest">
                      Foto 3x4
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Data */}
          <div className="flex-1 flex flex-col relative z-10">
            <div className="text-center w-full mb-1.5 border-b border-[#173B8F] pb-1">
              <h3 className="text-[12px] font-black text-[#173B8F] uppercase tracking-widest leading-none mb-0.5">
                KARTU NISN
              </h3>
              <h4 className="text-[7.5px] font-bold text-blue-900 uppercase tracking-wider leading-none">
                Nomor Induk Siswa Nasional
              </h4>
            </div>

            <div className="text-md font-black text-[#173B8F] tracking-wider">
              {data.nisn
                ? data.nisn.match(/.{1,4}/g)?.join(" ")
                : "XXXX XXXX XX"}
            </div>

            <div className="flex flex-col gap-0.5 text-[8px] text-slate-900 mt-1">
              <div className="grid grid-cols-[66px_4px_1fr] items-start">
                <span className="text-slate-700">
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
                <span className="text-slate-700">
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
                <span className="text-slate-700">
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
                <span className="text-slate-700">
                  Jenis Kelamin
                </span>
                <span>:</span>
                <span className="truncate">{data.gender || "xxxxxx"}</span>
              </div>

              <div className="grid grid-cols-[66px_4px_1fr] items-start pr-12">
                <span className="text-slate-700">
                  Diterbitkan
                </span>
                <span>:</span>
                <span className="truncate capitalize">
                  {formattedIssueDate}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code and Verification Text */}
          <div className="absolute bottom-1.5 right-2 flex flex-col items-center gap-0.5">
            <div className="bg-white p-0.5 shadow-sm border border-slate-200 rounded-sm mb-0.5">
              {data.nisn?.length === 10 &&
              data.name &&
              data.pob &&
              data.dob &&
              data.gender ? (
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
            <span className="text-[7px] text-slate-500 font-semibold tracking-tight whitespace-nowrap">
              Scan di sini
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export const NisnCardBack = forwardRef<HTMLDivElement, NisnCardProps>(({ data }, ref) => {
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
      {/* Background styling to mimic official card */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-emerald-50 to-amber-100 opacity-30 z-0" />

      {/* Header */}
      <div className="bg-[#173B8F] bg-linear-to-b from-[#1c45a6] to-[#173B8F] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-white flex items-center px-3 py-1.5 border-b-2 border-[#ECA521] z-20 relative overflow-hidden">
        {/* Subtle Guilloche Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none mix-blend-overlay z-0"
          viewBox="0 0 300 50"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" stroke="white" strokeWidth="0.5">
            <path d="M0,25 C50,0 100,50 150,25 C200,0 250,50 300,25" />
            <path d="M0,25 C50,5 100,45 150,25 C200,5 250,45 300,25" />
            <path d="M0,25 C50,10 100,40 150,25 C200,10 250,40 300,25" />
            <path d="M0,25 C50,15 100,35 150,25 C200,15 250,35 300,25" />
            <path d="M0,25 C50,50 100,0 150,25 C200,50 250,0 300,25" />
            <path d="M0,25 C50,45 100,5 150,25 C200,45 250,5 300,25" />
            <path d="M0,25 C50,40 100,10 150,25 C200,40 250,10 300,25" />
            <path d="M0,25 C50,35 100,15 150,25 C200,35 250,15 300,25" />
          </g>
        </svg>
        <div className="flex items-center gap-2.5 relative z-10 w-full">
          {/* Logo */}
          <div className="bg-white p-0.5 rounded-full flex items-center justify-center shrink-0 w-[8mm] h-[8mm] overflow-hidden">
            {data?.schoolLogoUrl ? (
              <img
                src={data.schoolLogoUrl}
                alt="Logo Sekolah"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 rounded-full" />
            )}
          </div>
          <div className="flex flex-col max-w-[7cm] justify-center">
            <div className="flex flex-col w-fit items-start">
              <h1 className="text-[12px] font-bold leading-[1] uppercase tracking-wider m-0 p-0 line-clamp-2 break-words">
                {data?.school || "NAMA SEKOLAH"}
              </h1>
              <div className="h-[1px] w-full bg-[#4a72c9] my-0.5" />
            </div>
            <h2 className="text-[7.5px] font-medium text-white/90 m-0 p-0 truncate tracking-wide leading-[1.2]">
              {data?.district || "Kecamatan"} — {data?.regency || "Kabupaten"}
            </h2>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center px-2.5 text-center">
        {/* Abstract Corner Waves */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Top-left sweeping waves */}
          <svg
            className="absolute top-0 left-0 w-32 h-32 opacity-100"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 L0,70 Q40,50 100,0 Z" fill="#2563eb" opacity="0.08" />
            <path d="M0,0 L0,50 Q50,30 80,0 Z" fill="#059669" opacity="0.07" />
            <path
              d="M0,0 L0,80 Q60,60 100,0 Z"
              fill="none"
              stroke="#2563eb"
              strokeWidth="0.8"
              opacity="0.25"
            />
            <path
              d="M0,0 L0,60 Q50,50 90,0 Z"
              fill="none"
              stroke="#d97706"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </svg>
          {/* Bottom-right sweeping waves */}
          <svg
            className="absolute bottom-0 right-0 w-32 h-32 opacity-100"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100,100 L100,30 Q60,50 0,100 Z"
              fill="#2563eb"
              opacity="0.08"
            />
            <path
              d="M100,100 L100,50 Q50,70 20,100 Z"
              fill="#059669"
              opacity="0.07"
            />
            <path
              d="M100,100 L100,20 Q60,40 0,100 Z"
              fill="none"
              stroke="#2563eb"
              strokeWidth="0.8"
              opacity="0.25"
            />
            <path
              d="M100,100 L100,40 Q50,50 10,100 Z"
              fill="none"
              stroke="#d97706"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </svg>
        </div>
        {/* Background styling to mimic official card */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-emerald-50 to-amber-100 opacity-60 z-0" />

        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] z-0 pointer-events-none">
          <img
            src="/tut_wuri_handayani.png"
            alt=""
            className="w-32 h-32 object-contain grayscale"
          />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-fit flex flex-col items-center">
            <h3 className="font-bold text-[#173B8F] text-[11px] mb-0.5">
              KETENTUAN PENGGUNAAN KARTU
            </h3>
            <div className="border-t border-[#173B8F] w-full mb-1.5" />
            <ol className="text-[8.7px] tracking-tight text-slate-700 text-left list-decimal pl-3 pr-0 space-y-1 font-medium leading-snug w-full">
              <li>Kartu sebagai identitas siswa.</li>
              <li>Berlaku selama siswa masih aktif.</li>
              <li>
                Jika ditemukan, mohon dikembalikan ke sekolah atau Dinas
                Pendidikan.
              </li>
              <li>Tidak boleh dipindahtangankan.</li>
            </ol>
          </div>

          <div className="mt-4 text-[8px] text-slate-500 font-semibold uppercase tracking-wider">
            Portal Verifikasi NISN:
            <br />
            <span className="text-[#173B8F] italic lowercase tracking-normal text-[9px] font-bold mt-0.5 inline-block">
              nisn.data.kemendikdasmen.go.id
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

NisnCard.displayName = "NisnCard";

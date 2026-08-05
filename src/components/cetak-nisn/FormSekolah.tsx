import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { NisnData } from "./NisnCard";
import { RefObject } from "react";

interface FormSekolahProps {
  data: NisnData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  schoolLogoName: string;
  schoolLogoInputRef: RefObject<HTMLInputElement | null>;
  handleSchoolLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormSekolah({
  data,
  handleChange,
  schoolLogoName,
  schoolLogoInputRef,
  handleSchoolLogoUpload,
}: FormSekolahProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">
          Nama Sekolah
        </label>
        <div className="relative">
          <Input
            name="school"
            value={data.school}
            onChange={handleChange}
            placeholder="Contoh: UPTD SDN 2 KALIMATI"
            className={cn(
              "bg-white hover:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all text-sm placeholder:text-slate-400 pr-9",
              data.school ? "border-emerald-400" : "border-slate-300",
            )}
          />
          {data.school && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">
          Logo Sekolah
        </label>
        <div className="flex gap-4 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => schoolLogoInputRef.current?.click()}
            title={schoolLogoName || "Unggah Logo Sekolah"}
            className={cn(
              "w-full border transition-all h-9 shadow-none truncate px-4",
              schoolLogoName
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 border-solid"
                : "border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50",
            )}
          >
            <Upload className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">
              {schoolLogoName || "Unggah Logo Sekolah"}
            </span>
          </Button>
          <input
            type="file"
            ref={schoolLogoInputRef}
            onChange={handleSchoolLogoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">
          Kecamatan
        </label>
        <div className="relative">
          <Input
            name="district"
            value={data.district}
            onChange={handleChange}
            placeholder="Contoh: Jatibarang"
            className={cn(
              "bg-white hover:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all text-sm placeholder:text-slate-400 pr-9",
              data.district ? "border-emerald-400" : "border-slate-300",
            )}
          />
          {data.district && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">
          Kabupaten / Kota
        </label>
        <div className="relative">
          <Input
            name="regency"
            value={data.regency}
            onChange={handleChange}
            placeholder="Contoh: Indramayu"
            className={cn(
              "bg-white hover:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all text-sm placeholder:text-slate-400 pr-9",
              data.regency ? "border-emerald-400" : "border-slate-300",
            )}
          />
          {data.regency && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

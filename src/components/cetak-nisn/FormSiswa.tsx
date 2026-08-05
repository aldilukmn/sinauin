import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Upload, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NisnData } from "./NisnCard";
import { RefObject, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSiswaProps {
  data: NisnData;
  setData: (data: NisnData) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormSiswa({
  data,
  setData,
  handleChange,
  fileName,
  fileInputRef,
  handlePhotoUpload,
}: FormSiswaProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="space-y-5 flex flex-col grow">
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
          <label className="text-sm text-slate-700 block mb-1">
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
          <label className="text-sm text-slate-700 block mb-1">
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
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
              className={cn(
                "flex w-full min-w-0 h-8 px-2.5 py-1 text-sm font-normal rounded-lg border bg-white hover:bg-white hover:border-blue-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all shadow-none items-center justify-between text-left overflow-hidden placeholder:text-slate-400",
                data.dob ? "border-emerald-400" : "border-slate-300",
                !data.dob && "text-slate-500",
              )}
            >
              <span className="truncate flex-1">
                {data.dob
                  ? format(new Date(data.dob), "d MMMM yyyy", { locale: id })
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
                defaultMonth={data.dob ? new Date(data.dob) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const offset = date.getTimezoneOffset();
                    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
                    setData({
                      ...data,
                      dob: adjustedDate.toISOString().split("T")[0],
                    });
                    setIsCalendarOpen(false);
                  } else {
                    setData({ ...data, dob: "" });
                  }
                }}
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
              onValueChange={(value) => setData({ ...data, gender: value || "" })}
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
            Pas Foto (Rasio 3x4)
          </label>
          <div className="flex gap-4 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              title={fileName || "Unggah Foto"}
              className={cn(
                "w-full border transition-all h-8 shadow-none truncate px-4",
                fileName
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 border-solid"
                  : "border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50",
              )}
            >
              <Upload className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">{fileName || "Unggah Foto"}</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

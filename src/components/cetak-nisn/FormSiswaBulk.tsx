import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, AlertCircle, FileSpreadsheet, Users, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { StudentData } from "./NisnCard";

interface FormSiswaBulkProps {
  bulkStudents: StudentData[];
  setBulkStudents: (students: StudentData[]) => void;
  fileName: string;
  setFileName: (name: string) => void;
  photoCount: number;
}

export function FormSiswaBulk({
  bulkStudents,
  setBulkStudents,
  fileName,
  setFileName,
  photoCount,
}: FormSiswaBulkProps) {
  const csvInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws) as any[];

        // Try to find the correct column headers, making it somewhat resilient
        const mappedStudents: StudentData[] = parsedData.map((row) => {
          // Find keys case-insensitively or with variations
          const keys = Object.keys(row);
          const getVal = (possibleKeys: string[]) => {
            const key = keys.find(k => possibleKeys.some(pk => k.toLowerCase().includes(pk.toLowerCase())));
            return key ? row[key] : "";
          };

          return {
            nisn: getVal(["nisn", "induk"]),
            name: getVal(["nama", "name"]),
            pob: getVal(["tempat", "lahir", "pob"]),
            dob: getVal(["tanggal", "tgl", "dob", "date"]),
            gender: getVal(["jenis", "kelamin", "gender", "jk"]),
            photoUrl: "", // Handled by photo upload
          };
        }).filter(s => s.nisn || s.name); // Filter out completely empty rows

        if (mappedStudents.length === 0) {
          setError("Gagal membaca data. Pastikan format Excel memiliki header seperti NISN, Nama, dll.");
        } else if (mappedStudents.length > 100) {
          setError("Data terlalu banyak! Maksimal 100 siswa per file Excel untuk mencegah browser macet.");
        } else {
          // Preserve existing photo URLs if any, matched by NISN
          const existingPhotos = new Map(bulkStudents.filter(s => s.photoUrl).map(s => [s.nisn, s.photoUrl]));
          const studentsWithPhotos = mappedStudents.map(s => ({
            ...s,
            photoUrl: existingPhotos.get(s.nisn) || ""
          }));
          
          setBulkStudents(studentsWithPhotos);
        }
      } catch (err: any) {
        setError("Error parsing Excel: " + err.message);
      }
    };
    reader.onerror = () => {
      setError("Error membaca file.");
    };
    reader.readAsBinaryString(file);
  };

  const handlePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 100) {
      toast.error("Terlalu banyak foto! Anda maksimal hanya bisa mengunggah 100 foto sekaligus.");
      if (photosInputRef.current) photosInputRef.current.value = '';
      return;
    }

    if (bulkStudents.length === 0) {
      toast.error("Harap unggah file Excel (Data Siswa) terlebih dahulu sebelum mengunggah foto!");
      if (photosInputRef.current) photosInputRef.current.value = '';
      return;
    }
    
    // Map existing students, adding photos by NISN
    const updatedStudents = [...bulkStudents];
    let matchCount = 0;
    const oversizedFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;

      // Assuming filename is something like "1234567890.jpg"
      const nisnFromFileName = file.name.split('.')[0];
      
      const studentIndex = updatedStudents.findIndex(s => s.nisn === nisnFromFileName);
      if (studentIndex !== -1) {
        // If photo belongs to a valid student, check size
        if (file.size > 2 * 1024 * 1024) {
          oversizedFiles.push(file.name);
          return;
        }

        updatedStudents[studentIndex] = {
          ...updatedStudents[studentIndex],
          photoUrl: URL.createObjectURL(file)
        };
        matchCount++;
      }
    });

    if (matchCount > 0) {
      toast.success(`${matchCount} foto berhasil dipetakan ke data siswa!`);
    }

    if (oversizedFiles.length > 0) {
      toast.warning(`Sebanyak ${oversizedFiles.length} foto ditolak karena melebihi 2MB. Siswa terkait tidak mendapat foto.`, {
        duration: 6000,
      });
    }

    setBulkStudents(updatedStudents);
    
    // reset input
    if (photosInputRef.current) {
      photosInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const ws_data = [
      ["NISN", "Nama", "Tempat Lahir", "Tanggal Lahir", "Jenis Kelamin"],
      ["0123456789", "Budi Santoso", "Jakarta", "2010-05-15", "Laki-laki"],
      ["0123456790", "Siti Aminah", "Bandung", "2010-08-20", "Perempuan"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataSiswa");
    XLSX.writeFile(wb, "Template_Data_Siswa.xlsx");
  };

  return (
    <div className="space-y-6 flex flex-col grow">
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-slate-600">
        <div className="flex items-center justify-between mb-2">
          <strong className="text-slate-900 block">Cara Cetak Massal:</strong>
          <Button onClick={handleDownloadTemplate} variant="outline" size="sm" className="h-7 text-xs bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
            <Download className="w-3 h-3 mr-1" /> Unduh Template Excel
          </Button>
        </div>
        <ol className="list-decimal pl-5 space-y-1 text-xs">
          <li>Unduh dan isi template Excel di atas, atau siapkan data Excel (.xlsx) dengan format kolom serupa.</li>
          <li>Pastikan tidak ada baris kosong di antara baris data.</li>
          <li>Untuk foto, beri nama file foto sesuai NISN (misal: <code className="bg-white px-1 py-0.5 rounded border">0123456789.jpg</code>), lalu unggah semua foto sekaligus.</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">
            Unggah File Excel (.xlsx)
          </label>
          <div className="flex gap-4 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => csvInputRef.current?.click()}
              title={fileName || "Pilih File Excel"}
              className={cn(
                "w-full border transition-all h-10 shadow-none truncate px-4",
                fileName
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 border-solid"
                  : "border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50",
              )}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">{fileName || "Pilih File Excel"}</span>
            </Button>
            <input
              type="file"
              ref={csvInputRef}
              onChange={handleExcelUpload}
              accept=".xlsx, .xls"
              className="hidden"
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">
            Unggah Banyak Foto
          </label>
          <div className="flex gap-4 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => photosInputRef.current?.click()}
              title={photoCount > 0 ? `${photoCount} Foto Diunggah` : "Pilih Semua Foto"}
              className={cn(
                "w-full border transition-all h-10 shadow-none truncate px-4",
                photoCount > 0
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 border-solid"
                  : "border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50",
              )}
            >
              <Upload className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">{photoCount > 0 ? `${photoCount} Foto Terpetakan` : "Pilih Semua Foto"}</span>
            </Button>
            <input
              type="file"
              ref={photosInputRef}
              onChange={handlePhotosUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
        </div>
      </div>

      {bulkStudents.length > 0 && (
        <div className="flex-1 flex flex-col border border-slate-200 rounded-xl overflow-hidden min-h-[200px]">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center shrink-0">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Users className="w-4 h-4"/> Data Pratinjau ({bulkStudents.length} Siswa)
            </span>
          </div>
          <div className="overflow-y-auto max-h-[300px]">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 bg-white sticky top-0 border-b border-slate-200 shadow-sm z-10">
                <tr>
                  <th scope="col" className="px-4 py-2 font-medium">NISN</th>
                  <th scope="col" className="px-4 py-2 font-medium">Nama</th>
                  <th scope="col" className="px-4 py-2 font-medium text-center">Foto</th>
                </tr>
              </thead>
              <tbody>
                {bulkStudents.map((s, idx) => (
                  <tr key={idx} className="bg-white border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono text-xs">{s.nisn || "-"}</td>
                    <td className="px-4 py-2 font-medium text-slate-900">{s.name || "-"}</td>
                    <td className="px-4 py-2 text-center">
                      {s.photoUrl ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

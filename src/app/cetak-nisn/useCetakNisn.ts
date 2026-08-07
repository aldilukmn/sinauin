import { useState, useRef, useCallback, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import { toast } from "sonner";
import { NisnData, StudentData } from "@/components/cetak-nisn/NisnCard";

export function useCetakNisn() {
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
  const [printCount, setPrintCount] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const schoolLogoInputRef = useRef<HTMLInputElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCounter = () => {
      fetch('/api/counter')
        .then(res => res.json())
        .then(data => {
          const parsedCount = Number(data.count);
          if (!isNaN(parsedCount)) {
            setPrintCount(parsedCount);
          }
        })
        .catch(err => console.error("Failed to fetch print count:", err));
    };

    fetchCounter();
    const intervalId = setInterval(fetchCounter, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleModeSwitch = (mode: "single" | "bulk") => {
    if (printMode === mode) return;
    setIsChangingMode(true);
    setPrintMode(mode);
    setTimeout(() => {
      setIsChangingMode(false);
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;

    if (e.target.name === "nisn") {
      value = value.replace(/\D/g, "");
    }

    if (e.target.name === "name" || e.target.name === "pob") {
      value = value.replace(/[^a-zA-Z\s.,'-]/g, "");
    }

    setData(prev => ({
      ...prev,
      [e.target.name]: value,
    }));
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
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (schoolLogoInputRef.current) schoolLogoInputRef.current.value = "";
    
    toast.success("Formulir berhasil direset!", { id: "reset-toast" });
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
    data.photoUrl
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
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran logo terlalu besar! Maksimal 2MB.");
        if (schoolLogoInputRef.current) schoolLogoInputRef.current.value = "";
        return;
      }
      setSchoolLogoName(file.name);
      const url = URL.createObjectURL(file);
      setData(prev => ({ ...prev, schoolLogoUrl: url }));
      toast.success("Logo sekolah berhasil diunggah!");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error(
          "Format file tidak didukung! Harap unggah file gambar (JPG / JPEG atau PNG).",
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran foto terlalu besar! Maksimal 2MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setData(prev => ({ ...prev, photoUrl: url }));
      toast.success("Foto berhasil diunggah!");
    }
  };

  // Extract track print to a pure, reusable function
  const trackPrint = async (nisnList: string[]) => {
    const originalCount = printCount;
    setPrintCount(prev => (prev || 0) + nisnList.length);
    
    try {
      const response = await fetch('/api/counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisnList }),
      });
      const resData = await response.json();
      
      if (resData.success && typeof resData.count === 'number') {
         setPrintCount(resData.count);
      }
    } catch (err) {
      console.error("Failed to update counter:", err);
      setPrintCount(originalCount);
    }
  };

  const handleBulkPrint = useCallback(async () => {
    const nisns = bulkStudents.length > 0 
      ? bulkStudents.map(s => s.nisn || "0000000000") 
      : ["bulk_test_nisn"];
      
    await trackPrint(nisns);
    
    setTimeout(() => {
      const originalTitle = document.title;
      const studentCount = bulkStudents.length > 0 ? bulkStudents.length : 1;
      const safeSchoolName = data.school ? data.school : "Sekolah";
      document.title = `Kartu NISN_${studentCount} siswa_${safeSchoolName}`;
      
      window.print();
      
      document.title = originalTitle;
    }, 100);
  }, [bulkStudents, data.school]);

  const handleSinglePrint = useCallback(async () => {
    if (printContainerRef.current === null) return;

    try {
      const exportOptions = {
        quality: 1.0,
        pixelRatio: 4,
      };

      const dataUrl = await htmlToImage.toPng(
        printContainerRef.current,
        exportOptions,
      );

      const nisnFormat = data.nisn ? data.nisn : "nisn";
      const nameFormat = data.name ? data.name : "nama";
      const baseFileName = `Kartu NISN_${nisnFormat}_${nameFormat}`.replace(/\s+/g, "_");

      const link = document.createElement("a");
      link.download = `${baseFileName}.png`;
      link.href = dataUrl;
      link.click();
      
      const trackNisn = data.nisn ? data.nisn : "0000000000";
      await trackPrint([trackNisn]);
      toast.success("Kartu berhasil diunduh!");
    } catch (err) {
      console.error("Oops, something went wrong!", err);
      toast.error("Gagal mengunduh kartu. Silakan coba lagi.");
    }
  }, [data.nisn, data.name]);

  const handlePrint = useCallback(async () => {
    if (printMode === "bulk") {
      await handleBulkPrint();
    } else {
      await handleSinglePrint();
    }
  }, [printMode, handleBulkPrint, handleSinglePrint]);

  return {
    data,
    setData,
    isCalendarOpen,
    setIsCalendarOpen,
    isFlipped,
    setIsFlipped,
    fileName,
    setFileName,
    schoolLogoName,
    setSchoolLogoName,
    activeTab,
    setActiveTab,
    showMobilePreview,
    setShowMobilePreview,
    printMode,
    setPrintMode,
    isChangingMode,
    setIsChangingMode,
    bulkStudents,
    setBulkStudents,
    csvFileName,
    setCsvFileName,
    printCount,
    setPrintCount,
    fileInputRef,
    schoolLogoInputRef,
    printContainerRef,
    isFormComplete,
    previewData,
    handleModeSwitch,
    handleChange,
    handleReset,
    handleSchoolLogoUpload,
    handlePhotoUpload,
    handlePrint,
    handleBulkPrint,
    handleSinglePrint
  };
}

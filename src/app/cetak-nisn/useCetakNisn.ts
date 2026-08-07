import { useState, useRef, useCallback, useEffect } from "react";
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
  const [paperSize, setPaperSize] = useState<"A4" | "F4">("A4");
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [bulkStudents, setBulkStudents] = useState<StudentData[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [printCount, setPrintCount] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const schoolLogoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Fetch Print Counter
    const fetchCounter = () => {
      fetch('/api/counter')
        .then(res => res.json())
        .then(resData => {
          const parsedCount = Number(resData.count);
          if (!isNaN(parsedCount)) {
            setPrintCount(parsedCount);
          }
        })
        .catch(err => console.error("Failed to fetch print count:", err));
    };

    fetchCounter();
    const intervalId = setInterval(fetchCounter, 3000);

    // 2. Load School Data from Local Storage
    const savedSchool = localStorage.getItem("sinauin_school");
    const savedDistrict = localStorage.getItem("sinauin_district");
    const savedRegency = localStorage.getItem("sinauin_regency");
    const savedLogo = localStorage.getItem("sinauin_logo");
    
    if (savedSchool || savedDistrict || savedRegency || savedLogo) {
      setData(prev => ({
        ...prev,
        school: savedSchool || prev.school,
        district: savedDistrict || prev.district,
        regency: savedRegency || prev.regency,
        schoolLogoUrl: savedLogo || prev.schoolLogoUrl,
      }));
    }

    return () => clearInterval(intervalId);
  }, []);

  // Save School Data to Local Storage whenever it changes
  useEffect(() => {
    if (data.school) localStorage.setItem("sinauin_school", data.school);
    if (data.district) localStorage.setItem("sinauin_district", data.district);
    if (data.regency) localStorage.setItem("sinauin_regency", data.regency);
    if (data.schoolLogoUrl) localStorage.setItem("sinauin_logo", data.schoolLogoUrl);
  }, [data.school, data.district, data.regency, data.schoolLogoUrl]);

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
    setData(prev => ({
      ...prev,
      nisn: "",
      name: "",
      pob: "",
      dob: "",
      gender: "",
      photoUrl: "",
      // Biarkan data sekolah (school, district, regency, schoolLogoUrl) tetap ada
    }));
    setFileName("");
    setBulkStudents([]);
    setCsvFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    toast.success("Formulir siswa berhasil direset!", { id: "reset-toast" });
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
    data.schoolLogoUrl
  ) : Boolean(
    data.school &&
    data.district &&
    data.regency &&
    data.schoolLogoUrl &&
    bulkStudents.length > 0
  );

  const previewData = printMode === 'bulk'
    ? (bulkStudents.length > 0
        ? { 
            ...bulkStudents[0], 
            school: data.school, 
            district: data.district, 
            regency: data.regency, 
            schoolLogoUrl: data.schoolLogoUrl 
          }
        : {
            nisn: "", name: "", pob: "", dob: "", gender: "", photoUrl: "",
            school: data.school, district: data.district, regency: data.regency, schoolLogoUrl: data.schoolLogoUrl
          })
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
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setData(prev => ({ ...prev, schoolLogoUrl: base64Url }));
        toast.success("Logo sekolah berhasil diunggah!");
      };
      reader.readAsDataURL(file);
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

  const latestPrintDataRef = useRef({ printMode, data, bulkStudents });
  useEffect(() => {
    latestPrintDataRef.current = { printMode, data, bulkStudents };
  }, [printMode, data, bulkStudents]);

  useEffect(() => {
    const handleBeforePrint = () => {
      const { printMode, data, bulkStudents } = latestPrintDataRef.current;
      
      if (printMode === "bulk") {
        const nisns = bulkStudents.length > 0 
          ? bulkStudents.map(s => s.nisn || "0000000000") 
          : ["bulk_test_nisn"];
        trackPrint(nisns);
      } else {
        const trackNisn = data.nisn ? data.nisn : "0000000000";
        trackPrint([trackNisn]);
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, []);

  const handleBulkPrint = useCallback(async () => {
    const originalTitle = document.title;
    const studentCount = bulkStudents.length > 0 ? bulkStudents.length : 1;
    const safeSchoolName = data.school ? data.school : "Sekolah";
    document.title = `Kartu NISN_${studentCount} siswa_${safeSchoolName}`;
    
    window.print();
    
    document.title = originalTitle;
  }, [bulkStudents, data.school]);

  const handlePrint = useCallback(async () => {
    if (printMode === "bulk") {
      await handleBulkPrint();
    } else {
      const originalTitle = document.title;
      const trackNisn = data.nisn ? data.nisn : "0000000000";
      const nameFormat = data.name ? data.name : "nama";
      document.title = `Kartu NISN_${trackNisn}_${nameFormat}`.replace(/\s+/g, "_");
      
      window.print();
      
      document.title = originalTitle;
    }
  }, [printMode, handleBulkPrint, data.nisn, data.name]);

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
    paperSize,
    setPaperSize,
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
    isFormComplete,
    previewData,
    handleModeSwitch,
    handleChange,
    handleReset,
    handleSchoolLogoUpload,
    handlePhotoUpload,
    handlePrint,
    handleBulkPrint,
  };
}

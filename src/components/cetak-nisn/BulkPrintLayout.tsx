import { NisnCard, NisnCardBack, StudentData, NisnData } from "./NisnCard";
import { cn } from "@/lib/utils";

interface BulkPrintLayoutProps {
  bulkStudents: StudentData[];
  schoolData: Pick<NisnData, "school" | "schoolLogoUrl" | "district" | "regency">;
}

export function BulkPrintLayout({ bulkStudents, schoolData }: BulkPrintLayoutProps) {
  if (bulkStudents.length === 0) return null;

  // We map the student data with the school data to form complete NisnData
  const completeCards: NisnData[] = bulkStudents.map(student => ({
    ...student,
    ...schoolData
  }));

  // Chunk array into groups of 4 to fit comfortably on A4 pages.
  // Although 5 cards theoretically fit, it leaves almost zero gap for cutting
  // and often gets sliced by browser's physical print margins.
  const cardsPerPage = 4;
  const pages = [];
  for (let i = 0; i < completeCards.length; i += cardsPerPage) {
    pages.push(completeCards.slice(i, i + cardsPerPage));
  }

  return (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] print:bg-white m-0 p-0">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      `}</style>
      
      {pages.map((pageCards, pageIdx) => (
        <div 
          key={pageIdx} 
          className={cn(
            "w-[210mm] h-[297mm] mx-auto bg-white p-8 flex flex-col justify-start",
            // Page break except for the last page
            pageIdx < pages.length - 1 ? "break-after-page" : ""
          )}
        >
          {/* We will render pairs of cards (Front and Back) row by row */}
          <div className="flex flex-col gap-y-8 items-center">
            {pageCards.map((card, idx) => (
              <div key={idx} className="flex gap-4 items-center justify-center w-full" style={{ pageBreakInside: 'avoid' }}>
                <NisnCard data={card} />
                <NisnCardBack data={card} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

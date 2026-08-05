import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function FormCard({ title, description, icon, children }: FormCardProps) {
  return (
    <Card className="bg-transparent rounded-2xl shadow-sm border-none ring-1 ring-slate-200 overflow-hidden flex flex-col p-0 gap-0 h-full">
      <CardHeader className="bg-blue-600 border-b border-blue-700 py-4 px-5 md:px-6 rounded-t-2xl shrink-0">
        <CardTitle className="text-lg flex items-center gap-2 text-white">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-blue-100/90 font-medium text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-5 md:p-6 space-y-5 rounded-b-2xl flex-1 flex flex-col">
        {children}
      </CardContent>
    </Card>
  );
}

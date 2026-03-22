import { Download, FileSpreadsheet, FileJson, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/export';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportButtonProps<T extends object> {
  data: T[];
  columns: { key: string; header: string }[];
  filename: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
}

export function ExportButton<T extends object>({
  data,
  columns,
  filename,
  variant = 'outline',
  size = 'default',
}: ExportButtonProps<T>) {
  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    if (data.length === 0) {
      toast({
        title: 'لا توجد بيانات',
        description: 'لا توجد بيانات للتصدير',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (type === 'csv') exportToCSV(data, columns, filename);
      else if (type === 'excel') exportToExcel(data, columns, filename);
      else if (type === 'pdf') exportToPDF(data, columns, filename, filename);

      toast({
        title: 'تم التصدير',
        description: `تم تصدير ${data.length} سجل بصيغة ${type.toUpperCase()} بنجاح`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'خطأ في التصدير',
        description: 'حدث خطأ أثناء محاولة تصدير الملف',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size === 'icon' ? 'icon' : size}
          className="gap-2"
        >
          {size === 'icon' ? <Download className="w-4 h-4" /> : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">تصدير</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 text-green-600" />
          <span>ملف Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2 cursor-pointer">
          <FileJson className="w-4 h-4 text-blue-600" />
          <span>ملف CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4 text-red-600" />
          <span>ملف PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

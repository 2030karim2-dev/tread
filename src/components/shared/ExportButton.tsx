import { Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/export';
import { toast } from '@/hooks/use-toast';

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
  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: 'لا توجد بيانات',
        description: 'لا توجد بيانات للتصدير',
        variant: 'destructive',
      });
      return;
    }

    exportToCSV(data, columns, filename);
    toast({
      title: 'تم التصدير',
      description: `تم تصدير ${data.length} سجل بنجاح`,
    });
  };

  if (size === 'icon') {
    return (
      <Button
        variant={variant}
        size="icon"
        onClick={handleExport}
        title="تصدير CSV"
        aria-label="تصدير CSV"
      >
        <Download className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      className="gap-2"
    >
      <FileSpreadsheet className="w-4 h-4" />
      <span className="hidden sm:inline">تصدير CSV</span>
    </Button>
  );
}

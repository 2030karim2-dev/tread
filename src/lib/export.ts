import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Re-declare autotable for TypeScript
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// CSV/Excel/PDF Export Utility

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCSV(
  data: any[],
  columns: { key: string; header: string }[],
  filename: string
): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create header row
  const headers = columns.map(col => col.header);
  
  // Create data rows
  const rows = data.map((item) => {
    return columns.map(col => {
      const value = item[col.key];
      // Handle different types
      if (value === null || value === undefined) return '';
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
      // Escape quotes and wrap in quotes if contains comma
      const strValue = String(value);
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    });
  });

  // Combine header and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Add BOM for proper Arabic display in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Excel Export Utility
export function exportToExcel(
  data: any[],
  columns: { key: string; header: string }[],
  filename: string
): void {
  if (data.length === 0) return;

  // Prepare data for sheets
  const worksheetData = [
    columns.map(col => col.header), // Headers
    ...data.map(item => columns.map(col => {
      const val = item[col.key];
      if (typeof val === 'boolean') return val ? 'نعم' : 'لا';
      return val ?? '';
    }))
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set RTL for the sheet
  if (!ws['!views']) ws['!views'] = [];
  ws['!views'].push({ RTL: true });

  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Export
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// PDF Export Utility (Table-based)
export function exportToPDF(
  data: any[],
  columns: { key: string; header: string }[],
  filename: string,
  title: string,
  metadata?: { companyName?: string; subTitle?: string; dateRange?: string }
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Adding Header Background (Subtle top bar)
  doc.setFillColor(63, 81, 181); // Brand Color (Indigo)
  doc.rect(0, 0, 210, 15, 'F');
  
  // Title & Company Info
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(metadata?.companyName || 'نظام إدارة الاستيراد والتريد', 10, 10);
  
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(18);
  doc.text(title, 105, 30, { align: 'center' });
  
  if (metadata?.subTitle) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(metadata.subTitle, 105, 38, { align: 'center' });
  }

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  const now = new Date().toLocaleString('ar-SA');
  doc.text(`تاريخ الإصدار: ${now}`, 10, 45);
  
  if (metadata?.dateRange) {
    doc.text(`الفترة: ${metadata.dateRange}`, 200, 45, { align: 'right' });
  }

  // Draw a horizontal line
  doc.setDrawColor(230, 230, 230);
  doc.line(10, 48, 200, 48);

  const tableData = data.map(item => columns.map(col => String(item[col.key] ?? '')));
  const tableHeaders = [columns.map(col => col.header)];

  doc.autoTable({
    head: tableHeaders,
    body: tableData,
    startY: 55,
    theme: 'grid',
    styles: { 
        font: 'helvetica', 
        halign: 'center', 
        fontSize: 10,
        cellPadding: 4,
        overflow: 'linebreak'
    },
    headStyles: { 
        fillColor: [63, 81, 181],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
    },
    alternateRowStyles: {
        fillColor: [245, 247, 250]
    },
    margin: { top: 55, left: 10, right: 10 }
  });

  // Footer with Page Number
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`صفحة ${i} من ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save(`${filename}.pdf`);
}

export function formatDateForExport(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  } catch {
    return dateString;
  }
}

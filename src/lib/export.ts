// CSV Export Utility

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

export function formatDateForExport(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  } catch {
    return dateString;
  }
}

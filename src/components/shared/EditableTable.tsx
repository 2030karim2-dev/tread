import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ColumnDef<T> {
  key: string;
  header: string;
  minWidth?: string;
  type?: 'text' | 'number' | 'custom';
  editable?: boolean;
  align?: 'left' | 'center' | 'right';
  mono?: boolean;
  render?: (row: T, index: number) => ReactNode;
}

interface EditableTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  onCellChange?: (id: string, field: string, value: string | number) => void;
  showRowNumbers?: boolean;
  footer?: ReactNode;
}

export function EditableTable<T extends { id: string }>({
  data,
  columns,
  onCellChange,
  showRowNumbers = true,
  footer,
}: EditableTableProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto"
    >
      <table className="w-full" style={{ minWidth: '700px' }}>
        <thead>
          <tr>
            {showRowNumbers && <th className="spreadsheet-header w-10">#</th>}
            {columns.map(col => (
              <th
                key={col.key}
                className="spreadsheet-header"
                style={{ minWidth: col.minWidth }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row.id} className="hover:bg-muted/30 transition-colors">
              {showRowNumbers && (
                <td className="spreadsheet-cell text-center text-muted-foreground font-mono text-xs">
                  {rowIdx + 1}
                </td>
              )}
              {columns.map(col => {
                // Custom render
                if (col.render) {
                  return (
                    <td key={col.key} className="spreadsheet-cell">
                      {col.render(row, rowIdx)}
                    </td>
                  );
                }

                const value = (row as Record<string, unknown>)[col.key];
                const editable = col.editable !== false;

                if (!editable) {
                  return (
                    <td
                      key={col.key}
                      className={`spreadsheet-cell text-sm ${col.align === 'center' ? 'text-center' : ''} ${col.mono ? 'font-mono' : ''}`}
                    >
                      {String(value ?? '')}
                    </td>
                  );
                }

                return (
                  <td key={col.key} className="spreadsheet-cell">
                    <input
                      className={`w-full bg-transparent focus:outline-none text-sm ${col.align === 'center' ? 'text-center' : ''} ${col.mono ? 'font-mono' : ''}`}
                      type={col.type === 'number' ? 'number' : 'text'}
                      value={col.type === 'number' ? (value as number || '') : String(value ?? '')}
                      onChange={e => {
                        const newValue = col.type === 'number' ? Number(e.target.value) : e.target.value;
                        onCellChange?.(row.id, col.key, newValue);
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </motion.div>
  );
}

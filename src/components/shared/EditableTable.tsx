import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

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
  onDeleteRow?: (id: string) => void;
  showRowNumbers?: boolean;
  footer?: ReactNode;
}

export function EditableTable<T extends { id: string }>({
  data,
  columns,
  onCellChange,
  onDeleteRow,
  showRowNumbers = true,
  footer,
}: EditableTableProps<T>) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIdx: number, colIdx: number) => {
    const inputs = document.querySelectorAll<HTMLInputElement>('.editable-table-input');
    const totalCols = columns.filter(c => c.editable !== false && !c.render).length;
    let targetIdx = -1;

    if (e.key === 'ArrowDown' || (e.key === 'Enter' && !e.shiftKey)) {
      e.preventDefault();
      targetIdx = ((rowIdx + 1) * totalCols) + colIdx;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetIdx = ((rowIdx - 1) * totalCols) + colIdx;
    } else if (e.key === 'Tab' && !e.shiftKey) {
      // Let default Tab handle it
      return;
    } else if (e.key === 'Tab' && e.shiftKey) {
      return;
    }

    if (targetIdx >= 0 && targetIdx < inputs.length) {
      inputs[targetIdx]?.focus();
      inputs[targetIdx]?.select();
    }
  };

  let inputIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto touch-pan-x"
    >
      <table className="w-full" style={{ minWidth: '700px' }}>
        <thead>
          <tr>
            {showRowNumbers && <th className="spreadsheet-header w-10">#</th>}
            {columns.map(col => (
              <th key={col.key} className="spreadsheet-header" style={{ minWidth: col.minWidth }}>
                {col.header}
              </th>
            ))}
            {onDeleteRow && <th className="spreadsheet-header w-10" />}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => {
            let editableColIdx = 0;
            return (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                {showRowNumbers && (
                  <td className="spreadsheet-cell text-center text-muted-foreground font-mono text-xs">
                    {rowIdx + 1}
                  </td>
                )}
                {columns.map(col => {
                  if (col.render) {
                    return <td key={col.key} className="spreadsheet-cell">{col.render(row, rowIdx)}</td>;
                  }

                  const value = (row as Record<string, unknown>)[col.key];
                  const editable = col.editable !== false;

                  if (!editable) {
                    return (
                      <td key={col.key} className={`spreadsheet-cell text-sm ${col.align === 'center' ? 'text-center' : ''} ${col.mono ? 'font-mono' : ''}`}>
                        {String(value ?? '')}
                      </td>
                    );
                  }

                  const currentColIdx = editableColIdx++;

                  return (
                    <td key={col.key} className="spreadsheet-cell">
                      <input
                        className={`editable-table-input w-full bg-transparent focus:outline-none text-sm ${col.align === 'center' ? 'text-center' : ''} ${col.mono ? 'font-mono' : ''}`}
                        type={col.type === 'number' ? 'number' : 'text'}
                        value={col.type === 'number' ? (value as number || '') : String(value ?? '')}
                        onChange={e => {
                          const newValue = col.type === 'number' ? Number(e.target.value) : e.target.value;
                          onCellChange?.(row.id, col.key, newValue);
                        }}
                        onKeyDown={e => handleKeyDown(e, rowIdx, currentColIdx)}
                      />
                    </td>
                  );
                })}
                {onDeleteRow && (
                  <td className="spreadsheet-cell text-center">
                    <button
                      onClick={() => onDeleteRow(row.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </motion.div>
  );
}

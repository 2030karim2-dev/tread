import { ReactNode, useCallback, useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export interface ColumnDef<T> {
  key: keyof T & string;
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
  /** For large datasets (>50 rows), enable virtualization. Default: auto (>100 rows) */
  virtualize?: boolean;
}

const ROW_HEIGHT = 41; // px — سماكة كل صف في الجداول

export function EditableTable<T extends { id: string }>({
  data,
  columns,
  onCellChange,
  onDeleteRow,
  showRowNumbers = true,
  footer,
  virtualize,
}: EditableTableProps<T>) {

  // ref للحاوية القابلة للتمرير (تُستخدم لمحرك الـ virtualizer)
  const scrollRef = useRef<HTMLDivElement>(null);
  // refs الخلايا للتنقل بالأسهم
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // Load saved widths from localStorage
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    try {
        const saved = localStorage.getItem('table_col_widths');
        return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const { key, startX, startWidth } = resizingRef.current;
      const delta = e.clientX - startX;
      const newWidth = Math.max(60, startWidth + delta);
      
      setColWidths(prev => ({ ...prev, [key]: newWidth }));
    };

    const handleMouseUp = () => {
      if (resizingRef.current) {
          localStorage.setItem('table_col_widths', JSON.stringify(colWidths));
      }
      resizingRef.current = null;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [colWidths]);

  const editableCols = columns.filter(c => c.editable !== false && !c.render);
  const totalCols = editableCols.length;

  // تفعيل الـ virtualization تلقائياً عند 100+ صف أو بشكل صريح
  const shouldVirtualize = virtualize ?? data.length > 100;

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
    enabled: shouldVirtualize,
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, rowIdx: number, colIdx: number) => {
    let targetRow = rowIdx;
    let targetCol = colIdx;

    if (e.key === 'ArrowDown' || (e.key === 'Enter' && !e.shiftKey)) {
      e.preventDefault(); targetRow = rowIdx + 1;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); targetRow = rowIdx - 1;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); targetCol = colIdx - 1;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); targetCol = colIdx + 1;
    } else { return; }

    if (targetRow < 0 || targetRow >= data.length) return;
    if (targetCol < 0 || targetCol >= totalCols) return;

    const target = inputRefs.current[targetRow]?.[targetCol];
    target?.focus();
    target?.select();
  }, [data.length, totalCols]);

  // ===== Renderer مشترك للصف =====
  const renderRow = (row: T, rowIdx: number) => {
    if (!inputRefs.current[rowIdx]) inputRefs.current[rowIdx] = [];
    let editableColIdx = 0;
    return (
      <tr key={row.id} className="group hover:bg-muted/40 transition-colors" style={{ height: ROW_HEIGHT }}>
        {showRowNumbers && (
          <td className="spreadsheet-cell text-center text-muted-foreground font-mono text-xs w-10">
            {rowIdx + 1}
          </td>
        )}
        {columns.map(col => {
          if (col.render) {
            return <td key={col.key} className="spreadsheet-cell">{col.render(row, rowIdx)}</td>;
          }
          const value = row[col.key as keyof T];
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
                ref={el => { if (inputRefs.current[rowIdx]) inputRefs.current[rowIdx]![currentColIdx] = el; }}
                className={`w-full bg-transparent focus:outline-none text-sm ${col.align === 'center' ? 'text-center' : ''} ${col.mono ? 'font-mono' : ''}`}
                type={col.type === 'number' ? 'number' : 'text'}
                value={col.type === 'number' ? ((value as number) || '') : String(value ?? '')}
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
          <td className="spreadsheet-cell text-center w-10">
            <button
              onClick={() => onDeleteRow(row.id)}
              aria-label="حذف الصف"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </td>
        )}
      </tr>
    );
  };

  return (
    <motion.div
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card/40 backdrop-blur-xl rounded-xl border border-border/50 shadow-card overflow-x-auto touch-pan-x custom-scrollbar"
      style={shouldVirtualize ? { maxHeight: '60vh', overflowY: 'auto' } : {}}
    >
      <table className="w-full" style={{ minWidth: '700px' }}>
        <thead className="sticky top-0 z-20 bg-card/80 backdrop-blur-md">
          <tr>
            {showRowNumbers && <th className="spreadsheet-header w-10">#</th>}
            {columns.map(col => (
              <th 
                key={col.key} 
                className="spreadsheet-header relative group/resizer" 
                style={{ width: colWidths[col.key] || col.minWidth || 'auto', minWidth: colWidths[col.key] || col.minWidth }}
              >
                <div className="truncate px-2">{col.header}</div>
                <div 
                  onMouseDown={(e) => {
                    const el = e.currentTarget.parentElement;
                    if (!el) return;
                    resizingRef.current = {
                      key: col.key,
                      startX: e.clientX,
                      startWidth: el.offsetWidth
                    };
                    document.body.style.cursor = 'col-resize';
                    document.body.style.userSelect = 'none';
                    e.preventDefault();
                  }}
                  className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 border-r border-primary/20 opacity-0 group-hover/resizer:opacity-100 transition-opacity z-30"
                />
              </th>
            ))}
            {onDeleteRow && <th className="spreadsheet-header w-10" />}
          </tr>
        </thead>
        <tbody>
          {shouldVirtualize ? (
            <>
              {/* Spacer شبحي في الأعلى */}
              {(() => {
                const items = rowVirtualizer.getVirtualItems();
                const first = items[0];
                if (first && first.start > 0) {
                  return (
                    <tr style={{ height: first.start }}>
                      <td colSpan={columns.length + (showRowNumbers ? 1 : 0) + (onDeleteRow ? 1 : 0)} />
                    </tr>
                  );
                }
                return null;
              })()}
              
              {rowVirtualizer.getVirtualItems().map(vRow =>
                renderRow(data[vRow.index]!, vRow.index)
              )}

              {/* Spacer شبحي في الأسفل */}
              {(() => {
                const items = rowVirtualizer.getVirtualItems();
                if (items.length === 0) return null;
                const last = items[items.length - 1];
                const totalSize = rowVirtualizer.getTotalSize();
                const remaining = last ? totalSize - last.end : 0;
                return remaining > 0 ? (
                  <tr style={{ height: remaining }}>
                    <td colSpan={columns.length + (showRowNumbers ? 1 : 0) + (onDeleteRow ? 1 : 0)} />
                  </tr>
                ) : null;
              })()}
            </>
          ) : (
            data.map((row, rowIdx) => renderRow(row, rowIdx))
          )}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </motion.div>
  );
}

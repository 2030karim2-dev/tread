import { STATUS_LABELS, STATUS_STYLES } from '@/constants';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold border ${STATUS_STYLES[status] || 'bg-muted text-muted-foreground border-border'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

import { STATUS_LABELS, STATUS_STYLES } from '@/constants';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] || 'bg-muted text-muted-foreground border-border'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

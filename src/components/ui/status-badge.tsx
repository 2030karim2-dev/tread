const statusStyles: Record<string, string> = {
  planning: 'bg-info/15 text-info border-info/30',
  active: 'bg-success/15 text-success border-success/30',
  completed: 'bg-muted text-muted-foreground border-border',
  purchased: 'bg-info/15 text-info border-info/30',
  at_warehouse: 'bg-warning/15 text-warning border-warning/30',
  shipped: 'bg-primary/15 text-primary border-primary/30',
  in_transit: 'bg-secondary/15 text-secondary border-secondary/30',
  arrived: 'bg-success/15 text-success border-success/30',
  delivered: 'bg-accent/15 text-accent border-accent/30',
};

const statusLabels: Record<string, string> = {
  planning: 'مخطط',
  active: 'جارية',
  completed: 'مكتملة',
  purchased: 'تم الشراء',
  at_warehouse: 'في المستودع',
  shipped: 'تم الشحن',
  in_transit: 'في الطريق',
  arrived: 'وصل الميناء',
  delivered: 'تم التسليم',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[status] || 'bg-muted text-muted-foreground border-border'}`}>
      {statusLabels[status] || status}
    </span>
  );
}

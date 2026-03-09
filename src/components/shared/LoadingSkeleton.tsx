export function LoadingSkeleton({ rows = 3, type = 'cards' }: { rows?: number; type?: 'cards' | 'table' }) {
  if (type === 'table') {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-pulse">
        <div className="h-10 bg-muted" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 border-t border-border flex gap-2 px-4 items-center">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 bg-muted rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-4 shadow-sm animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-5 bg-muted rounded-full w-16" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { GlowCard } from "./AnimatedWrappers";

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <GlowCard className="overflow-hidden">
      <div className="w-full">
        {/* Header */}
        <div className="flex border-b border-border/40 bg-muted/30 p-3">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 px-3">
              <Skeleton className="h-4 w-3/4 max-w-[80px]" />
            </div>
          ))}
        </div>
        
        {/* Rows */}
        <div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex border-b border-border/20 p-3 items-center">
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className="flex-1 px-3">
                  <Skeleton className={`h-4 ${j === 0 ? 'w-1/2' : 'w-full max-w-[120px]'}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}

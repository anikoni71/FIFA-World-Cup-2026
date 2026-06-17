import { Skeleton } from '@/components/ui/skeleton';

export function MatchCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px]">
          <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Skeleton className="h-6 w-4 sm:h-8 sm:w-6" />
          <span className="text-muted-foreground text-xs">:</span>
          <Skeleton className="h-6 w-4 sm:h-8 sm:w-6" />
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px]">
          <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>

      {/* Date + Venue */}
      <div className="flex flex-col items-center mt-3 space-y-1">
        <Skeleton className="h-2 w-24" />
        <Skeleton className="h-2 w-32" />
      </div>
    </div>
  );
}

export function MatchResultsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border/50" />
            <Skeleton className="h-3 w-32" />
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {[1, 2, 3, 4].map((i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

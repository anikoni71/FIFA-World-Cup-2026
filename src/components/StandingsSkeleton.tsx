import { Skeleton } from '@/components/ui/skeleton';

export function StandingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {[...Array(8)].map((_, i) => (
         <div key={i} className="bg-card border border-border rounded-xl p-4">
           {/* Group Header */}
           <div className="flex justify-between items-center mb-4">
             <Skeleton className="h-5 w-20" />
             <div className="flex gap-2">
               <Skeleton className="h-3 w-4" />
               <Skeleton className="h-3 w-4" />
               <Skeleton className="h-3 w-4" />
               <Skeleton className="h-3 w-4" />
               <Skeleton className="h-3 w-4" />
             </div>
           </div>
           
           {/* Teams */}
           <div className="space-y-3">
             {[1, 2, 3, 4].map(j => (
               <div key={j} className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <Skeleton className="w-3 h-3 rounded-full" />
                   <Skeleton className="w-4 h-4 rounded-full" />
                   <Skeleton className="h-4 w-16" />
                 </div>
                 <div className="flex gap-2">
                   <Skeleton className="h-3 w-4" />
                   <Skeleton className="h-3 w-4" />
                   <Skeleton className="h-3 w-4" />
                   <Skeleton className="h-3 w-4" />
                   <Skeleton className="h-3 w-4" />
                 </div>
               </div>
             ))}
           </div>
         </div>
      ))}
    </div>
  );
}

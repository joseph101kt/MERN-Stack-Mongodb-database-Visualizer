export default function SkeletonCard() {
  return (
    <div className="bg-depth-surface border border-white/5 rounded-xl overflow-hidden shadow-glass animate-pulse">
      {/* Image Area */}
      <div className="aspect-video bg-white/5" />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          {/* Title bar */}
          <div className="h-4 w-2/3 bg-white/10 rounded" />
          {/* Price bar */}
          <div className="h-4 w-12 bg-white/10 rounded" />
        </div>
        {/* Description bars */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/5 rounded" />
          <div className="h-3 w-4/5 bg-white/5 rounded" />
        </div>
        {/* Tag bar */}
        <div className="mt-4 h-5 w-16 bg-white/5 rounded" />
      </div>
    </div>
  );
}
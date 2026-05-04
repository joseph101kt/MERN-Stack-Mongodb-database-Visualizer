import React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

export default function VisualizerBreadcrumb({ path, onNavigate }: { path: string[], onNavigate: (p: string[]) => void }) {
  // Logic to truncate path if too long
  const displayPath = path.length > 4 
    ? [path[0], '...', ...path.slice(-2)] 
    : path;

  return (
    <nav className="sticky top-0 z-40 bg-depth-base/80 backdrop-blur-xl border-b border-white/5 px-6 py-3 flex items-center gap-2">
      {displayPath.map((segment, idx) => (
        <React.Fragment key={idx}>
          <button 
            onClick={() => onNavigate(path.slice(0, path.indexOf(segment) + 1))}
            className="text-xs font-mono font-medium text-white/40 hover:text-accent transition-colors max-w-[150px] truncate uppercase tracking-tighter"
          >
            {segment === '...' ? <MoreHorizontal size={14} /> : segment}
          </button>
          {idx < displayPath.length - 1 && (
            <ChevronRight size={12} className="text-white/10" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
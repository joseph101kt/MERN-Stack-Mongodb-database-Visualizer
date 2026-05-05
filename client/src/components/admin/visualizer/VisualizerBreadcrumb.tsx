import React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

interface BreadcrumbProps {
  path: string[];
  onNavigate: (p: string[]) => void;
  collections: any[]; // Add this to look up names
}

export default function VisualizerBreadcrumb({ path, onNavigate, collections }: BreadcrumbProps) {
  
  // Helper to resolve ID to a Name
  const getDisplayName = (segment: string, index: number) => {
    if (segment === 'root') return 'Database';
    if (index === 0) return segment; // Usually the root/home
    
    // If it's the 3rd segment (index 2), it's likely a document ID
    if (index === 2) {
      const collectionName = path[1];
      const collection = collections.find(c => c.name === collectionName);
      const doc = collection?.data?.find((d: any) => d._id === segment);
      
      if (doc) {
        return doc.name || doc.title || segment;
      }
    }

    return segment;
  };

  const displayPath = path.length > 4 
    ? [path[0], '...', ...path.slice(-2)] 
    : path;

  return (
    <nav className="sticky top-0 z-40 bg-depth-base/80 backdrop-blur-xl px-6 py-3 flex items-center gap-2">
      {displayPath.map((segment, idx) => {
        // Find the actual index in the original path for navigation
        const originalIndex = path.indexOf(segment);
        const displayName = getDisplayName(segment, idx);

        return (
          <React.Fragment key={idx}>
            <button 
              onClick={() => onNavigate(path.slice(0, originalIndex + 1))}
              className="text-xs font-mono font-medium text-white/40 hover:text-accent transition-colors max-w-[200px] truncate uppercase tracking-tighter"
              title={displayName} // Show full name on hover
            >
              {segment === '...' ? (
                <MoreHorizontal size={14} />
              ) : (
                displayName
              )}
            </button>
            
            {idx < displayPath.length - 1 && (
              <ChevronRight size={12} className="text-white/10" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
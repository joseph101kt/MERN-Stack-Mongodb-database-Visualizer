import React, { useState } from 'react';
import { Database, ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';

export default function VisualizerSidebar({ 
  collections, 
  activeCollection, 
  selectedDocId, 
  onSelectCollection, 
  onSelectDoc 
}: any) {
  // Fix: Start with empty array so all collections are collapsed by default
  const [expandedCols, setExpandedCols] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedCols(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    // Fix: Ensure h-full and overflow-hidden on container, with flex-1 overflow-y-auto on list
    <aside className="h-full w-72 border-r border-white/5 bg-depth-surface flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-3 flex-shrink-0">
        <Database size={16} className="text-accent" />
        <span className="text-xs font-black uppercase tracking-widest text-white/80">Explorer</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {collections.map((col: any) => (
          <div key={col.name} className="space-y-1">
            <button
              onClick={() => {
                onSelectCollection(col.name);
                // Expand if not already expanded when clicking header
                if (!expandedCols.includes(col.name)) toggleExpand(col.name);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeCollection === col.name && !selectedDocId 
                ? 'bg-accent/10 text-accent' 
                : 'hover:bg-white/5 text-white/60'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Folder size={14} className={activeCollection === col.name ? 'text-accent' : 'opacity-20'} />
                <span className="text-xs font-bold uppercase tracking-tight truncate">{col.name}</span>
              </div>
              <div 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleExpand(col.name); 
                }} 
                className="p-1 hover:bg-white/10 rounded ml-2"
              >
                {expandedCols.includes(col.name) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </div>
            </button>

            {expandedCols.includes(col.name) && (
              <div className="ml-4 pl-2 border-l border-white/5 space-y-1 mt-1">
                {col.data.map((doc: any) => (
                  <button
                    key={doc._id}
                    onClick={() => onSelectDoc(col.name, doc._id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all ${
                      selectedDocId === doc._id 
                        ? 'text-white bg-white/10 shadow-sm' 
                        : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <FileText size={12} className={selectedDocId === doc._id ? 'text-accent' : 'opacity-20'} />
                    <span className="text-[11px] truncate font-medium">{doc.name || doc.title || doc.username || doc.email || doc.label || doc._id }</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
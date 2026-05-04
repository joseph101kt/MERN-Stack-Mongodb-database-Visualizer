import React, { useState } from 'react';
import { Database, ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';

export default function VisualizerSidebar({ 
  collections, 
  activeCollection, 
  selectedDocId, 
  onSelectCollection, 
  onSelectDoc 
}: any) {
  const [expandedCols, setExpandedCols] = useState<string[]>(['Products']);

  const toggleExpand = (name: string) => {
    setExpandedCols(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-80 border-r border-white/5 bg-depth-surface flex flex-col">
      <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-3">
        <Database size={16} className="text-accent" />
        <span className="text-xs font-black uppercase tracking-widest text-white/80">Explorer</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {collections.map((col: any) => (
          <div key={col.name} className="space-y-1">
            {/* Collection Header */}
            <button
              onClick={() => {
                onSelectCollection(col.name);
                if (!expandedCols.includes(col.name)) toggleExpand(col.name);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeCollection === col.name && !selectedDocId 
                ? 'bg-accent/10 text-accent' 
                : 'hover:bg-white/5 text-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Folder size={14} className={activeCollection === col.name ? 'text-accent' : 'opacity-20'} />
                <span className="text-xs font-bold uppercase tracking-tight">{col.name}</span>
              </div>
              <div onClick={(e) => { e.stopPropagation(); toggleExpand(col.name); }} className="p-1 hover:bg-white/10 rounded">
                {expandedCols.includes(col.name) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </div>
            </button>

            {/* Document List (Collapsible) */}
            {expandedCols.includes(col.name) && (
              <div className="ml-4 pl-2 border-l border-white/5 space-y-1 mt-1">
                {col.data.map((doc: any) => (
                  <button
                    key={doc._id}
                    onClick={() => onSelectDoc(col.name, doc._id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all ${
                      selectedDocId === doc._id 
                        ? 'text-white bg-white/5' 
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    <FileText size={12} className="opacity-20" />
                    <span className="text-[11px] truncate font-medium">{doc.name || doc._id}</span>
                  </button>
                ))}
                {col.data.length === 0 && (
                  <div className="px-3 py-2 text-[10px] text-white/10 italic">No documents found</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
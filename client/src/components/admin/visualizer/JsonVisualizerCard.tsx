import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus, Edit3, Check, X } from 'lucide-react';

interface CardProps {
  data: any;
  path: string;
  depth: number;
  onUpdate: (path: string, value: any) => void;
  onDelete: (path: string) => void;
}

export default function JsonVisualizerCard({ data, path, depth, onUpdate, onDelete }: CardProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 1);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const isArray = Array.isArray(data);

  // Clean summary logic: No "Object Explorer" fallback
  const getSummary = () => {
    if (isArray) return `${data.length} items`;
    if (!data || typeof data !== 'object') return String(data);
    
    const nameField = Object.entries(data).find(([k]) => 
      ['name', 'title', 'label', 'username'].includes(k.toLowerCase())
    )?.[1];
    
    return nameField ? String(nameField) : "";
  };

  // Alternating shades based on depth
  const depthClass = depth % 2 === 0 ? 'bg-depth-surface' : 'bg-depth-overlay';

  return (
    <div className={`mb-2 rounded-xl border border-white/5 overflow-hidden transition-all ${depthClass}`}>
      {/* --- CARD HEADER --- */}
      <div 
        className="flex items-center justify-between px-4 py-3 group/header border-b border-white/5 cursor-pointer hover:bg-white/[0.02]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="text-white/40">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            {path.split('.').pop() === 'Database' ? 'Root' : path.split('.').pop()}
          </span>
          {!isExpanded && (
            <span className="text-xs text-accent/70 truncate max-w-[200px] font-medium italic">
              {getSummary()}
            </span>
          )}
        </div>
      </div>

      {/* --- CARD CONTENT --- */}
      {isExpanded && (
        <div className="p-4 space-y-1">
          {Object.entries(data).map(([key, value]) => {
            const currentPath = `${path}.${key}`;
            
            // Handle Nested Objects/Arrays (Recursion)
            if (value !== null && typeof value === 'object') {
              return (
                <JsonVisualizerCard 
                  key={key}
                  data={value}
                  path={currentPath}
                  depth={depth + 1}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              );
            }

            // Primitive Field Row (The actual inputs/values)
            return (
              <div key={key} className="flex items-center justify-between py-1.5 px-3 rounded-lg group/row hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-xs font-mono text-white/40 w-32 shrink-0">{key}</span>
                  
                  {editingKey === key ? (
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <input 
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { 
                            onUpdate(currentPath, editValue); 
                            setEditingKey(null); 
                          }
                          if (e.key === 'Escape') setEditingKey(null);
                        }}
                        className="bg-depth-base border border-accent/50 rounded px-2 py-1 text-xs text-white outline-none w-full font-mono"
                      />
                      <button 
                        onClick={() => { onUpdate(currentPath, editValue); setEditingKey(null); }} 
                        className="text-accent hover:scale-110 transition-transform"
                      >
                        <Check size={14}/>
                      </button>
                      <button 
                        onClick={() => setEditingKey(null)} 
                        className="text-white/20 hover:text-white transition-colors"
                      >
                        <X size={14}/>
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { 
                        setEditingKey(key); 
                        setEditValue(String(value)); 
                      }}
                      className="text-xs px-2 py-1 rounded bg-white/5 border border-white/5 text-accent hover:border-accent/40 transition-all text-left font-mono"
                    >
                      {String(value)}
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => { if(confirm(`Delete field "${key}"?`)) onDelete(currentPath); }}
                  className="opacity-0 group-hover/row:opacity-100 p-1 text-white/20 hover:text-red-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import React, { useMemo, useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import VisualizerSidebar from '../components/admin/visualizer/VisualizerSidebar';
import VisualizerBreadcrumb from '../components/admin/visualizer/VisualizerBreadcrumb';
import JsonVisualizerCard from '../components/admin/visualizer/JsonVisualizerCard';
import { Database, LayoutGrid, Box, Loader2, ChevronLeft, ChevronRight, Menu, FileText } from 'lucide-react';
import { detectEnums, processData } from '../components/admin/utils/filterEngine';

// ─── Types ────────────────────────────────────────────────────────────────────

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface Collection {
  name: string;
  schema: string;
  count: number;
  data: any[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JsonVisualizerPage() {
  const [searchTerm, setSearchTerm]           = useState('');
  const [isFilterOpen, setIsFilterOpen]       = useState(false);
  const [activeFilters, setActiveFilters]     = useState<Record<string, string[]>>({});
  const [sortConfig, setSortConfig]           = useState<SortConfig | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId]       = useState<string | null>(null);
  const [activePath, setActivePath]             = useState<string[]>(['Database']);

  const queryClient = useQueryClient();

  // ─── Fetch all collections ─────────────────────────────────────────────────

  const { data: collections, isLoading } = useQuery<Collection[]>({
    queryKey: ['admin-collections'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/api/v1/admin/collections');
      if (!res.ok) throw new Error('Failed to fetch collections');
      const json = await res.json();
      return json.data ?? [];
    },
  });

  // ─── Derived state ─────────────────────────────────────────────────────────

  const activeCollectionData = collections?.find((c) => c.name === activeCollection);

  const detectedEnums = useMemo(
    () => detectEnums(activeCollectionData?.data ?? []),
    [activeCollectionData]
  );

  const displayedProducts = useMemo(
    () => processData(activeCollectionData?.data ?? [], searchTerm, sortConfig, activeFilters),
    [activeCollectionData, searchTerm, sortConfig, activeFilters]
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleSelectCollection = (name: string) => {
    setActiveCollection(name);
    setSelectedDocId(null);
    setActivePath(['Database', name]);
    // Reset filters when switching collections
    setSearchTerm('');
    setActiveFilters({});
    setSortConfig(null);
    setIsFilterOpen(false);
  };

  const handleSelectDoc = (col: string, id: string) => {
    setActiveCollection(col);
    setSelectedDocId(id);
    setActivePath(['Database', col, id]);
  };

  // ─── Mutations (collection-aware) ──────────────────────────────────────────

  const updateFieldMutation = useMutation({
    mutationFn: async ({
      id,
      collection,
      path,
      value,
    }: {
      id: string;
      collection: string;
      path: string;
      value: any;
    }) => {
      // Strip "Database.<Collection>.<ID>." prefix — works for any collection
      const relativePath = path.split('.').slice(3).join('.');
      const res = await fetch(
        `http://localhost:5000/api/v1/${collection.toLowerCase()}/${id}/field`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: relativePath, value }),
        }
      );
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-collections'] }),
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async ({
      id,
      collection,
      path,
    }: {
      id: string;
      collection: string;
      path: string;
    }) => {
      const relativePath = path.split('.').slice(3).join('.');
      const res = await fetch(
        `http://localhost:5000/api/v1/${collection.toLowerCase()}/${id}/field`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: relativePath }),
        }
      );
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-collections'] }),
  });

  const handleUpdate = (fullPath: string, value: any) => {
    const id = fullPath.split('.')[2]; // Database.<Collection>.<ID>
    updateFieldMutation.mutate({ id, collection: activeCollection!, path: fullPath, value });
  };

  const handleDelete = (fullPath: string) => {
    const id = fullPath.split('.')[2];
    deleteFieldMutation.mutate({ id, collection: activeCollection!, path: fullPath });
  };

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-depth-base">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <span className="text-[10px] text-white/20 font-mono uppercase tracking-[0.4em]">
            Synchronizing Database...
          </span>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-64px)] bg-depth-base overflow-hidden w-full">
      {/* Sidebar Container */}
      <div
        className={`transition-all duration-300 ease-in-out border-r border-white/5 flex flex-col flex-shrink-0 ${
          isSidebarCollapsed ? 'w-0' : 'w-72'
        }`}
      >

        <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${
            isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
          }`}>
          <VisualizerSidebar
            collections={collections ?? []}
            activeCollection={activeCollection}
            selectedDocId={selectedDocId}
            onSelectCollection={handleSelectCollection}
            onSelectDoc={handleSelectDoc}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative ">
        <div className="flex items-center pb-2 border-b border-white/5">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -left-11  top-3 z-50 w-6 h-6 bg-accent text-depth-base rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={14} />}
        </button>
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="ml-4 p-2 text-white/40 hover:text-accent transition-colors"
            >
              <Menu size={18} />
            </button>
          )}
          <VisualizerBreadcrumb
            path={activePath}
            collections={collections ?? []} // Pass the raw data here
            onNavigate={(newPath) => {
              setActivePath(newPath);
              if (newPath.length === 1) { 
                setActiveCollection(null); 
                setSelectedDocId(null); 
              }
              if (newPath.length === 2) { 
                setSelectedDocId(null); 
              }
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto pb-20 space-y-6">

            {/* ── Case 1: Root — collection cards ── */}
            {!activeCollection && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collections?.map((col) => (
                  <div
                    key={col.name}
                    onClick={() => handleSelectCollection(col.name)}
                    className="group bg-depth-surface border border-white/5 rounded-2xl p-6 hover:border-accent/40 hover:bg-white/[0.02] transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Database size={120} />
                    </div>

                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                          <Box size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white uppercase tracking-tighter">{col.name}</h3>
                          <p className="text-[10px] text-white/30 font-mono tracking-[0.2em] uppercase">Collection Entity</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-3xl font-black text-white block leading-none">{col.count ?? col.data.length}</span>
                        <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Documents</span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest border-t border-white/5 pt-4">
                      <span>Schema: {col.schema}</span>
                      <span className="group-hover:text-accent transition-colors">Open Explorer →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Case 2: Collection selected — document list ── */}
            {activeCollection && !selectedDocId && (
              <div className="space-y-4">

                {/* Search + filter controls */}
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    placeholder={`Search ${activeCollection.toLowerCase()}...`}
                    value={searchTerm}
                    className="bg-depth-surface border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-accent/50 w-full max-w-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-4 py-2 rounded-lg border transition-all text-xs font-bold uppercase tracking-widest ${
                      isFilterOpen
                        ? 'bg-accent text-depth-base border-accent'
                        : 'bg-depth-surface text-white/60 border-white/10'
                    }`}
                  >
                    {isFilterOpen ? 'Close Filters' : 'Quick Filters'}
                  </button>
                </div>

                {/* Enum filter panel */}
                {isFilterOpen && Object.keys(detectedEnums).length > 0 && (
                  <div className="bg-depth-surface/50 border border-white/5 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                      {Object.entries(detectedEnums).map(([key, values]) => (
                        <div key={key} className="flex flex-col gap-2">
                          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">{key}</span>
                          <div className="flex flex-wrap gap-2">
                            {(values as any[]).map((val) => (
                              <button
                                key={val}
                                onClick={() => toggleFilter(key, val)}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all border ${
                                  activeFilters[key]?.includes(val)
                                    ? 'bg-accent/20 border-accent text-accent'
                                    : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-8">
                  <LayoutGrid size={20} className="text-accent" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    {activeCollection}
                    <span className="text-white/20 ml-2 font-mono text-sm">
                      ({displayedProducts.length})
                    </span>
                  </h2>
                </div>

                {displayedProducts.map((doc: any) => (
                  <JsonVisualizerCard
                    key={doc._id}
                    data={doc}
                    path={`Database.${activeCollection}.${doc._id}`}
                    depth={0}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {/* NEW Case 3: Single Document Selection */}
            {activeCollection && selectedDocId && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg text-accent">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">Document Inspector</h2>
                      <p className="text-[10px] text-white/30 font-mono tracking-widest uppercase">ID: {selectedDocId}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDocId(null)}
                    className="text-[10px] font-bold text-accent border border-accent/20 px-3 py-1 rounded hover:bg-accent/10 transition-all uppercase"
                  >
                    Back to Collection
                  </button>
                </div>

                {/* Render the specific selected card */}
                {activeCollectionData?.data
                  .filter(d => d._id === selectedDocId)
                  .map(doc => (
                    <JsonVisualizerCard
                      key={doc._id}
                      data={doc}
                      path={`Database.${activeCollection}.${doc._id}`}
                      depth={0}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))
                }
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
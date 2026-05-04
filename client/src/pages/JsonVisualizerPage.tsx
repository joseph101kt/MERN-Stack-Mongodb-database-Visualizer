import React, { useMemo, useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import VisualizerSidebar from '../components/admin/visualizer/VisualizerSidebar';
import VisualizerBreadcrumb from '../components/admin/visualizer/VisualizerBreadcrumb';
import JsonVisualizerCard from '../components/admin/visualizer/JsonVisualizerCard';
import { Database, LayoutGrid, Box, Loader2, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { detectEnums, processData } from '../components/admin/utils/filterEngine';


export default function JsonVisualizerPage() {
	const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
	type SortDirection = "asc" | "desc";

	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	interface SortConfig {
		key: string;
		direction: SortDirection;
	}


	const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

	

	const handleSort = (key: string) => {
		setSortConfig((prev) => ({
			key,
			direction: prev?.key === key && prev.direction === "asc" ? ("desc" as const) : ("asc" as const)
		}));
	};
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string[]>(['Database']);
	
	const queryClient = useQueryClient();


  // Fetch all collections from the new admin endpoint
  const { data: collections, isLoading } = useQuery({
    queryKey: ['admin-explorer'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/api/v1/admin/collections');
      if (!res.ok) throw new Error('Failed to fetch collections');
      const json = await res.json();
      return json.data || []; 
    }
  });

  // Derived Data with fallbacks to prevent "undefined" errors
	const activeCollectionData = collections?.find((c: any) => c.name === activeCollection);
  const selectedDoc = products.find((p: any) => p._id === selectedDocId);

	const detectedEnums = useMemo(() => 
    detectEnums(activeCollectionData?.data || []), 
    [activeCollectionData]
  );

	const displayedProducts = useMemo(() => {
    return processData(activeCollectionData?.data || [], searchTerm, sortConfig, activeFilters);
  }, [activeCollectionData, searchTerm, sortConfig, activeFilters]);

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[key] || [];
      const next = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };


  const handleSelectCollection = (name: string) => {
    setActiveCollection(name);
    setSelectedDocId(null);
    setActivePath(['Database', name]);
  };

  const handleSelectDoc = (col: string, id: string) => {
    setActiveCollection(col);
    setSelectedDocId(id);
    setActivePath(['Database', col, id]);
  };


const updateFieldMutation = useMutation({
  mutationFn: async ({ id, path, value }: { id: string, path: string, value: any }) => {
    // We strip "Database.Products.ID." from the path to get the relative field path
    const relativePath = path.split('.').slice(3).join('.'); 
    
    const res = await fetch(`http://localhost:5000/api/v1/products/${id}/field`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: relativePath, value })
    });
    return res.json();
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-explorer'] })
});

const deleteFieldMutation = useMutation({
  mutationFn: async ({ id, path }: { id: string, path: string }) => {
    const relativePath = path.split('.').slice(3).join('.');
    
    const res = await fetch(`http://localhost:5000/api/v1/products/${id}/field`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: relativePath })
    });
    return res.json();
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-explorer'] })
});

const handleUpdate = (fullPath: string, value: any) => {
  const pathParts = fullPath.split('.');
  const id = pathParts[2]; // Database.Products.[ID]
  updateFieldMutation.mutate({ id, path: fullPath, value });
};

const handleDelete = (fullPath: string) => {
  const pathParts = fullPath.split('.');
  const id = pathParts[2];
  deleteFieldMutation.mutate({ id, path: fullPath });
};

  // Loading State UI
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

  return (
    <div className="flex h-[calc(100vh-64px)] bg-depth-base overflow-hidden">
			{/* 2. Sidebar Wrapper with dynamic width */}
      <div className={`relative transition-all duration-300 ease-in-out border-r border-white/5 flex flex-col ${
        isSidebarCollapsed ? 'w-0' : 'w-72'
      }`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-4 top-3 z-50 w-6 h-6 bg-accent text-depth-base rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isSidebarCollapsed ? <ChevronRight size={1} /> : <ChevronLeft size={14} />}
        </button>

        {/* Sidebar Content (Hidden when collapsed to prevent layout jank) */}
        <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${
          isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <VisualizerSidebar 
            collections={collections || []}
            activeCollection={activeCollection}
            selectedDocId={selectedDocId}
            onSelectCollection={handleSelectCollection}
            onSelectDoc={handleSelectDoc}
          />
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Optional: Add a "Show Sidebar" button in breadcrumb area if collapsed */}
        <div className="flex items-center">
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
            onNavigate={(newPath) => {
              setActivePath(newPath);
              if (newPath.length === 1) { setActiveCollection(null); setSelectedDocId(null); }
              if (newPath.length === 2) { setSelectedDocId(null); }
            }} 
          />
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto pb-20 space-y-6">
            
            {/* --- CASE 1: ROOT VIEW (Collection Summaries) --- */}
            {!activeCollection && !selectedDocId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collections?.map((col: any) => (
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
                        <span className="text-3xl font-black text-white block leading-none">{col.count || col.data.length}</span>
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

            {/* --- CASE 2: COLLECTION SELECTED (Show List of Cards) --- */}
            {activeCollection && !selectedDocId && (
              <div className="space-y-4">

								{/* 1. SEARCH BAR */}
								<div className="flex gap-4 items-center">
									<input 
										type="text" 
										placeholder="Search items..." 
										className="bg-depth-surface border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-accent/50 w-full max-w-sm"
										onChange={(e) => setSearchTerm(e.target.value)}
									/>

									{/* 2. Filter Btn */}
									<button 
										onClick={() => setIsFilterOpen(!isFilterOpen)}
										className={`px-4 py-2 rounded-lg border transition-all text-xs font-bold uppercase tracking-widest ${isFilterOpen ? 'bg-accent text-depth-base border-accent' : 'bg-depth-surface text-white/60 border-white/10'}`}
									>
										{isFilterOpen ? 'Close Filters' : 'Quick Filters'}
									</button>
								</div>
								{/* EXPANDING ENUM PANEL */}
								{isFilterOpen && Object.keys(detectedEnums).length > 0 && (
									<div className="bg-depth-surface/50 border border-white/5 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
										<div className="space-y-4">
											{Object.entries(detectedEnums).map(([key, values]) => (
												<div key={key} className="flex flex-col gap-2">
													<span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">{key}</span>
													<div className="flex flex-wrap gap-2">
														{values.map(val => (
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
											({displayedProducts.length}) {/* Show filtered count */}
										</span>
									</h2>
								</div>

								{/* Map over the PROCESSED (filtered/sorted) data here */}
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

          </div>
        </div>
      </div>
    </div>
  );
}
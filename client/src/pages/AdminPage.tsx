import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Database, PlusCircle, LayoutGrid, X, Menu } from 'lucide-react';
import ProductForm from '../components/admin/ProductForm';
import ProductsPage from './ProductsPage';
import JsonVisualizerPage from './JsonVisualizerPage';

type AdminView = 'Database_Visualizer' | 'create' | 'update';

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  // Sync view state with URL parameters
  const activeView = (searchParams.get('view') as AdminView) || 'Database_Visualizer';

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-collapse logic for mobile/tablets
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (view: AdminView) => {
    setSearchParams({ view });
    // Auto-close sidebar on mobile after selecting a view
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-depth-base text-white overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 h-[calc(100vh-80px)] transition-all duration-300 ease-in-out
        border-r border-white/10 bg-depth-surface flex flex-col gap-4
        ${isSidebarOpen ? 'w-64 p-6' : 'w-0 p-0 overflow-hidden lg:w-20 lg:p-4'}
      `}>
        <div className='pt-15'></div>
        
        {/* Toggle/Minimize Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-3  px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all mb-2 ${
            !isSidebarOpen ? 'justify-center px-0' : ''
          }`}
        >
          <Menu size={20} />
          {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Minimize</span>}
        </button>

        <nav className="flex flex-col gap-2">
          <SidebarButton 
            icon={<Database size={18} />} 
            label="DB Visualizer" 
            active={activeView === 'Database_Visualizer'} 
            showLabel={isSidebarOpen}
            onClick={() => handleNavClick('Database_Visualizer')} 
          />
          
          <SidebarButton 
            icon={<PlusCircle size={18} />} 
            label="Create Product" 
            active={activeView === 'create'} 
            showLabel={isSidebarOpen}
            onClick={() => handleNavClick('create')} 
          />
          
          <SidebarButton 
            icon={<LayoutGrid size={18} />} 
            label="Update Product" 
            active={activeView === 'update'} 
            showLabel={isSidebarOpen}
            onClick={() => handleNavClick('update')} 
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex pt-15 flex-col min-w-0">
        {/* Top Mobile Header (Shows when sidebar is closed on mobile) */}
        {!isSidebarOpen && (
          <header className="lg:hidden p-4 border-b border-white/5 flex items-center gap-4 bg-depth-surface/50 backdrop-blur-md">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/5 rounded-lg">
              <Menu size={20} />
            </button>
            <span className="font-black uppercase tracking-widest text-xs opacity-50">Admin Panel</span>
          </header>
        )}

        <div className="flex-1 p-4 lg:p-10 overflow-y-auto custom-scrollbar">
          {activeView === 'Database_Visualizer' && (
            <div className="h-full min-h-[500px] flex border-2 border-dashed border-white/5 rounded-3xl overflow-hidden animate-in fade-in duration-500">
              <JsonVisualizerPage/>
            </div>
          )}

          {activeView === 'create' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-2xl font-bold mb-8 text-green-400">Deploy New Inventory</h1>
              <div className="bg-depth-surface border border-white/10 p-6 lg:p-8 rounded-2xl shadow-glass">
                <ProductForm />
              </div>
            </div>
          )}

          {activeView === 'update' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-2xl font-bold text-green-400">Inventory Management</h1>
              <ProductsPage isAdminPage={true}/>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal Popup */}
      {editingProductId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-depth-surface border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setEditingProductId(null)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-8 text-green-400">Edit Product Instance</h2>
            <ProductForm productId={editingProductId} />
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick, showLabel }: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void, 
  showLabel: boolean 
}) {
  return (
    <button 
      onClick={onClick}
      title={!showLabel ? label : ""}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
        active 
          ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
          : 'text-white/40 hover:bg-white/5 hover:text-white'
      } ${!showLabel ? 'justify-center px-0' : ''}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {showLabel && <span>{label}</span>}
    </button>
  );
}
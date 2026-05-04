import React, { useState } from 'react';
import { Database, PlusCircle, LayoutGrid, X } from 'lucide-react';
import ProductForm from '../components/admin/ProductForm';
import ProductsPage from './ProductsPage'; // Use existing page as a component
import { IProduct } from '../types/product';

type AdminView = 'visualizer' | 'create' | 'update';

export default function AdminPage() {
  const [activeView, setActiveView] = useState<AdminView>('visualizer');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-depth-base text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-depth-surface p-6 flex flex-col gap-8">
        <div className="px-2">
          <h2 className="text-xl font-black tracking-tighter text-accent italic">ADMIN_CORE</h2>
          <p className="text-[10px] text-white/30 font-mono">v2.0.4-stable</p>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarButton 
            icon={<Database size={18} />} 
            label="DB Visualizer" 
            active={activeView === 'visualizer'} 
            onClick={() => setActiveView('visualizer')} 
          />
          <SidebarButton 
            icon={<PlusCircle size={18} />} 
            label="Create Product" 
            active={activeView === 'create'} 
            onClick={() => setActiveView('create')} 
          />
          <SidebarButton 
            icon={<LayoutGrid size={18} />} 
            label="Update Product" 
            active={activeView === 'update'} 
            onClick={() => setActiveView('update')} 
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeView === 'visualizer' && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
            <div className="text-center">
              <Database size={48} className="mx-auto mb-4 text-white/10" />
              <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Recursive Visualizer Initialization...</p>
            </div>
          </div>
        )}

        {activeView === 'create' && (
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-8">Deploy New Inventory</h1>
            <div className="bg-depth-surface border border-white/10 p-8 rounded-2xl shadow-glass">
              <ProductForm />
            </div>
          </div>
        )}

        {activeView === 'update' && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <ProductsPage isAdminPage={true}/>
          </div>
        )}
      </main>

      {/* Edit Modal Popup */}
      {editingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-depth-surface border border-white/20 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setEditingProductId(null)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-8">Edit Product Instance</h2>
            <ProductForm productId={editingProductId} />
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        active 
          ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
          : 'text-white/40 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
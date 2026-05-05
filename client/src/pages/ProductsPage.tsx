import { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { Search, Filter, X, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import AdminControls from '../components/admin/AdminControls';
import ProductForm from '../components/admin/ProductForm';

interface ProductsPageProps {
  isAdminPage?: boolean;
}

export default function ProductsPage({ isAdminPage = false }: ProductsPageProps) {
  const { data: products, isLoading, error } = useProducts();
	const [editingId, setEditingId] = useState<string | null>(null);
  
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(''); // Delayed update for filtering
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000); // Default high range
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- DERIVED DATA ---
  const categories = useMemo(() => {
    if (!products) return ['All'];
    const cats = products.map(p => p.category);
    return ['All', ...Array.from(new Set(cats))];
  }, [products]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (maxPrice < 2000) count++;
    return count;
  }, [selectedCategory, maxPrice]);

  // --- FILTER & SORT LOGIC ---
  const processedProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 2. Price Filter
    result = result.filter(p => p.price <= maxPrice);

    // 3. Fuzzy Search
    if (debouncedQuery.trim() !== '') {
      const fuse = new Fuse(result, {
        keys: ['name', 'description', 'specs.brand'],
        threshold: 0.3,
      });
      result = fuse.search(debouncedQuery).map(res => res.item);
    }

    // 4. Sorting
    if (sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, debouncedQuery, selectedCategory, maxPrice, sortOrder]);

  // --- DEBOUNCE EFFECT ---
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(searchQuery);
			setCurrentPage(1); // Reset to page 1 when search changes
		}, 300);

		return () => clearTimeout(handler);
	}, [searchQuery]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-depth-base text-white p-6 lg:p-10">
      <header className="max-w-[1600px] mx-auto mb-10 pt-16">
        <h1 className="text-3xl font-semibold mb-6 tracking-tight text-white/90">
          {isAdminPage ? "Inventory Management" : "Visualizer Explorer"}
        </h1>
        
        <div className="flex flex-col space-y-4 bg-depth-surface p-4 rounded-2xl border border-white/5 shadow-glass">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory..." 
                className="w-full bg-depth-overlay border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-all"
              />
            </div>
            
            {/* Category Dropdown */}
            <div className="relative w-full md:w-auto">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <Filter className="w-4 h-4 text-white/30" />
                <span className="text-xs font-medium text-white/50">
                  { `Filters`}
                </span>
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 appearance-none bg-depth-overlay text-white border border-white/5 rounded-xl py-2.5 pl-24 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-depth-overlay bg-gray-800 text-white">{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Toggle */}
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 bg-depth-overlay border border-white/5 px-4 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-colors w-full md:w-auto justify-center"
            >
              Price
              {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 text-accent" /> : <ArrowDown className="w-4 h-4 text-accent" />}
            </button>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col space-y-2 px-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/30">
              <span>Price Range</span>
              <span>Up to ${maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-accent h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto">
        {error ? (
          <div className="text-center py-20 bg-red-500/5 border border-red-500/10 rounded-2xl">
            <p className="text-red-400">Database connection failed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product}>
								{isAdminPage && (
									<AdminControls 
										id={product._id} 
										onEdit={(id) => setEditingId(id)} 
									/>
								)}
                </ProductCard>
              ))
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 bg-depth-surface border border-white/5 rounded-lg disabled:opacity-20 hover:bg-white/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-mono text-white/50">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 bg-depth-surface border border-white/5 rounded-lg disabled:opacity-20 hover:bg-white/5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
			{/* Edit Popup Overlay */}
      {editingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-depth-surface border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setEditingId(null)}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Edit Product</h2>
              <p className="text-white/40 text-sm font-mono uppercase tracking-widest">System Override / {editingId}</p>
            </div>

            {/* Re-using the self-contained form we built */}
            <ProductForm productId={editingId} />
          </div>
        </div>
      )}
    </main>
  );
}
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IProduct } from '../types/product';
import { useProducts } from '../hooks/useProducts'; // Assuming you have this hook
import ProductCard from '../components/ui/ProductCard';
import { Star, Package, Shield, Truck, MessageSquare, Sparkles } from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // 1. Fetch Current Product
  const { data: product, isLoading, error } = useQuery<IProduct>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/v1/products/${id}`);
      const json = await res.json();
      return json.data;
    }
  });

  // 2. Fetch All Products for Suggestions
  const { data: allProducts } = useProducts();

  // 3. Filter Suggestions (Same category, different ID)
  const suggestions = useMemo(() => {
    if (!allProducts || !product) return [];
    return allProducts
      .filter(p => p.category === product.category && p._id !== product._id)
      .slice(0, 4); // Limit to 4 suggestions
  }, [allProducts, product]);

  const mutation = useMutation({
    mutationFn: async (newReview: { comment: string; rating: number }) => {
      const res = await fetch(`http://localhost:5000/api/v1/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      setComment('');
      setRating(5);
    },
  });

  const handleSubmitReview = () => {
    if (!comment.trim()) return;
    mutation.mutate({ comment, rating });
  };

  if (isLoading) return <div className="p-10 text-white/20 animate-pulse">Loading details...</div>;
  if (error || !product) return <div className="p-10 text-red-400">Product not found</div>;

  return (
    <main className="min-h-screen bg-depth-base text-white p-6 lg:p-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Left: Product Image */}
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-glass bg-depth-surface">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
        </div>

        {/* Right: Info & Specs */}
        <div className="space-y-8">
          <header>
            <span className="text-accent text-sm font-mono tracking-widest uppercase mb-2 block">{product.category}</span>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-white/60 leading-relaxed">{product.description}</p>
          </header>

          <div className="text-3xl font-mono text-white/90">${product.price.toLocaleString()}</div>

          <div className="grid grid-cols-2 gap-4">
            <SpecBox icon={<Package size={16}/>} label="Model" value={product.specs.model} />
            <SpecBox icon={<Shield size={16}/>} label="Warranty" value={product.specs.warranty} />
            <SpecBox icon={<Truck size={16}/>} label="Brand" value={product.specs.brand} />
            <SpecBox icon={<Star size={16}/>} label="Weight" value={product.specs.weight || 'N/A'} />
          </div>
        </div>
      </div>

      {/* Suggested Products Section */}
      {suggestions.length > 0 && (
        <section className="max-w-6xl mx-auto mb-24">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-accent w-5 h-5" />
            <h2 className="text-xl font-semibold tracking-tight">You might also like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map(item => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="max-w-6xl mx-auto border-t border-white/10 pt-12">
        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
          <MessageSquare className="text-accent" /> Community Reviews ({product.reviews.length})
        </h2>
        
        {/* Review Form */}
        <div className="bg-depth-surface p-6 rounded-2xl border border-white/10 mb-10 shadow-glass">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h3 className="text-sm font-medium text-white/70">Leave a review</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={20} 
                    fill={(hoverRating || rating) >= star ? "currentColor" : "none"} 
                    className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-white/20"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-mono text-white/30 self-center">({rating}/5)</span>
            </div>
          </div>

          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full bg-depth-overlay border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-accent/40 min-h-[100px] mb-4 text-white"
          />
          <button 
            onClick={handleSubmitReview}
            disabled={mutation.isPending || !comment.trim()}
            className="bg-accent/10 hover:bg-accent/20 text-accent px-6 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 border border-accent/20"
          >
            {mutation.isPending ? 'Posting...' : 'Post Anonymously'}
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {product.reviews.slice().reverse().map((rev, i) => (
            <div key={i} className="border-b border-white/10 pb-6 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white/80">{rev.user}</span>
                <div className="flex gap-0.5 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={14} 
                      fill={idx < rev.rating ? "currentColor" : "none"} 
                      className={idx < rev.rating ? "text-yellow-400" : "text-white/10"}
                      stroke="none" 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">{rev.comment}</p>
              <div className="mt-2 text-[10px] text-white/20 font-mono italic">
                {new Date(rev.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function SpecBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-depth-surface/50 border border-white/10 p-4 rounded-xl flex items-center gap-4">
      <div className="text-accent/80 bg-accent/5 p-2 rounded-lg">{icon}</div>
      <div>
        <div className="text-[10px] uppercase text-white/40 tracking-tighter">{label}</div>
        <div className="text-sm text-white/90 font-medium">{value}</div>
      </div>
    </div>
  );
}
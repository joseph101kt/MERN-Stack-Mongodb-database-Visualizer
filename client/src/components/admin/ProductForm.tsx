import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../../types/product';
import { Save, X, Image as ImageIcon, PlusCircle, PenLine, RotateCcw } from 'lucide-react';

interface ProductFormProps {
  productId?: string | null;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Setup Form
  const { register, handleSubmit, watch, reset } = useForm<IProduct>({
    defaultValues: {
      name: '',
      price: 0,
      category: 'Electronics',
      image: '',
      description: '',
      specs: { brand: '', model: '', warranty: '1 Year', weight: '' }
    }
  });

  const imageUrl = watch('image');

  // 2. Fetch Data (TanStack Query v5)
  const { data: fetchedProduct, isLoading: isFetching } = useQuery<IProduct>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products/${productId}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!productId,
  });

  // 3. Sync fetched data with form fields
  useEffect(() => {
    if (fetchedProduct) {
      reset(fetchedProduct);
    }
  }, [fetchedProduct, reset]);

  // 4. Create/Update Mutation
  const mutation = useMutation({
    mutationFn: async (formData: Partial<IProduct>) => {
      const url = productId 
        ? `${import.meta.env.VITE_API_URL}/api/v1/products/${productId}` 
        : `${import.meta.env.VITE_API_URL}/api/v1/products`;
      
      const res = await fetch(url, {
        method: productId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      return res.json();
    },

		onSuccess: () => {
      // 1. Invalidate queries so the cache is clean for the reload
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // 2. Wait 1 second, then reload
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    }
  });

  // 5. Handle Discard (Reset to original data or defaults)
  const handleDiscard = () => {
    if (fetchedProduct) {
      reset(fetchedProduct);
    } else {
      reset({
        name: '',
        price: 0,
        category: 'Electronics',
        image: '',
        description: '',
        specs: { brand: '', model: '', warranty: '1 Year', weight: '' }
      });
    }
  };

  if (productId && isFetching) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-white/20 gap-4">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        <p className="animate-pulse text-xs uppercase tracking-widest font-bold">Fetching product details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Side: General Info */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Product Name</label>
            <input 
              {...register('name')} 
              className="w-full bg-depth-overlay border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all shadow-inner" 
              placeholder="e.g. Quantum X1 Monitor" 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Price ($)</label>
              <input 
                type="number" 
                {...register('price', { valueAsNumber: true })} 
                className="w-full bg-depth-overlay border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Stock</label>
              <input 
                type="number" 
                {...register('stock', { valueAsNumber: true })} 
                className="w-full bg-depth-overlay border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Image URL</label>
            <input {...register('image')} className="w-full bg-depth-overlay border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all" />
          </div>

          <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Category</label>
              <input {...register('category')} className="w-full bg-depth-overlay border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Description</label>
            <textarea {...register('description')} className="w-full bg-depth-overlay border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all min-h-[140px] resize-none" />
          </div>
        </div>

        {/* Right Side: Specs & Preview */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-black/20 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Save size={16} className="text-accent" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Specs</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {['brand', 'model', 'warranty', 'weight'].map((key) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase ml-1">{key}</label>
                  <input 
                    {...register(`specs.${key}` as any)} 
                    className="w-full bg-depth-base border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/30" 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl border-2 border-dashed border-white/10 bg-depth-overlay overflow-hidden flex items-center justify-center group">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={40} className="text-white/10" />
            )}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white/60 uppercase">Live Preview</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/10">
        <button 
          type="button" 
          onClick={handleDiscard}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all"
        >
          <RotateCcw size={16} /> Discard Changes
        </button>
        
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="flex items-center gap-2 px-10 py-3 bg-white text-black rounded-xl text-sm font-black hover:bg-accent transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
        >
					{mutation.isPending ? (
							'Processing...'
						) : mutation.isSuccess ? (
							productId?(<>✅ Updated!</>):(<>✅ Created!</>)
						) : productId ? (
							<><PenLine size={18} /> Update</>
						) : (
							<><PlusCircle size={18} /> Create</>
						)}
	        </button>
      </div>
    </form>
  );
}
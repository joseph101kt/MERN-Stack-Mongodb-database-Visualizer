import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../../types/product';

interface ProductCardProps {
  product: IProduct;
  children?: React.ReactNode;
}

export default function ProductCard({ product, children }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-depth-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all group shadow-glass flex flex-col h-full relative">
      
      {/* Action Layer for Children (Admin Buttons) */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {children}
      </div>

      {/* Main Content Layer (Clickable) */}
      <div 
        onClick={() => navigate(`/products/${product._id}`)}
        className="cursor-pointer flex flex-col h-full"
      >
        <div className="relative aspect-video overflow-hidden bg-depth-overlay">
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-white/90 truncate pr-2">{product.name}</h3>
            <span className="text-accent text-sm font-mono whitespace-nowrap">
              ${product.price.toLocaleString()}
            </span>
          </div>
          <p className="text-white/50 text-xs line-clamp-2 mb-4">
            {product.description}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="px-2 py-1 bg-white/5 text-[10px] rounded uppercase tracking-wider text-white/40 border border-white/5">
              {product.category}
            </span>
            <span className="text-[10px] text-white/20 font-mono">
              {product.specs.brand}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
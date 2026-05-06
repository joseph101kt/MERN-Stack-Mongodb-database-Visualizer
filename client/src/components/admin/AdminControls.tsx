import { Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AdminControlsProps {
  id: string;
  onEdit: (id: string) => void;
}

export default function AdminControls({ id, onEdit }: AdminControlsProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    },
    onSuccess: () => {
      // Refresh the product list immediately
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <div className="flex bg-gray-900 rounded-xl gap-2 p-2 border-t border-white/5">
      <button
        onClick={(e) => {
          e.preventDefault(); // Prevent navigating to details page
          onEdit(id);
        }}
        className="flex-1 flex items-center justify-center gap-2 bg-green-400 hover:bg-white text-white hover:text-black py-2 pl-2 pr-3 rounded-lg text-xs font-bold transition-all"
      >
        <Pencil size={14} /> Edit
      </button>
      
      <button
        disabled={deleteMutation.isPending}
        onClick={(e) => {
          e.preventDefault();
          if (confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate();
          }
        }}
        className="px-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-lg transition-all disabled:opacity-50"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
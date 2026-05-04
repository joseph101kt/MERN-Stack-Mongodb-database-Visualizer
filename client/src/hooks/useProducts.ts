import { useQuery } from '@tanstack/react-query';
import { IProduct } from '../types/product';

interface ApiResponse {
  success: boolean;
  count: number;
  data: IProduct[];
}

export const useProducts = () => {
  return useQuery<IProduct[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/v1/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const json: ApiResponse = await response.json();
      return json.data;
    },
  });
};
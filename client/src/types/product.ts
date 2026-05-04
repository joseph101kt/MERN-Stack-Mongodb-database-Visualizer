export interface IReview {
  user: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface ISpecs {
  brand: string;
  model: string;
  weight?: string;
  dimensions?: string;
  warranty: string;
}

export interface IProduct {
  _id: string; // MongoDB ID
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  specs: ISpecs;
  reviews: IReview[];
  createdAt: string;
  updatedAt: string;
}
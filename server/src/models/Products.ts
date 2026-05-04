import mongoose, { Schema, Document } from 'mongoose';

// Level 3: Nested structure for individual reviews
interface IReview {
  user: string;
  rating: number;
  comment: string;
  date: Date;
}

// Level 2: Nested structure for technical specifications
interface ISpecs {
  brand: string;
  model: string;
  weight?: string;
  dimensions?: string;
  warranty: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  specs: ISpecs;      // Nested Object
  reviews: IReview[]; // Nested Array
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, required: true },
  
  // Depth Level 2: Specs
  specs: {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    weight: { type: String },
    dimensions: { type: String },
    warranty: { type: String, default: '1 Year' }
  },

  // Depth Level 3: Reviews
  reviews: [
    {
      user: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  author: mongoose.Types.ObjectId;
  content: {
    excerpt: string;
    body: string;
    tags: string[];
  };
  metadata: {
    views: number;
    readTime: number;
    seo: {
      metaTitle: string;
      metaDesc: string;
      keywords: string[];
    };
  };
  comments: {
    user: string;
    text: string;
    votes: number;
  }[];
}

const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: {
    excerpt: { type: String },
    body: { type: String, required: true },
    tags: [{ type: String }]
  },
  metadata: {
    views: { type: Number, default: 0 },
    readTime: { type: Number },
    seo: {
      metaTitle: { type: String },
      metaDesc: { type: String },
      keywords: [{ type: String }]
    }
  },
  comments: [
    {
      user: { type: String },
      text: { type: String },
      votes: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
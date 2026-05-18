import { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  sizes: string[];
  colors?: string[];
  gender: 'male' | 'female' | 'unisex';
  stock: number;
  featured: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { 
      type: String, 
      required: [true, 'Please provide product title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true
    },
    description: { 
      type: String, 
      required: [true, 'Please provide product description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    category: { 
      type: String, 
      required: [true, 'Please provide product category'],
      trim: true
    },
    gender: {
      type: String,
      required: [true, 'Please provide target gender'],
      enum: {
        values: ['male', 'female', 'unisex'],
        message: '{VALUE} is not a valid gender'
      },
      default: 'unisex'
    },
    price: { 
      type: Number, 
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative']
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
      validate: [(val: string[]) => val.length > 0, 'Please provide at least one image']
    },
    sizes: {
      type: [String],
      required: [true, 'Please provide available sizes'],
      enum: {
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
        message: '{VALUE} is not a valid size'
      }
    },
    colors: [{ type: String }],
    stock: { 
      type: Number, 
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    featured: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });

const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;

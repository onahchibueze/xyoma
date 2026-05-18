import mongoose, { Schema, model, models } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface ICart {
  _id: string;
  userId: mongoose.Types.ObjectId;
  products: ICartItem[];
  totalQuantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true // Each user has one cart
    },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1, min: 1 },
        size: { type: String }
      },
    ],
    totalQuantity: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    totalPrice: { 
      type: Number, 
      required: true, 
      default: 0.0 
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups by userId
CartSchema.index({ userId: 1 });

const Cart = models.Cart || model<ICart>('Cart', CartSchema);

export default Cart;

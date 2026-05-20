import mongoose, { Schema, model, models } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  title: string;
  quantity: number;
  image: string;
  price: number;
  size?: string;
}

export interface IOrder {
  _id: string;
  userId: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNo: string;
  };
  paymentInfo: {
    id: string;
    status: string;
    method: string;
  };
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String }
      },
    ],
    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNo: { type: String, required: true },
    },
    paymentInfo: {
      id: { type: String, unique: true, sparse: true },
      status: { type: String },
      method: { type: String, required: true, default: 'Paystack' }
    },
    orderStatus: { 
      type: String, 
      required: true, 
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending' 
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;

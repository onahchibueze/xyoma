import mongoose, { Schema, model, models } from 'mongoose';

export interface IPaymentRequest {
  idempotencyKey: string;
  userId: mongoose.Types.ObjectId;
  reference: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  orderData: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRequestSchema = new Schema<IPaymentRequest>(
  {
    idempotencyKey: { 
      type: String, 
      required: true, 
      unique: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    reference: { 
      type: String, 
      required: true, 
      unique: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed'], 
      default: 'pending' 
    },
    orderData: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PaymentRequestSchema.index({ idempotencyKey: 1 });
PaymentRequestSchema.index({ reference: 1 });
PaymentRequestSchema.index({ userId: 1 });

const PaymentRequest = models.PaymentRequest || model<IPaymentRequest>('PaymentRequest', PaymentRequestSchema);

export default PaymentRequest;

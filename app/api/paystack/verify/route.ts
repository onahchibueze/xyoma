import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PaymentRequest from '@/models/PaymentRequest';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import { AppError, handleError } from '@/utils/errorHandler';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      throw new AppError('Reference is required', 400);
    }

    await dbConnect();

    // Call Paystack to verify
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      throw new AppError(paystackData.message || 'Payment verification failed', 500);
    }

    const { status, reference: verifiedRef } = paystackData.data;

    if (status === 'success') {
      const paymentRequest = await PaymentRequest.findOne({ reference: verifiedRef });

      if (paymentRequest && paymentRequest.status !== 'paid') {
        paymentRequest.status = 'paid';
        await paymentRequest.save();

        // Fallback Order Creation if webhook hasn't done it yet
        const orderExists = await Order.findOne({ 'paymentInfo.id': verifiedRef });
        if (!orderExists) {
          const { orderData, userId } = paymentRequest;
          await Order.create({
            ...orderData,
            userId,
            paymentInfo: {
              id: verifiedRef,
              status: 'Paid'
            },
            orderStatus: 'Processing'
          });
          
          // Clear the user's cart in DB
          await Cart.findOneAndDelete({ userId: paymentRequest.userId });
        }
      }
      
      return NextResponse.json({ success: true, message: 'Payment verified' });
    }

    return NextResponse.json({ success: false, status, message: 'Payment not successful' });

  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

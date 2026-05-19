import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import PaymentRequest from '@/models/PaymentRequest';
import { AppError, handleError } from '@/utils/errorHandler';
import { getBaseUrl } from '@/utils/baseUrl';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const { idempotencyKey, orderData, email } = await req.json();

    if (!idempotencyKey || !orderData || !email) {
      throw new AppError('Missing required fields', 400);
    }

    await dbConnect();

    // Check for existing idempotency key
    const existingRequest = await PaymentRequest.findOne({ idempotencyKey });

    if (existingRequest) {
      if (existingRequest.status === 'paid') {
        return NextResponse.json({ 
          error: 'This payment has already been processed successfully.' 
        }, { status: 400 });
      }
      
      // If pending, we return the same reference. 
      // In a more complex system, we might re-initialize if the Paystack URL expired,
      // but for this implementation, we'll inform the user or return the existing data.
      return NextResponse.json({ 
        success: true, 
        reference: existingRequest.reference,
        message: 'A payment session already exists for this order.'
      });
    }

    // Initialize Paystack
    const amount = Math.round(orderData.totalPrice * 100); // Paystack expects kobo

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        callback_url: `${getBaseUrl()}/checkout/verify`,
        metadata: {
          idempotencyKey,
          userId: session.user.id
        }
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      throw new AppError(paystackData.message || 'Paystack initialization failed', 500);
    }

    // Create PaymentRequest record
    await PaymentRequest.create({
      idempotencyKey,
      userId: session.user.id,
      reference: paystackData.data.reference,
      amount: orderData.totalPrice,
      status: 'pending',
      orderData,
    });

    return NextResponse.json({ 
      success: true, 
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference 
    });

  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

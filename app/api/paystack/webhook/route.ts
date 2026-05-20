import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import PaymentRequest from '@/models/PaymentRequest';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import { sendOrderInvoice } from '@/lib/invoice';

export async function POST(req: NextRequest) {
  try {
    // Paystack sends the body as a JSON object
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest('hex');

    const signature = req.headers.get('x-paystack-signature');

    if (hash !== signature) {
      console.error('Webhook signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (body.event === 'charge.success') {
      const { reference } = body.data;

      await dbConnect();

      const paymentRequest = await PaymentRequest.findOne({ reference });

      if (!paymentRequest) {
        console.error(`Payment request not found for reference: ${reference}`);
        return NextResponse.json({ error: 'Payment request not found' }, { status: 404 });
      }

      // Idempotency: If already paid, just return 200
      if (paymentRequest.status === 'paid') {
        return NextResponse.json({ success: true, message: 'Already processed' });
      }

      // Update payment request status
      paymentRequest.status = 'paid';
      await paymentRequest.save();

      // Create the order
      const { orderData, userId } = paymentRequest;
      
      const order = await Order.create({
        ...orderData,
        userId,
        paymentInfo: {
          id: reference,
          status: 'Paid',
          method: 'Paystack'
        },
        orderStatus: 'Pending'
      });

      // Clear the user's cart in DB
      await Cart.findOneAndDelete({ userId });

      // Trigger Invoice Email
      await sendOrderInvoice(order);

      return NextResponse.json({ success: true, message: 'Order created successfully' });
    }

    // Acknowledge other events
    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

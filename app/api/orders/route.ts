import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { AppError, handleError } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const body = await req.json();
    const { 
      orderItems, 
      shippingInfo, 
      itemsPrice, 
      shippingPrice, 
      taxPrice, 
      totalPrice 
    } = body;

    await dbConnect();

    const order = await Order.create({
      userId: session.user.id,
      orderItems,
      shippingInfo,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentInfo: {
        id: 'COD_' + Math.random().toString(36).substr(2, 9),
        status: 'Pending',
        method: 'COD'
      },
      orderStatus: 'Pending'
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    await dbConnect();
    const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

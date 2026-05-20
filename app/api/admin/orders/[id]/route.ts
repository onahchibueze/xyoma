import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { AppError, handleError } from '@/utils/errorHandler';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      throw new AppError('Unauthorized. Admin only.', 403);
    }

    const { status } = await req.json();
    await dbConnect();

    const order = await Order.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export const PUT = PATCH;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      throw new AppError('Unauthorized. Admin only.', 403);
    }

    await dbConnect();
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

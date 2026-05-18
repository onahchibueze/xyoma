import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { AppError, handleError } from '@/utils/errorHandler';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ items: [] });
    }

    await dbConnect();
    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    // Map DB items to store items
    const items = cart.products.map((p: any) => ({
      id: p._id.toString(),
      product: p.product.toString(),
      title: p.title,
      price: p.price,
      image: p.image,
      quantity: p.quantity,
      size: p.size,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const { items } = await req.json();
    await dbConnect();

    const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const products = items.map((item: any) => ({
      product: item.product,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      size: item.size,
    }));

    const cart = await Cart.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        products,
        totalQuantity,
        totalPrice,
      },
    { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    await dbConnect();
    await Cart.findOneAndDelete({ userId: session.user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { slugify } from '@/utils';

// Check if user is admin
const checkAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
};

// GET all products
export async function GET() {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (error: unknown) {
    console.error('GET Products Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(req: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, gender, price, images, sizes, colors, stock, featured } = body;

    // Basic validation
    if (!title || !description || !category || !gender || price === undefined || !images || images.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const slug = slugify(title);

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json({ error: 'Product with similar title already exists' }, { status: 400 });
    }

    const product = await Product.create({
      title,
      slug,
      description,
      category,
      gender,
      price,
      images,
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
      featured: featured || false,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST Product Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}

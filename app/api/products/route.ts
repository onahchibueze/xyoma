import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort');

    await dbConnect();

    // 1. Get Single Product by Slug
    if (slug) {
      const product = await Product.findOne({ slug });
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    // 2. Build Filter Object
    const filter: any = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (gender && gender !== 'All') {
      if (gender === 'unisex') {
        filter.gender = 'unisex';
      } else {
        // For 'male' or 'female', we also include 'unisex' items
        filter.gender = { $in: [gender, 'unisex'] };
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    // 3. Define Sort Order
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    // 4. Fetch Products
    const products = await Product.find(filter).sort(sortOption);
    
    return NextResponse.json({ 
      success: true, 
      count: products.length,
      products 
    });
  } catch (error: unknown) {
    console.error('API Products Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

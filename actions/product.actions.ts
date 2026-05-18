'use server';

import dbConnect from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products)) as IProduct[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function createProduct(productData: Partial<IProduct>) {
  try {
    await dbConnect();
    const product = await Product.create(productData);
    revalidatePath('/products');
    return { success: true, data: JSON.parse(JSON.stringify(product)) as IProduct };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

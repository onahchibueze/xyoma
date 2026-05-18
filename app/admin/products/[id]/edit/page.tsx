'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { IProduct } from '@/models/Product';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch product');

        setProduct(data.product);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center p-12 space-y-4">
        <p className="text-red-500">{error || 'Product not found'}</p>
        <button 
          onClick={() => router.push('/admin/products')}
          className="text-white/50 hover:text-white underline text-sm uppercase tracking-widest"
        >
          Return to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Edit Product</h1>
        <p className="text-white/50 text-sm tracking-wide">Update {product.title}</p>
      </div>

      <ProductForm initialData={product} isEditing />
    </div>
  );
}

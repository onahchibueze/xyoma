'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { IProduct } from '@/models/Product';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
        
        if (isMounted) setProducts(data.products);
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to delete product');

      // Optimistic update
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'An error occurred during deletion');
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Products</h1>
          <p className="text-white/50 text-sm tracking-wide">Manage your luxury collection inventory.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-white/50">
            <p className="text-sm uppercase tracking-widest">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase tracking-widest text-white/50 bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded border border-white/10 overflow-hidden bg-black flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.title} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">No Img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white mb-0.5 flex items-center gap-2">
                            {product.title}
                            {product.featured && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-yellow-500/20 text-yellow-500 text-[9px] uppercase tracking-wider">Featured</span>
                            )}
                          </div>
                          <div className="text-xs text-white/50">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "font-medium",
                        product.stock > 10 ? "text-green-500" : product.stock > 0 ? "text-yellow-500" : "text-red-500"
                      )}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/products/${product._id}/edit`}
                          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

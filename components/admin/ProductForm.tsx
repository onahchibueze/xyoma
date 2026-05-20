'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IProduct } from '@/models/Product';
import ImageUpload from './ImageUpload';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ProductFormProps {
  initialData?: Partial<IProduct>;
  isEditing?: boolean;
}

const CATEGORIES = ['Gown', 'Tops', 'Bottoms', 'Luxury Dresses', 'Streetwear', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Unisex', value: 'unisex' },
];

export default function ProductForm({ initialData, isEditing }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || CATEGORIES[0],
    gender: initialData?.gender || 'unisex',
    images: initialData?.images || [],
    sizes: initialData?.sizes || [],
    colors: initialData?.colors ? initialData.colors.join(', ') : '',
    stock: initialData?.stock || 0,
    featured: initialData?.featured || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      };

      const url = isEditing ? `/api/admin/products/${initialData?._id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image Upload Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold tracking-tight uppercase mb-4">Product Images</h2>
        
        {/* Helper Note */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">Upload Guidelines</p>
              <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                Recommended: 4:5 Portrait Ratio • Min: 800x1000px • Max: 10MB
              </p>
              <p className="text-[9px] text-zinc-600 italic leading-relaxed">
                Portrait images prevent unwanted cropping in the storefront display.
              </p>
            </div>
          </div>
        </div>

        <ImageUpload 
          value={formData.images} 
          onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))} 
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold tracking-tight uppercase mb-4">General Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Title</label>
              <input
                type="text"
                name="title"
                required
                disabled={loading}
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="e.g. Luxury Black Gown"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Description</label>
              <textarea
                name="description"
                required
                disabled={loading}
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"
                placeholder="Product details and styling notes..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold tracking-tight uppercase mb-4">Organization & Pricing</h2>
            
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Price (₦)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                disabled={loading}
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Category</label>
              <select
                name="category"
                required
                disabled={loading}
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Target Gender</label>
              <select
                name="gender"
                required
                disabled={loading}
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              >
                {GENDERS.map(gender => (
                  <option key={gender.value} value={gender.value}>{gender.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                disabled={loading}
                value={formData.stock}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold tracking-tight uppercase mb-4">Variants & Status</h2>
            
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    disabled={loading}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md border transition-colors",
                      formData.sizes.includes(size)
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/70 border-white/20 hover:border-white/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2 mt-4">Colors (comma separated)</label>
              <input
                type="text"
                name="colors"
                disabled={loading}
                value={formData.colors}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="Black, Red, White"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-4">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                disabled={loading}
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-black border-white/20 text-white focus:ring-white focus:ring-offset-black"
              />
              <label htmlFor="featured" className="text-sm font-bold text-white uppercase tracking-widest">
                Featured Product
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

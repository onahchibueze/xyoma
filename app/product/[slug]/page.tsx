'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { IProduct } from '@/models/Product';
import { useCartStore } from '@/store/useCartStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import BackButton from '@/components/BackButton';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils';

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?slug=${slug}`);
        const data = await res.json();
        if (res.ok) setProduct(data.product);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-zinc-700" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold uppercase tracking-widest">Product Not Found</h1>
        <button onClick={() => router.push('/collection')} className="underline uppercase tracking-[0.3em] text-xs">Return to Collection</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: Math.random().toString(36).substr(2, 9),
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      size: selectedSize || undefined,
    });
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <SectionWrapper id="product-details" className="pt-32 pb-24">
        <div className="mb-12">
          <BackButton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 border border-white/10 rounded-2xl group">
              <Image
                src={product.images[activeImage]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              
              {product.images.length > 1 && (
                <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={cn(
                        "h-1 transition-all duration-300",
                        activeImage === idx ? "w-8 bg-white" : "w-4 bg-white/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border transition-all duration-300",
                      activeImage === idx ? "border-white" : "border-white/5 opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-medium">
                  {product.category}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">
                {product.title}
              </h1>
              <p className="text-2xl font-mono text-zinc-400">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="h-px bg-white/10 w-full" />

            <div className="space-y-8">
              <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Select Size</span>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-600 underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[50px] h-10 flex items-center justify-center border text-xs font-bold uppercase tracking-widest transition-all duration-300",
                          selectedSize === size
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white border-white/10 hover:border-white"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-4">
                <div className="flex items-center border border-white/10 rounded-full px-2 h-14 bg-zinc-900/50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-zinc-500 hover:text-white transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-mono text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-zinc-500 hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-white text-black flex items-center justify-center gap-3 rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:bg-zinc-200 transition-all duration-300 active:scale-[0.98]"
                >
                  <ShoppingBag size={18} />
                 Add to Cart
                </button>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-y-6 text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium">
              <div>
                <p className="text-zinc-700 mb-1">Authenticity</p>
                <p className="text-zinc-300">Official XYOMA Product</p>
              </div>
              <div>
                <p className="text-zinc-700 mb-1">Shipping</p>
                <p className="text-zinc-300">Global Logistics</p>
              </div>
              <div>
                <p className="text-zinc-700 mb-1">Material</p>
                <p className="text-zinc-300">Premium Material</p>
              </div>
              <div>
                <p className="text-zinc-700 mb-1">Serial</p>
                <p className="text-zinc-300 font-mono">#{product._id.slice(-6).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}

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

      <SectionWrapper id="product-details" className="pt-24 md:pt-32 pb-24">
        <div className="mb-8 md:mb-12">
          <BackButton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 xl:gap-24">
          {/* Left: Image Gallery */}
          <div className="space-y-4 md:space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 border border-white/10 rounded-xl md:rounded-2xl group">
              <Image
                src={product.images[activeImage]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {product.images.length > 1 && (
                <div className="absolute inset-x-0 bottom-4 md:bottom-6 flex justify-center gap-2 md:gap-3">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={cn(
                        "h-1 transition-all duration-300",
                        activeImage === idx ? "w-6 md:w-8 bg-white" : "w-3 md:w-4 bg-white/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 md:grid-cols-4 gap-3 md:gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border transition-all duration-300",
                      activeImage === idx ? "border-white" : "border-white/5 opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="20vw" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-8 md:gap-10">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-medium">
                  {product.category}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-tight md:leading-none">
                {product.title}
              </h1>
              <p className="text-xl md:text-2xl font-mono text-zinc-400">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="h-px bg-white/10 w-full" />

            <div className="space-y-6 md:space-y-8">
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-lg">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Select Size</span>
                    <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-zinc-600 underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[45px] md:min-w-[50px] h-10 flex items-center justify-center border text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300",
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
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 pt-2">
                <div className="flex items-center border border-white/10 rounded-full px-2 py-1 bg-zinc-900/50 w-full md:w-auto justify-between md:justify-start">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-zinc-500 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="w-12 text-center font-mono text-base md:text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-zinc-500 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 md:py-5 bg-white text-black flex items-center justify-center gap-3 px-8 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] md:text-sm hover:bg-zinc-200 transition-all duration-300 active:scale-[0.98] w-full"
                >
                  <ShoppingBag className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                 Add to Cart
                </button>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-y-8 text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium">
              <div>
                <p className="text-zinc-700 mb-1.5 font-bold">Authenticity</p>
                <p className="text-zinc-300">Official XYOMA Product</p>
              </div>
              <div>
                <p className="text-zinc-700 mb-1.5 font-bold">Shipping</p>
                <p className="text-zinc-300">Global Logistics</p>
              </div>
              <div>
                <p className="text-zinc-700 mb-1.5 font-bold">Material</p>
                <p className="text-zinc-300">Premium Material</p>
              </div>
              <div>
                <p className="text-zinc-700 mb-1.5 font-bold">Serial</p>
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

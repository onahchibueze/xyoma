'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { IProduct } from '@/models/Product';
import SectionWrapper from '@/components/SectionWrapper';
import CollectionNavbar from '@/components/collection/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories', 'Heritage'];
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

export default function CollectionPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [showFeatured, setShowFeatured] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (showFeatured) params.append('featured', 'true');
      params.append('sort', selectedSort);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedSort, showFeatured]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="bg-black min-h-screen text-white">
      <CollectionNavbar />
      
      <SectionWrapper id="collection" className="pt-32 pb-24">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
                XYOMA / Collection
              </span>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.85]">
                The <span className="text-zinc-600 italic">Collection</span>
              </h1>
            </div>

            {/* Search and Quick Filters */}
            <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center py-10 border-y border-white/5">
              <div className="relative w-full lg:max-w-xl group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-white transition-colors" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="SEARCH PRODUCTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none py-4 pl-10 pr-6 text-sm uppercase tracking-widest focus:outline-none focus:ring-0 transition-all placeholder:text-zinc-800"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X size={14} className="text-zinc-500" />
                  </button>
                )}
                <div className="absolute bottom-0 left-0 w-full h-px bg-white/10 group-focus-within:bg-white transition-all duration-700" />
              </div>

              <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
                <div className="hidden lg:flex items-center gap-2 pr-6 border-r border-white/5">
                  {categories.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[9px] uppercase tracking-widest transition-all font-bold",
                        selectedCategory === cat ? "bg-white text-black" : "text-zinc-600 hover:text-zinc-300"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "flex items-center gap-3 px-8 py-4 border rounded-full text-[10px] uppercase tracking-widest font-black transition-all",
                    isFilterOpen ? "bg-white text-black border-white" : "bg-transparent text-white border-white/10 hover:border-white"
                  )}
                >
                  <SlidersHorizontal size={14} />
                  Advanced Filters
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 py-12 border-b border-white/5">
                    <div className="space-y-6">
                      <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                              "px-5 py-2.5 border text-[9px] uppercase tracking-widest transition-all font-bold",
                              selectedCategory === cat ? "bg-white text-black border-white" : "border-white/5 text-zinc-500 hover:border-white/20"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black">Sort Order</h4>
                      <div className="flex flex-col gap-3">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSelectedSort(opt.value)}
                            className={cn(
                              "text-left text-[10px] uppercase tracking-widest transition-all",
                              selectedSort === opt.value ? "text-white font-black" : "text-zinc-600 hover:text-zinc-400"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black">Refinement</h4>
                      <button
                        onClick={() => setShowFeatured(!showFeatured)}
                        className={cn(
                          "flex items-center gap-3 px-6 py-4 border text-[10px] uppercase tracking-widest font-black transition-all",
                          showFeatured ? "bg-[#c5a059] text-black border-[#c5a059]" : "border-white/5 text-zinc-500 hover:border-white/20"
                        )}
                      >
                        <Sparkles size={14} />
                        Featured Products
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.5em] text-zinc-600 font-mono">
            <span>{products.length} Products Found</span>
            {searchQuery && (
              <span className="text-zinc-400">Query: "{searchQuery}"</span>
            )}
          </div>

          {loading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-6">
              <Loader2 className="w-10 h-10 animate-spin text-zinc-800" />
              <span className="text-[9px] uppercase tracking-[0.6em] text-zinc-700 animate-pulse">Loading Collection...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center gap-8">
              <div className="w-24 h-24 border border-dashed border-white/5 rounded-full flex items-center justify-center">
                <Search size={32} className="text-zinc-900" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl uppercase tracking-tighter font-bold">No Products Found</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 max-w-xs mx-auto leading-relaxed">No products match your current search parameters.</p>
              </div>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setShowFeatured(false);
                }}
                className="text-[9px] uppercase tracking-[0.4em] text-white font-bold border-b border-white/20 pb-1 hover:border-white transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
              {products.map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="group relative flex flex-col gap-6"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 border border-white/5 transition-all duration-700 ease-out group-hover:border-white/10">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {product.featured && (
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                          <Sparkles size={10} className="text-[#c5a059]" />
                          <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Featured</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="text-[9px] uppercase tracking-[0.4em] font-bold border-b border-white pb-2">View Details</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.5em] text-zinc-600 font-bold">
                          {product.category}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">{formatPrice(product.price)}</span>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-tighter text-white leading-tight">
                        {product.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}

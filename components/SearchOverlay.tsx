'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { IProduct } from '@/models/Product';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedSearches = ['Kaftan', 'Corset', 'Lace', 'Technical', 'Ankara'];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?q=${searchQuery}&limit=6`);
      const data = await res.json();
      if (res.ok) setResults(data.products);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 md:top-12 md:right-12 p-4 text-zinc-500 hover:text-white transition-colors group"
          >
            <X size={32} strokeWidth={1} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-screen-xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-16">
              
              {/* Search Input Area */}
              <div className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-zinc-700 group-focus-within:text-[#c5a059] transition-colors" strokeWidth={1} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="WHAT ARE YOU LOOKING FOR?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-8 pl-14 pr-12 text-2xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase focus:outline-none focus:border-white transition-all placeholder:text-zinc-800"
                />
                {loading && (
                  <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 animate-spin text-zinc-700" />
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Suggestions / Recent */}
                <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">
                      <TrendingUp size={12} />
                      Trending Products
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-5 py-2.5 bg-zinc-900/50 border border-white/5 text-[9px] uppercase tracking-widest hover:border-white/20 hover:bg-zinc-800 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/5 space-y-4">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 leading-relaxed max-w-[240px]">
                      Our technical heritage is engineered for longevity and style refinement.
                    </p>
                    <Link 
                      href="/collection" 
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#c5a059] hover:text-white transition-colors"
                    >
                      Browse Collection <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>

                {/* Results Preview */}
                <div className="lg:col-span-8">
                  {!query ? (
                    <div className="h-64 flex flex-col justify-center opacity-20">
                      <span className="text-8xl font-black uppercase tracking-tighter">XYOMA</span>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="group flex gap-6 p-4 hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                        >
                          <div className="relative aspect-square w-24 bg-zinc-900 overflow-hidden">
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex flex-col justify-center gap-1">
                            <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-500">{product.category}</span>
                            <h4 className="text-sm font-bold uppercase tracking-widest">{product.title}</h4>
                            <p className="text-xs font-mono text-zinc-400">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : !loading && (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-zinc-600">
                      <X size={40} strokeWidth={1} />
                      <p className="text-[10px] uppercase tracking-[0.4em]">No Results Found</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

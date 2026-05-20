"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "./SectionWrapper";
import { useProducts } from "@/hooks/use-products";
import { useCartStore } from "@/store/useCartStore";
import { collection as fallbackCollection } from "@/contents/collection";
import Image from "next/image";
import { Plus, Loader2, ArrowRight } from "lucide-react";
import { formatPrice } from "@/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CollectionProps {
  limit?: number;
  showSeeMore?: boolean;
}

export default function Collection({ limit, showSeeMore = false }: CollectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { products, loading } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  const displayProducts = useMemo(() => {
    const base = products.length > 0 ? products : fallbackCollection.map(item => ({
      _id: item.id,
      title: item.name,
      category: item.category,
      images: [item.imageUrl],
      price: 150, // Default price for fallback
      slug: item.id,
      description: item.imageAlt,
      sizes: ['M', 'L', 'XL'],
      stock: 10,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    return limit ? base.slice(0, limit) : base;
  }, [products, limit]);

  useGSAP(() => {
    if (!loading && displayProducts.length > 0) {
      // Clear any existing animations/states
      gsap.killTweensOf(cardsRef.current);
      
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { 
          y: 60, 
          opacity: 0,
          clipPath: "inset(100% 0% 0% 0%)" 
        },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, { dependencies: [loading, displayProducts], scope: containerRef });

  const handleAddToCart = (product: any) => {
    addItem({
      id: `${product._id}-M`, // Default to M for now
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      size: 'M'
    });
  };

  return (
    <SectionWrapper id="collection-preview" className="bg-black border-t border-white/5" overflowVisible={true}>
      <div ref={containerRef} className="flex flex-col gap-12 md:gap-24">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
          <div className="flex flex-col gap-6 max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
              03 / Lookbook
            </span>
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-[0.85]">
              The <br />
              <span className="text-zinc-600 italic">Collection</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest max-w-[280px] md:text-right leading-relaxed font-light">
              Premium Heritage: The intersection of Nigerian soul and technical streetwear.
            </p>
            <div className="h-px w-20 bg-zinc-700 hidden md:block" />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-zinc-500" size={32} />
            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Loading Collection...</span>
          </div>
        ) : (
          /* Fashion Collection Grid */
          <div className="flex flex-col gap-12 md:gap-20">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
              {displayProducts.map((item, index) => (
                <div
                  key={item._id}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className="group relative flex flex-col gap-5 cursor-pointer"
                >
                  {/* Image Container with Luxury Effects */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-700 ease-out group-hover:border-white/20 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-20px_rgba(255,255,255,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute inset-0">
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out hover:scale-110 active:scale-95 z-20"
                    >
                      <Plus size={20} />
                    </button>

                    <div className="absolute top-0 right-0 w-8 h-px bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                    <div className="absolute top-0 right-0 w-px h-8 bg-white/20 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-semibold">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-base font-medium uppercase tracking-widest text-white leading-tight mt-1">
                      {item.title}
                    </h3>
                    <div className="h-px w-0 bg-white/30 mt-2 transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* See More Button */}
            {showSeeMore && (
              <div className="flex justify-center mt-4 relative z-20">
                <Link 
                  href="/collection"
                  className="group relative flex items-center gap-4 px-8 md:px-12 py-4 md:py-5 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-black hover:bg-zinc-200 transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10">Explore Full Collection</span>
                  <ArrowRight size={16} className="relative z-10 transition-transform duration-500 group-hover:translate-x-2" />
                  <div className="absolute inset-0 bg-zinc-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Bottom Editorial Quote */}
        <div className="mt-12 md:mt-24 border-t border-white/5 pt-12 text-center">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-zinc-600 italic">
            &quot;We don&apos;t just make clothes. We define style.&quot; — XYOMA Laboratory
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}

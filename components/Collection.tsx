"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "./SectionWrapper";
import { useProducts } from "@/hooks/use-products";
import { useCartStore } from "@/store/useCartStore";
import { collection as fallbackCollection } from "@/contents/collection";
import Image from "next/image";
import { Plus, Loader2 } from "lucide-react";
import { formatPrice } from "@/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Collection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { products, loading } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  useGSAP(() => {
    // Initial entrance animation
    if (!loading) {
      gsap.fromTo(
        cardsRef.current,
        { 
          y: 100, 
          opacity: 0,
          clipPath: "inset(100% 0% 0% 0%)" 
        },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, { dependencies: [loading], scope: containerRef });

  const displayProducts = products.length > 0 ? products : fallbackCollection.map(item => ({
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
    <SectionWrapper id="collection" className="bg-black border-t border-white/5">
      <div ref={containerRef} className="flex flex-col gap-16 md:gap-24">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
          <div className="flex flex-col gap-6 max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
              03 / Lookbook
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-[0.85]">
              The <br />
              <span className="text-zinc-600 italic">Collection</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-xs text-zinc-500 uppercase tracking-widest max-w-[280px] md:text-right leading-relaxed font-light">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {displayProducts.map((item, index) => (
              <div
                key={item._id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group relative flex flex-col gap-5 cursor-pointer"
              >
                {/* Image Container with Luxury Effects */}
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-700 ease-out group-hover:border-white/20 group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_-20px_rgba(255,255,255,0.1)]">
                  {/* Image Placeholder / Visual */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Visual Representation (Editorial Styling) */}
                  <div className="absolute inset-0">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                  </div>
                  
                  {/* Quick Add Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out hover:scale-110 active:scale-95 z-20"
                  >
                    <Plus size={20} />
                  </button>

                  {/* Corner Accents */}
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
                  
                  {/* Subtle Hover Reveal */}
                  <div className="h-px w-0 bg-white/30 mt-2 transition-all duration-500 group-hover:w-full" />
                </div>

                {/* soft glow effect (hidden, revealed on hover) */}
                <div className="absolute -inset-4 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              </div>
            ))}
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

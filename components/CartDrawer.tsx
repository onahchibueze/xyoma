'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/utils/cn';
import { useSession } from 'next-auth/react';
import { formatPrice } from '@/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer() {
  const { items, totalQuantity, totalPrice, updateQuantity, removeItem, setCart, isDrawerOpen, closeDrawer } = useCartStore();
  const { data: session } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasFetchedDB, setHasFetchedDB] = useState(false);

  // Sync with backend once on mount/session change
  useEffect(() => {
    if (session && !hasFetchedDB) {
      const fetchCart = async () => {
        try {
          const res = await fetch('/api/cart');
          const data = await res.json();
          if (data.items) {
            // Get current local items from store state
            const localItems = useCartStore.getState().items;
            
            if (data.items.length > 0) {
              // Merge: keep local items and add any DB items that aren't already there
              const mergedItems = [...localItems];
              data.items.forEach((dbItem: any) => {
                const exists = mergedItems.find(
                  (i) => i.product === dbItem.product && i.size === dbItem.size
                );
                if (!exists) {
                  mergedItems.push(dbItem);
                }
              });
              setCart(mergedItems);
            }
          }
          setHasFetchedDB(true);
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      };
      fetchCart();
    }
  }, [session, hasFetchedDB, setCart]);

  // Sync changes to backend
  useEffect(() => {
    // Only sync if we've already done the initial fetch to prevent wiping DB
    if (session && hasFetchedDB) {
      const syncCart = async () => {
        setIsSyncing(true);
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
        } catch (error) {
          console.error('Failed to sync cart:', error);
        } finally {
          setIsSyncing(false);
        }
      };
      const timer = setTimeout(syncCart, 1000);
      return () => clearTimeout(timer);
    }
  }, [items, session, hasFetchedDB]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-zinc-400" />
                <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Your Account</h2>
                <span className="bg-white/10 text-[10px] px-2 py-0.5 rounded-full text-zinc-400 font-mono">
                  {totalQuantity}
                </span>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-white/5 rounded-full transition-colors group"
              >
                <X size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 opacity-40">
                  <div className="w-16 h-16 border border-dashed border-white/20 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-center">Your bag is empty</p>
                  <button
                    onClick={closeDrawer}
                    className="text-[9px] uppercase tracking-[0.2em] border-b border-white/20 pb-1 hover:border-white transition-colors"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={`${item.product}-${item.size}`} className="flex gap-4 group">
                      <div className="relative aspect-[3/4] w-24 bg-zinc-900 overflow-hidden border border-white/5 rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider line-clamp-1">{item.title}</h3>
                            <p className="text-[11px] font-mono text-zinc-400">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                          {item.size && (
                            <p className="text-[9px] uppercase tracking-widest text-zinc-500">Size: {item.size}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-white/10 rounded-full px-1.5 h-8 bg-black">
                            <button
                              onClick={() => updateQuantity(item.product, item.quantity - 1, item.size)}
                              className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-[10px] font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product, item.quantity + 1, item.size)}
                              className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product, item.size)}
                            className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-zinc-950/80 backdrop-blur-md space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Total</span>
                    <span className="text-sm font-mono font-bold text-white">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/checkout" 
                    onClick={closeDrawer}
                    className="w-full h-12 bg-white text-black text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors group"
                  >
                    Proceed to Checkout
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-[8px] text-center text-zinc-600 uppercase tracking-widest">
                    Secured Checkout
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

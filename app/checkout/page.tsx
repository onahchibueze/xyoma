'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, ArrowRight, ShieldCheck, Truck, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import Image from 'next/image';
import { formatPrice } from '@/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, totalPrice, totalQuantity, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        orderItems: items.map(item => ({
          product: item.product,
          title: item.title,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          size: item.size
        })),
        shippingInfo,
        itemsPrice: totalPrice,
        shippingPrice: totalPrice > 500 ? 0 : 50, // Example logic
        taxPrice: totalPrice * 0.05,
        totalPrice: totalPrice + (totalPrice > 500 ? 0 : 50) + (totalPrice * 0.05),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        clearCart();
        // Clear from DB too if logged in
        if (session) {
          await fetch('/api/cart', { method: 'DELETE' });
        }
        router.push('/orders?success=true');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/checkout');
    return null;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <SectionWrapper id="checkout" className="pt-32 pb-24">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
              Secure Checkout / Step 1 of 1
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.85]">
              Order <span className="text-zinc-600 italic">Finalization</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left: Shipping Form */}
            <div className="lg:col-span-7 space-y-12">
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                    <Truck size={16} className="text-zinc-500" />
                    Logistics Protocol
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Shipping Address</label>
                      <input
                        required
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleChange}
                        placeholder="STREET NAME, APARTMENT, ETC."
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-5 text-xs uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">City</label>
                        <input
                          required
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleChange}
                          placeholder="LAGOS, ABUJA, ETC."
                          className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-5 text-xs uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Postal Code</label>
                        <input
                          required
                          name="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={handleChange}
                          placeholder="101233"
                          className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-5 text-xs uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Country</label>
                        <select
                          required
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleChange}
                          className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-5 text-xs uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all appearance-none"
                        >
                          <option value="">Select Country</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Contact Number</label>
                        <input
                          required
                          name="phoneNo"
                          value={shippingInfo.phoneNo}
                          onChange={handleChange}
                          placeholder="+234 ..."
                          className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-5 text-xs uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                      <ShieldCheck size={16} className="text-[#c5a059]" />
                      Payment Protocol
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 leading-relaxed">
                      For this foundation phase, we only support <span className="text-white">Payment on Delivery</span>. 
                      Online payment modules are currently in technical incubation.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-8 bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3 border-b border-white/5 pb-6">
                  <Package size={16} className="text-zinc-500" />
                  Bag Authentication
                </h3>

                <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {items.map((item) => (
                    <div key={`${item.product}-${item.size}`} className="flex gap-4">
                      <div className="relative aspect-[3/4] w-16 bg-zinc-900 overflow-hidden border border-white/5 rounded-lg flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center gap-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider line-clamp-1">{item.title}</h4>
                          <span className="text-[10px] font-mono text-zinc-400">x{item.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase tracking-widest text-zinc-500">Size: {item.size || 'OS'}</span>
                          <span className="text-[10px] font-mono">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-white/5 pt-6">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                    <span>Artifacts Value</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                    <span>Logistics Fee</span>
                    <span>{formatPrice(totalPrice > 500 ? 0 : 50)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                    <span>Heritage Tax (5%)</span>
                    <span>{formatPrice(totalPrice * 0.05)}</span>
                  </div>
                  <div className="pt-4 flex justify-between border-t border-white/5">
                    <span className="text-sm font-bold uppercase tracking-[0.3em]">Total Protocol</span>
                    <span className="text-lg font-mono font-bold text-white">
                      {formatPrice(totalPrice + (totalPrice > 500 ? 0 : 50) + (totalPrice * 0.05))}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading || items.length === 0}
                  className="w-full h-14 bg-white text-black text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 rounded-full hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Confirm Identity Order
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}

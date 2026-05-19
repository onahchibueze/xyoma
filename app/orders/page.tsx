'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Package, Truck, CheckCircle2, Clock, XCircle, ShieldCheck, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import BackButton from '@/components/BackButton';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils';

const statusIcons = {
  Processing: <Clock className="text-blue-400" size={14} />,
  Shipped: <Truck className="text-yellow-400" size={14} />,
  Delivered: <CheckCircle2 className="text-green-400" size={14} />,
  Cancelled: <XCircle className="text-red-400" size={14} />,
};

function OrdersContent() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleSuccess, setVisibleSuccess] = useState(showSuccess);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (res.ok) setOrders(data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  useEffect(() => {
    if (visibleSuccess) {
      const timer = setTimeout(() => setVisibleSuccess(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [visibleSuccess]);

  if (status === 'loading') return null;

  return (
    <SectionWrapper id="orders" className="pt-32 pb-24">
      <div className="flex flex-col gap-12">
        <BackButton />
        
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
            Order History
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.85]">
            Order <span className="text-zinc-600 italic">History</span>
          </h1>
        </div>

        {visibleSuccess && (
          <div className="bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-10 h-10 rounded-full bg-[#c5a059] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="text-black" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">Order Successful</h3>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Your order has been confirmed and added to your history.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-6 opacity-40">
            <Package size={48} strokeWidth={1} />
            <p className="text-[10px] uppercase tracking-[0.4em]">No orders found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div 
                key={order._id}
                className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-10 space-y-8 hover:border-white/10 transition-colors group"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Order ID</p>
                    <p className="text-sm font-mono font-bold group-hover:text-white transition-colors">#{order._id.toUpperCase()}</p>
                  </div>
                  <div className="flex flex-wrap gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500">Order Date</p>
                      <p className="text-xs uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500">Total Amount</p>
                      <p className="text-xs font-mono font-bold">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500">Order Status</p>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                        {statusIcons[order.orderStatus as keyof typeof statusIcons]}
                        <span className="text-[9px] uppercase tracking-widest font-bold">{order.orderStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left: Items */}
                  <div className="lg:col-span-6 space-y-6">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                      <Package size={12} />
                      Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.orderItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-4 bg-zinc-900/30 rounded-2xl border border-transparent hover:border-white/5 transition-all">
                          <div className="relative aspect-[3/4] w-16 bg-zinc-900 overflow-hidden rounded-lg flex-shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex flex-col justify-center gap-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider">{item.title}</p>
                            <div className="flex gap-4 text-[9px] uppercase tracking-widest text-zinc-500">
                              <span>Size: {item.size || 'OS'}</span>
                              <span>Qty: {item.quantity}</span>
                              <span className="font-mono text-zinc-400">{formatPrice(item.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Middle: Order Details */}
                  <div className="lg:col-span-3 space-y-6">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                      <CreditCard size={12} />
                      Payment Details
                    </h4>
                    <div className="bg-zinc-900/30 rounded-2xl p-6 border border-white/5 space-y-4">
                      <div className="flex justify-between text-[9px] uppercase tracking-widest text-zinc-500">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatPrice(order.itemsPrice)}</span>
                      </div>
                      <div className="flex justify-between text-[9px] uppercase tracking-widest text-zinc-500">
                        <span>Shipping</span>
                        <span className="font-mono">{formatPrice(order.shippingPrice)}</span>
                      </div>
                      <div className="flex justify-between text-[9px] uppercase tracking-widest text-zinc-500">
                        <span>Tax</span>
                        <span className="font-mono">{formatPrice(order.taxPrice)}</span>
                      </div>
                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase tracking-widest text-zinc-600">Payment Status</span>
                          <div className={cn(
                            "flex items-center gap-2 px-2 py-1 rounded-md w-fit",
                            order.paymentInfo?.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                          )}>
                            <ShieldCheck size={10} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{order.paymentInfo?.status || 'Pending'}</span>
                          </div>
                        </div>
                        {order.paymentInfo?.id && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] uppercase tracking-widest text-zinc-600">Transaction ID</span>
                            <span className="text-[9px] font-mono text-zinc-500 truncate">{order.paymentInfo.id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Logistics */}
                  <div className="lg:col-span-3 space-y-6">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                      <Truck size={12} />
                      Shipping Info
                    </h4>
                    <div className="bg-zinc-900/30 rounded-2xl p-6 border border-white/5 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest text-zinc-600">Destination</p>
                        <p className="text-[10px] uppercase tracking-widest leading-relaxed text-zinc-300">
                          {order.shippingInfo.address}<br />
                          {order.shippingInfo.city}, {order.shippingInfo.postalCode}<br />
                          {order.shippingInfo.country}
                        </p>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-white/5">
                        <p className="text-[8px] uppercase tracking-widest text-zinc-600">Contact</p>
                        <p className="text-[10px] font-mono tracking-widest text-zinc-400">{order.shippingInfo.phoneNo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export default function OrdersPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
        </div>
      }>
        <OrdersContent />
      </Suspense>
      <Footer />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Package, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils';

const statusIcons = {
  Processing: <Clock className="text-blue-400" size={14} />,
  Shipped: <Truck className="text-yellow-400" size={14} />,
  Delivered: <CheckCircle2 className="text-green-400" size={14} />,
  Cancelled: <XCircle className="text-red-400" size={14} />,
};

export default function OrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (status === 'loading') return null;

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <SectionWrapper id="orders" className="pt-32 pb-24">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
              Artifact Archives / History
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.85]">
              Order <span className="text-zinc-600 italic">History</span>
            </h1>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-6 opacity-40">
              <Package size={48} strokeWidth={1} />
              <p className="text-[10px] uppercase tracking-[0.4em]">No artifacts claimed yet</p>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div 
                  key={order._id}
                  className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-10 space-y-8 hover:border-white/10 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500">Artifact Identifier</p>
                      <p className="text-sm font-mono font-bold">#{order._id.toUpperCase()}</p>
                    </div>
                    <div className="flex flex-wrap gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Date Authenticated</p>
                        <p className="text-xs uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Total Protocol</p>
                        <p className="text-xs font-mono font-bold">{formatPrice(order.totalPrice)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Logistics Status</p>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                          {statusIcons[order.orderStatus as keyof typeof statusIcons]}
                          <span className="text-[9px] uppercase tracking-widest font-bold">{order.orderStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Items Authenticated</h4>
                      <div className="space-y-4">
                        {order.orderItems.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4">
                            <div className="relative aspect-[3/4] w-16 bg-zinc-900 overflow-hidden rounded-lg flex-shrink-0">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="text-[11px] font-bold uppercase tracking-wider">{item.title}</p>
                              <div className="flex gap-4 text-[9px] uppercase tracking-widest text-zinc-500 mt-1">
                                <span>Size: {item.size || 'OS'}</span>
                                <span>Qty: {item.quantity}</span>
                                <span>{formatPrice(item.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Logistics Info</h4>
                      <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                        <div className="space-y-1">
                          <p className="text-[8px] uppercase tracking-widest text-zinc-600">Shipment Destination</p>
                          <p className="text-[10px] uppercase tracking-widest leading-relaxed">
                            {order.shippingInfo.address}, {order.shippingInfo.city}<br />
                            {order.shippingInfo.postalCode}, {order.shippingInfo.country}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] uppercase tracking-widest text-zinc-600">Contact Protocol</p>
                          <p className="text-[10px] font-mono tracking-widest">{order.shippingInfo.phoneNo}</p>
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

      <Footer />
    </div>
  );
}

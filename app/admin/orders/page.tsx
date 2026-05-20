'use client';

import { useEffect, useState, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Package, Filter, ExternalLink, RefreshCw, Search, ShieldCheck, TrendingUp, Wallet, ShoppingBag, ChevronDown, ChevronUp, MapPin, Phone, Mail, User, Clock, Truck, CheckCircle2, XCircle, CreditCard } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils';
import Image from 'next/image';

const statusIcons = {
  Pending: <Clock className="text-zinc-500" size={14} />,
  Processing: <Clock className="text-blue-400" size={14} />,
  Shipped: <Truck className="text-yellow-400" size={14} />,
  Delivered: <CheckCircle2 className="text-green-400" size={14} />,
  Cancelled: <XCircle className="text-red-400" size={14} />,
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok) setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, session, router]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'All' || order.orderStatus === filter;
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Financial Stats
  const stats = {
    totalRevenue: orders.reduce((sum, o) => o.paymentInfo?.status === 'Paid' ? sum + o.totalPrice : sum, 0),
    pendingClaims: orders.reduce((sum, o) => o.paymentInfo?.status !== 'Paid' ? sum + o.totalPrice : sum, 0),
    totalOrders: orders.length
  };

  if (status === 'loading' || !session) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
            XYOMA / Order Management
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
            Order <span className="text-zinc-600 italic">Management</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchOrders}
            className="p-3 bg-zinc-900 border border-white/5 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </button>
          <div className="bg-zinc-900 border border-white/5 rounded-full px-6 py-3 flex items-center gap-3">
            <Filter size={14} className="text-zinc-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-[10px] uppercase tracking-widest font-bold focus:outline-none"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <TrendingUp size={16} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Total Revenue</span>
          </div>
          <p className="text-3xl font-mono font-bold tracking-tighter">{formatPrice(stats.totalRevenue)}</p>
        </div>
        <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-3 text-zinc-500">
            <Wallet size={16} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Pending Revenue</span>
          </div>
          <p className="text-3xl font-mono font-bold tracking-tighter text-zinc-400">{formatPrice(stats.pendingClaims)}</p>
        </div>
        <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-3 text-[#c5a059]">
            <ShoppingBag size={16} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Total Orders</span>
          </div>
          <p className="text-3xl font-mono font-bold tracking-tighter">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input 
          type="text"
          placeholder="SEARCH BY ORDER ID, CUSTOMER OR EMAIL..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-[10px] uppercase tracking-widest focus:outline-none focus:border-white/10 transition-all"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Order ID</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Customer</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Amount</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Payment Status</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Order Status</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin inline-block text-zinc-700" size={32} />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-[10px] uppercase tracking-[0.4em] text-zinc-600">
                    No active orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <Fragment key={order._id}>
                    <tr 
                      onClick={() => toggleExpand(order._id)}
                      className={cn(
                        "group hover:bg-white/[0.02] transition-colors cursor-pointer",
                        expandedOrderId === order._id && "bg-white/[0.04] border-l-2 border-[#c5a059]"
                      )}
                    >
                      <td className="px-8 py-6 font-mono text-[11px] font-bold">
                        <span className="text-zinc-600">#</span>{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold uppercase tracking-wider">{order.userId?.name || 'Unknown'}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{order.userId?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-xs font-bold">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="px-8 py-6">
                        <div className={cn(
                          "flex items-center gap-2 w-fit px-2 py-1 rounded-md",
                          order.paymentInfo?.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-900 text-zinc-500"
                        )}>
                          <ShieldCheck size={10} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">{order.paymentInfo?.status || 'Pending'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {statusIcons[order.orderStatus as keyof typeof statusIcons]}
                          <span className={cn(
                            "text-[9px] uppercase tracking-widest font-bold",
                            order.orderStatus === 'Delivered' && "text-green-400",
                            order.orderStatus === 'Processing' && "text-blue-400",
                            order.orderStatus === 'Shipped' && "text-yellow-400",
                            order.orderStatus === 'Cancelled' && "text-red-400"
                          )}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          className="p-2 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-all"
                        >
                          {expandedOrderId === order._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Content */}
                    {expandedOrderId === order._id && (
                      <tr className="bg-zinc-950/50">
                        <td colSpan={6} className="px-8 py-10">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-top-2 duration-500">
                            {/* Left: Customer & Shipping */}
                            <div className="lg:col-span-4 space-y-8">
                              <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                                  <User size={12} />
                                  Customer Details
                                </h4>
                                <div className="bg-zinc-900/30 rounded-2xl p-6 border border-white/5 space-y-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                      {order.userId?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold uppercase tracking-wider">{order.userId?.name || 'Unknown'}</span>
                                      <span className="text-[10px] text-zinc-500 font-mono">{order.userId?.email || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="pt-4 border-t border-white/5 space-y-3">
                                    <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                                      <Phone size={12} className="text-zinc-600" />
                                      <span className="font-mono tracking-widest">{order.shippingInfo.phoneNo}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                                      <Mail size={12} className="text-zinc-600" />
                                      <span className="font-mono">{order.userId?.email || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                                  <MapPin size={12} />
                                  Delivery Information
                                </h4>
                                <div className="bg-zinc-900/30 rounded-2xl p-6 border border-white/5 space-y-4">
                                  <p className="text-[10px] uppercase tracking-[0.2em] leading-relaxed text-zinc-300">
                                    {order.shippingInfo.address}<br />
                                    {order.shippingInfo.city}, {order.shippingInfo.state}<br />
                                    {order.shippingInfo.postalCode}<br />
                                    {order.shippingInfo.country}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Middle: Order Items */}
                            <div className="lg:col-span-5 space-y-4">
                              <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                                <Package size={12} />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.orderItems.map((item: any, idx: number) => (
                                  <div key={idx} className="flex gap-4 p-4 bg-zinc-900/30 rounded-2xl border border-white/5">
                                    <div className="relative aspect-[3/4] w-14 bg-zinc-900 overflow-hidden rounded-lg flex-shrink-0">
                                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-center gap-1">
                                      <p className="text-[10px] font-bold uppercase tracking-wider">{item.title}</p>
                                      <div className="flex gap-4 text-[9px] uppercase tracking-widest text-zinc-500">
                                        <span>Size: {item.size || 'OS'}</span>
                                        <span>Qty: {item.quantity}</span>
                                        <span className="font-mono text-zinc-400">{formatPrice(item.price)}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-zinc-900/30 rounded-2xl p-6 border border-white/5 space-y-3">
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
                                <div className="pt-3 border-t border-white/5 flex justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Amount</span>
                                  <span className="text-sm font-mono font-bold">{formatPrice(order.totalPrice)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Payment & Status Controls */}
                            <div className="lg:col-span-3 space-y-8">
                              <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                                  <CreditCard size={12} />
                                  Payment Details
                                </h4>
                                <div className="bg-zinc-900/30 rounded-2xl p-6 border border-white/5 space-y-4">
                                  <div className="space-y-1">
                                    <span className="text-[8px] uppercase tracking-widest text-zinc-600 block">Method</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{order.paymentInfo.method}</span>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[8px] uppercase tracking-widest text-zinc-600 block">Status</span>
                                    <div className={cn(
                                      "flex items-center gap-2 px-2 py-1 rounded-md w-fit",
                                      order.paymentInfo?.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                                    )}>
                                      <ShieldCheck size={10} />
                                      <span className="text-[9px] font-bold uppercase tracking-widest">{order.paymentInfo?.status || 'Pending'}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[8px] uppercase tracking-widest text-zinc-600 block">Reference</span>
                                    <span className="text-[9px] font-mono text-zinc-500 break-all">{order.paymentInfo.id}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                                  <TrendingUp size={12} />
                                  Order Workflow
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order._id, 'Processing'); }}
                                    disabled={order.orderStatus === 'Processing'}
                                    className={cn(
                                      "w-full py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all",
                                      order.orderStatus === 'Processing' 
                                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400 cursor-not-allowed"
                                        : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800"
                                    )}
                                  >
                                    Mark as Processing
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order._id, 'Shipped'); }}
                                    disabled={order.orderStatus === 'Shipped'}
                                    className={cn(
                                      "w-full py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all",
                                      order.orderStatus === 'Shipped' 
                                        ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 cursor-not-allowed"
                                        : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800"
                                    )}
                                  >
                                    Mark as Shipped
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order._id, 'Delivered'); }}
                                    disabled={order.orderStatus === 'Delivered'}
                                    className={cn(
                                      "w-full py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all",
                                      order.orderStatus === 'Delivered' 
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-not-allowed"
                                        : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800"
                                    )}
                                  >
                                    Mark as Delivered
                                  </button>
                                  <div className="pt-2">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); updateStatus(order._id, 'Cancelled'); }}
                                      disabled={order.orderStatus === 'Cancelled'}
                                      className={cn(
                                        "w-full py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all",
                                        order.orderStatus === 'Cancelled' 
                                          ? "bg-red-500/10 border-red-500/20 text-red-400 cursor-not-allowed"
                                          : "bg-red-500/5 border-red-500/10 text-red-500/50 hover:bg-red-500/10 hover:text-red-500"
                                      )}
                                    >
                                      Cancel Order
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


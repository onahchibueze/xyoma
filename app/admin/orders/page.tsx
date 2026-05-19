'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Package, Filter, ExternalLink, RefreshCw, Search, ShieldCheck, TrendingUp, Wallet, ShoppingBag } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils';

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-right">Actions</th>
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
                  <tr key={order._id} className="group hover:bg-white/[0.02] transition-colors">
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
                      {order.paymentInfo?.id && (
                        <p className="text-[8px] font-mono text-zinc-600 mt-1 truncate max-w-[100px]">{order.paymentInfo.id}</p>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={cn(
                          "bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold focus:outline-none transition-colors",
                          order.orderStatus === 'Delivered' && "text-green-400",
                          order.orderStatus === 'Processing' && "text-blue-400",
                          order.orderStatus === 'Shipped' && "text-yellow-400",
                          order.orderStatus === 'Cancelled' && "text-red-400"
                        )}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                        className="p-2 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


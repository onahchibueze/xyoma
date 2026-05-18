'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { signOut } from 'next-auth/react';

const navItems = [
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Add Product', href: '/admin/products/new', icon: Plus },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 bg-black border-r border-white/10 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col px-4 py-8">
          <div className="flex items-center justify-between mb-10 px-2">
            <Link href="/admin/products" className="text-2xl font-bold tracking-tighter text-white">
              XYOMA<span className="text-[10px] align-top ml-1 border border-white/20 px-1 py-0.5">ADMIN</span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/admin');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200",
                    isActive 
                      ? "bg-white text-black font-medium" 
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-6">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex w-full items-center gap-3 px-3 py-3 text-sm text-red-500/80 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

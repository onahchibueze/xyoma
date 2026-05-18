'use client';

import { Menu, Search, Bell, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface AdminNavbarProps {
  onOpenSidebar: () => void;
}

export default function AdminNavbar({ onOpenSidebar }: AdminNavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-md px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden text-white/70 hover:text-white"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 focus-within:border-white/30 transition-all duration-200">
          <Search size={16} className="text-white/40" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-transparent border-none text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-0 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-white/70 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-white border border-black" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden xs:block">
            <p className="text-sm font-medium text-white">{session?.user?.name}</p>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">{session?.user?.role}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                width={32} 
                height={32} 
                className="h-full w-full object-cover"              />
            ) : (
              <User size={16} className="text-white/70" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

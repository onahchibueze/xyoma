'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminNavbar 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <footer className="border-t border-white/10 py-6 px-4 lg:px-8 text-center lg:text-left">
          <p className="text-xs text-white/30 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} XYOMA LUXURY ADMIN • SYSTEM v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CartDrawer from "../CartDrawer";

const navLinks = [
  { name: "New Arrivals", href: "/collection?sort=newest" },
  { 
    name: "Men", 
    href: "/collection?category=Men",
    dropdown: [
      { name: "All Men", href: "/collection?category=Men" },
      { name: "Tops", href: "/collection?category=Tops" },
      { name: "Bottoms", href: "/collection?category=Bottoms" },
      { name: "Outerwear", href: "/collection?category=Outerwear" },
    ]
  },
  { 
    name: "Women", 
    href: "/collection?category=Women",
    dropdown: [
      { name: "All Women", href: "/collection?category=Women" },
      { name: "Dresses", href: "/collection?category=Dresses" },
      { name: "Gown", href: "/collection?category=Gown" },
      { name: "Tops", href: "/collection?category=Tops" },
    ]
  },
  { name: "Collections", href: "/collection" },
  { name: "Classics", href: "/collection?category=Heritage" },
];

export default function CollectionNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const pathname = usePathname();
  const { totalQuantity, openDrawer } = useCartStore();
  const { data: session, status } = useSession();
  
  const navRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Entrance Animation
  useGSAP(() => {
    gsap.fromTo(navRef.current, 
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      }
    );
  }, { scope: navRef });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-[padding,background-color,border-color,backdrop-filter] duration-700 ease-in-out px-6 md:px-12",
          isScrolled 
            ? "py-4 bg-black/90 backdrop-blur-xl border-b border-white/5" 
            : "py-8 bg-transparent"
        )}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          
          {/* LEFT: Logo */}
          <div className="flex-1 flex items-center">
            <Link 
              href="/" 
              className="text-xl md:text-2xl font-black tracking-[0.5em] uppercase hover:opacity-70 transition-opacity text-white"
            >
              XYOMA
            </Link>
          </div>
          
          {/* CENTER: Links */}
          <div className="hidden lg:flex items-center justify-center gap-10 flex-[2]">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative group py-2"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-300 flex items-center gap-1",
                    pathname === link.href ? "text-white" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown size={10} className={cn("transition-transform duration-300", activeDropdown === link.name && "rotate-180")} />
                  )}
                </Link>
                
                {/* Underline Animation */}
                <div className={cn(
                  "absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-500 ease-out",
                  activeDropdown === link.name || pathname === link.href ? "w-full" : "w-0"
                )} />

                {/* Dropdown */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-56"
                      >
                        <div className="bg-zinc-950 border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                          <div className="flex flex-col gap-4">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors block"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT: Icons */}
          <div className="flex-1 flex items-center justify-end gap-6 md:gap-8">
            
            {/* User Account */}
            <div className="relative" ref={userMenuRef}>
              {status === "authenticated" ? (
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-white transition-colors flex items-center justify-center bg-zinc-900"
                >
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      width={32} 
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <UserIcon size={14} className="text-white" strokeWidth={1.5} />
                  )}
                </button>
              ) : (
                <Link 
                  href="/login"
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <UserIcon size={20} strokeWidth={1.5} />
                </Link>
              )}

              <AnimatePresence>
                {isUserMenuOpen && status === "authenticated" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-6 w-56 bg-zinc-950 border border-white/10 p-2 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest truncate font-bold">{session.user?.name}</p>
                      <p className="text-[8px] text-zinc-600 truncate">{session.user?.email}</p>
                    </div>
                    
                    {session.user.role === 'admin' && (
                      <Link 
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-[9px] uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <LayoutDashboard size={12} />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center gap-3 w-full px-4 py-3 text-[9px] uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all mt-1"
                    >
                      <LogOut size={12} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Icon */}
            <button 
              onClick={openDrawer}
              className="relative p-1 text-zinc-400 hover:text-white transition-colors group"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[8px] font-black flex items-center justify-center rounded-full">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-[100] bg-black border-l border-white/10 lg:hidden flex flex-col pt-32 px-10"
            >
              <div className="flex flex-col gap-12">
                <Link 
                  href="/" 
                  className="text-2xl font-black tracking-[0.5em] uppercase text-white mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  XYOMA
                </Link>
                <div className="flex flex-col gap-8">
                  {navLinks.map((link, idx) => (
                  <motion.div 
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    className="flex flex-col gap-4"
                  >
                    <Link
                      href={link.href}
                      className="text-3xl font-bold uppercase tracking-tighter hover:text-zinc-400 transition-colors"
                      onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <div className="flex flex-col gap-4 pl-4 border-l border-white/5">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                </div>
              </div>

              <div className="mt-auto pb-12 flex flex-col gap-6">
                <div className="h-px bg-white/5 w-full" />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-bold">Follow Us</p>
                  <div className="flex gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">IG</span>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">TW</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

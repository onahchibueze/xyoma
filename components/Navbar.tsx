"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useSession, signOut } from "next-auth/react";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import Image from "next/image";
import { cn } from "@/utils/cn";

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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const isCollectionPage = pathname === "/collection";
  
  const { totalQuantity, openDrawer } = useCartStore();
  const { data: session, status } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".nav-reveal", {
      y: -20,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.05,
      delay: 0.2
    });
  }, { scope: navRef });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          isScrolled 
            ? "bg-black/80 backdrop-blur-lg border-b border-white/5 py-4" 
            : "bg-transparent py-8"
        )}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-1 flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-black tracking-[0.5em] uppercase hover:opacity-70 transition-opacity"
            >
              XYOMA
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center gap-10 flex-[2]">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative group nav-reveal"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.3em] font-bold transition-colors hover:text-white flex items-center gap-1.5",
                    pathname === link.href ? "text-white" : "text-zinc-400"
                  )}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[7px] bg-[#c5a059] text-black px-1.5 py-0.5 rounded-[1px] font-black leading-none">
                      {link.badge}
                    </span>
                  )}
                  {link.dropdown && (
                    <ChevronDown size={10} className={cn("transition-transform duration-300", activeDropdown === link.name && "rotate-180")} />
                  )}
                </Link>

                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48"
                      >
                        <div className="bg-zinc-950 border border-white/10 p-5 shadow-2xl backdrop-blur-xl text-center">
                          <div className="flex flex-col gap-4">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
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

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-5 md:gap-8 nav-reveal">
            {/* Global Search - Hidden on collection page because it has its own search */}
            {!isCollectionPage && (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1 hover:text-[#c5a059] transition-colors group"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
            )}

            <button 
              onClick={openDrawer}
              className="relative p-1 hover:text-[#c5a059] transition-colors group"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white text-black text-[7px] font-black flex items-center justify-center rounded-full">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* User Auth Section */}
            <div className="relative" ref={userMenuRef}>
              {status === "authenticated" ? (
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-7 h-7 rounded-full overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
                >
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      width={28} 
                      height={28}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <UserIcon size={12} className="text-white/70" />
                    </div>
                  )}
                </button>
              ) : (
                <Link 
                  href="/login"
                  className="p-1 hover:text-[#c5a059] transition-colors block"
                  aria-label="Login"
                >
                  <UserIcon size={18} strokeWidth={1.5} />
                </Link>
              )}

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && status === "authenticated" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full right-0 mt-4 w-48 bg-zinc-950 border border-white/10 p-2 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest truncate">{session.user?.name}</p>
                      <p className="text-[8px] text-zinc-600 truncate">{session.user?.email}</p>
                    </div>
                    
                    {session.user.role === 'admin' && (
                      <Link 
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2 text-[9px] uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-all group"
                      >
                        <LayoutDashboard size={12} />
                        Admin Panel
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center gap-3 w-full px-3 py-2 text-[9px] uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all group mt-1"
                    >
                      <LogOut size={12} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-white"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[40] bg-zinc-950 pt-32 px-8 flex flex-col"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col gap-4">
                  <Link
                    href={link.href}
                    className="text-3xl font-bold uppercase tracking-tighter"
                    onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="flex flex-col gap-3 pl-4 border-l border-white/10">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-xs uppercase tracking-[0.2em] text-zinc-500"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

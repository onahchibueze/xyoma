import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  product: string; // Product ID
  title: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      acc.totalQuantity += item.quantity;
      acc.totalPrice += item.price * item.quantity;
      return acc;
    },
    { totalQuantity: 0, totalPrice: 0 }
  );
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      isDrawerOpen: false,
      
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.product === item.product && i.size === item.size
          );

          let newItems;
          if (existingItemIndex > -1) {
            newItems = state.items.map((i, idx) =>
              idx === existingItemIndex
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }

          const { totalQuantity, totalPrice } = calculateTotals(newItems);
          return { items: newItems, totalQuantity, totalPrice, isDrawerOpen: true };
        }),

      removeItem: (id, size) =>
        set((state) => {
          const newItems = state.items.filter(
            (i) => !(i.product === id && i.size === size)
          );
          const { totalQuantity, totalPrice } = calculateTotals(newItems);
          return { items: newItems, totalQuantity, totalPrice };
        }),

      updateQuantity: (id, quantity, size) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.product === id && i.size === size ? { ...i, quantity: Math.max(1, quantity) } : i
          );
          const { totalQuantity, totalPrice } = calculateTotals(newItems);
          return { items: newItems, totalQuantity, totalPrice };
        }),

      clearCart: () => set({ items: [], totalQuantity: 0, totalPrice: 0 }),
      
      setCart: (items) => {
        const { totalQuantity, totalPrice } = calculateTotals(items);
        set({ items, totalQuantity, totalPrice });
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items, 
        totalQuantity: state.totalQuantity, 
        totalPrice: state.totalPrice 
      }), // Don't persist isDrawerOpen
    }
  )
);

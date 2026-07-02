"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string; // menu item ID
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("unibites_cart");
      if (saved && saved !== "undefined") {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("unibites_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      if (prev.length > 0 && prev[0].restaurantId !== item.restaurantId) {
        if (!window.confirm(`You already have items from ${prev[0].restaurantName}. Clear cart to order from ${item.restaurantName}?`)) {
          return prev;
        }
        return [{ ...item, quantity: 1 }];
      }

      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseItem = (id: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const getTotal = () => items.reduce((acc, current) => acc + current.price * current.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, decreaseItem, removeItem, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

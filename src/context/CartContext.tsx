"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { StaticImageData } from 'next/image';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string | StaticImageData;
  selectedSize: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  removeItem: (id: string, size: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === newItem.id && item.selectedSize === newItem.selectedSize
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id && item.selectedSize === newItem.selectedSize
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.selectedSize === size) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string, size: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size)));
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
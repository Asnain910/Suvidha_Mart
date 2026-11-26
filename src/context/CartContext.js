'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sm_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const save = (updated) => {
    setItems(updated);
    localStorage.setItem('sm_cart', JSON.stringify(updated));
  };

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      } else {
        updated = [...prev, { ...product, qty }];
      }
      localStorage.setItem('sm_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    const updated = items.filter(i => i.id !== id);
    save(updated);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    const updated = items.map(i => i.id === id ? { ...i, qty } : i);
    save(updated);
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('sm_cart');
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

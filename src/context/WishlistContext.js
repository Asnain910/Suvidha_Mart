'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sm_wishlist');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const toggle = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      const updated = exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
      localStorage.setItem('sm_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isWished = (id) => items.some(i => i.id === id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWished }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

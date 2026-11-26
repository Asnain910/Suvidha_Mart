'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES } from '@/lib/data';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Fetch from API and sync with state
  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products').then((r) => r.json()).catch(() => null),
        fetch('/api/categories').then((r) => r.json()).catch(() => null),
      ]);

      if (prodRes && prodRes.success && prodRes.products && prodRes.products.length > 0) {
        setProducts(prodRes.products);
        localStorage.setItem('sm_products', JSON.stringify(prodRes.products));
      } else {
        const savedP = localStorage.getItem('sm_products');
        if (savedP) setProducts(JSON.parse(savedP));
        else localStorage.setItem('sm_products', JSON.stringify(PRODUCTS));
      }

      if (catRes && catRes.success && catRes.categories && catRes.categories.length > 0) {
        setCategories(catRes.categories);
        localStorage.setItem('sm_categories', JSON.stringify(catRes.categories));
      } else {
        const savedC = localStorage.getItem('sm_categories');
        if (savedC) setCategories(JSON.parse(savedC));
        else localStorage.setItem('sm_categories', JSON.stringify(CATEGORIES));
      }
    } catch (e) {
      const savedP = localStorage.getItem('sm_products');
      const savedC = localStorage.getItem('sm_categories');
      if (savedP) setProducts(JSON.parse(savedP));
      if (savedC) setCategories(JSON.parse(savedC));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem('sm_products', JSON.stringify(updated));
  };

  const addProduct = async (product) => {
    const tempId = `p${Date.now()}`;
    const newP = { ...product, id: product.id || tempId, rating: 4.5, reviews: 0 };

    // Optimistic UI update
    const updated = [newP, ...products];
    saveProducts(updated);

    const token = localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    if (token) {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newP),
        });
        const data = await res.json();
        if (data.success && data.product) {
          const synced = products.map((p) => (p.id === tempId ? data.product : p));
          saveProducts(synced);
          return data.product;
        }
      } catch (err) {}
    }
    return newP;
  };

  const updateProduct = async (id, data) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...data } : p));
    saveProducts(updated);

    const token = localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    if (token) {
      try {
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      } catch (err) {}
    }
  };

  const deleteProduct = async (id) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);

    const token = localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    if (token) {
      try {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {}
    }
  };

  const addCategory = async (cat) => {
    const tempId = cat.id || `c${Date.now()}`;
    const newC = { ...cat, id: tempId };
    const updated = [...categories, newC];
    setCategories(updated);
    localStorage.setItem('sm_categories', JSON.stringify(updated));

    const token = localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    if (token) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newC),
        });
        const data = await res.json();
        if (data.success && data.category) {
          const synced = categories.map((c) => (c.id === tempId ? data.category : c));
          setCategories(synced);
          localStorage.setItem('sm_categories', JSON.stringify(synced));
        }
      } catch (err) {}
    }
  };

  const deleteCategory = async (id) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('sm_categories', JSON.stringify(updated));

    const token = localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    if (token) {
      try {
        await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {}
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        refreshProducts: loadData,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);

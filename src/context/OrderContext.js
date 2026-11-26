'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS } from '@/lib/data';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const token = localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    try {
      const res = await fetch('/api/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        localStorage.setItem('sm_orders', JSON.stringify(data.orders));
      } else {
        const saved = localStorage.getItem('sm_orders');
        if (saved) setOrders(JSON.parse(saved));
        else localStorage.setItem('sm_orders', JSON.stringify(INITIAL_ORDERS));
      }
    } catch (e) {
      const saved = localStorage.getItem('sm_orders');
      if (saved) setOrders(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const save = (updated) => {
    setOrders(updated);
    localStorage.setItem('sm_orders', JSON.stringify(updated));
  };

  const placeOrder = async (userId, customerName, items, total, address, phone) => {
    const orderId = `ORD${String(Date.now()).slice(-6)}`;
    const newOrder = {
      id: orderId,
      userId,
      customerName,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      address,
      phone,
      isDemo: false,
    };

    // Optimistic local update
    const updated = [newOrder, ...orders];
    save(updated);

    const token = localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newOrder),
      });
      const data = await res.json();
      if (data.success && data.order) {
        const synced = orders.map((o) => (o.id === orderId ? data.order : o));
        save(synced);
        return data.order;
      }
    } catch (e) {}

    return newOrder;
  };

  const updateStatus = async (orderId, status) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    save(updated);

    const token = localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    if (token) {
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
      } catch (e) {}
    }
  };

  const getUserOrders = (userId) => orders.filter((o) => o.userId === userId);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        refreshOrders: loadOrders,
        placeOrder,
        updateStatus,
        getUserOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);

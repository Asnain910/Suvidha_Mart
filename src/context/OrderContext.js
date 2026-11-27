'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS } from '@/lib/data';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [loading, setLoading] = useState(true);

  // Centralized load from backend API
  const loadOrders = async () => {
    const token =
      (typeof window !== 'undefined' ? localStorage.getItem('sm_admin_token') : null) ||
      (typeof window !== 'undefined' ? localStorage.getItem('sm_token') : null);

    try {
      const res = await fetch('/api/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sm_orders', JSON.stringify(data.orders));
        }
        return data.orders;
      }
    } catch (e) {
      console.warn('Could not load orders from API, checking local cache:', e.message);
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sm_orders');
        if (saved) {
          try {
            setOrders(JSON.parse(saved));
          } catch (err) {}
        }
      }
    } finally {
      setLoading(false);
    }
    return orders;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sm_orders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
        } catch (e) {}
      }
    }
    loadOrders();
  }, []);

  const placeOrder = async (userId, customerName, items, total, address, phone, paymentMethod = 'Cash on Delivery') => {
    const token =
      (typeof window !== 'undefined' ? localStorage.getItem('sm_token') : null) ||
      (typeof window !== 'undefined' ? localStorage.getItem('sm_admin_token') : null);

    const clientOrderId = `ORD${Date.now().toString().slice(-6)}`;
    const orderPayload = {
      id: clientOrderId,
      userId,
      customerName,
      items,
      total,
      address,
      phone,
      paymentMethod,
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    if (!res.ok || !data.success || !data.order) {
      throw new Error(data.error || 'Failed to place order in backend database');
    }

    const createdOrder = data.order;
    setOrders((prev) => [createdOrder, ...prev.filter((o) => o.id !== createdOrder.id)]);
    if (typeof window !== 'undefined') {
      const current = JSON.parse(localStorage.getItem('sm_orders') || '[]');
      localStorage.setItem(
        'sm_orders',
        JSON.stringify([createdOrder, ...current.filter((o) => o.id !== createdOrder.id)])
      );
    }
    return createdOrder;
  };

  const updateStatus = async (orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

    const token =
      (typeof window !== 'undefined' ? localStorage.getItem('sm_admin_token') : null) ||
      (typeof window !== 'undefined' ? localStorage.getItem('sm_token') : null);

    if (token) {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (data.success && data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        }
      } catch (e) {
        console.warn('Failed to update order status on server:', e.message);
      }
    }
  };

  const getUserOrders = (userId) => orders.filter((o) => o.userId === userId || o.userId === String(userId));

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

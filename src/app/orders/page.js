'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STEP_ICONS = { pending: '📋', processing: '⚙️', shipped: '🚚', delivered: '✅' };
const STEP_LABELS = { pending: 'Order Placed', processing: 'Processing', shipped: 'Out for Delivery', delivered: 'Delivered' };

function StatusBadge({ status }) {
  return <span className={`status-badge ${status}`}>{STEP_ICONS[status]} {status}</span>;
}

function OrderCard({ order, onExpand, expanded }) {
  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{
        padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', flexWrap: 'wrap', gap: 12
      }} onClick={onExpand}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>#{order.id}</p>
              {(order.isDemo || order.id?.startsWith('ORD00')) && (
                <span style={{
                  background: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FCD34D',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  letterSpacing: '0.04em'
                }}>
                  DEMO ORDER
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily:'Outfit', fontWeight:700, color:'var(--primary)', fontSize:'1.1rem' }}>₹{order.total}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{order.items.length} items</p>
          </div>
          <span style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '20px' }}>
          {(order.isDemo || order.id?.startsWith('ORD00')) && (
            <div style={{
              background: '#FEF3C7',
              border: '1px solid #FCD34D',
              borderRadius: 'var(--radius)',
              padding: '8px 14px',
              marginBottom: 16,
              fontSize: '0.8rem',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>🧪</span>
              <span><strong>Demo Order:</strong> Sample demonstration order showing live order tracking and status updates.</span>
            </div>
          )}
          {/* Tracking */}
          <div className="tracking-steps">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className={`tracking-step ${i < stepIndex ? 'done' : i === stepIndex ? 'current' : ''}`}>
                <div className="tracking-dot">{i <= stepIndex ? STEP_ICONS[step] : '○'}</div>
                <div className="tracking-label">{STEP_LABELS[step]}</div>
              </div>
            ))}
          </div>

          {/* Items */}
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Ordered</p>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text2)' }}>{item.name} × {item.qty} ({item.unit})</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>₹{item.price * item.qty}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
              <span>Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          {/* Address */}
          <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span>📍</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>Delivery Address</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: 2 }}>{order.address}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>📞 {order.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const router = useRouter();
  const [expanded, setExpanded] = useState(null);

  if (!user) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content flex-center" style={{ minHeight: '60vh' }}>
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <h3 className="empty-state-title">Please Login First</h3>
            <p className="empty-state-desc">Sign in to view your orders</p>
            <Link href="/auth/login" className="btn btn-primary mt-20">Login Now</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const orders = getUserOrders(user.id);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div className="container"><h1>📦 My Orders</h1><p>{orders.length} orders placed</p></div>
        </div>

        <div className="container" style={{ padding: '40px 24px', maxWidth: 800 }}>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No orders yet</h3>
              <p className="empty-state-desc">You haven&apos;t placed any orders. Start shopping now!</p>
              <Link href="/products" className="btn btn-primary mt-20">🛒 Shop Now</Link>
            </div>
          ) : (
            orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expanded === order.id}
                onExpand={() => setExpanded(expanded === order.id ? null : order.id)}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

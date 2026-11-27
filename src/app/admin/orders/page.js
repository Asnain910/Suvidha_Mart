'use client';
import { useState, useEffect } from 'react';
import { useOrders } from '@/context/OrderContext';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: 'var(--accent2)', processing: 'var(--info)', shipped: 'var(--purple)', delivered: 'var(--primary)', cancelled: 'var(--danger)' };

export default function AdminOrdersPage() {
  const { orders, updateStatus, refreshOrders } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const syncOrders = async () => {
    setSyncing(true);
    try {
      if (refreshOrders) await refreshOrders();
    } catch (e) {
      console.warn('Orders sync error:', e);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    syncOrders();
  }, []);

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    await new Promise(r => setTimeout(r, 400));
    await updateStatus(orderId, newStatus);
    setUpdatingId(null);
  };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">🚚 Orders Management</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.85rem', color: 'var(--text3)' }}>
          <span>Total: <strong style={{ color: 'var(--text)' }}>{orders.length}</strong></span>
          <span>Pending: <strong style={{ color: 'var(--accent2)' }}>{orders.filter(o => o.status === 'pending').length}</strong></span>
          <button
            onClick={syncOrders}
            disabled={syncing}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ display: 'inline-block', transform: syncing ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s ease' }}>🔄</span>
            {syncing ? 'Syncing...' : 'Sync Live'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Filters */}
        <div className="filter-bar" style={{ marginBottom: 20 }}>
          <div className="filter-input-wrap">
            <span className="filter-input-icon">🔍</span>
            <input className="filter-input" style={{ paddingLeft: 36 }} placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['all', ...STATUS_OPTIONS].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
              >
                {s === 'all' ? '📋 All' : s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 && (
            <div className="empty-state"><div className="empty-state-icon">📭</div><h3 className="empty-state-title">No orders found</h3></div>
          )}
          {filtered.map(order => (
            <div key={order.id} className="admin-table-card">
              {/* Header Row */}
              <div
                style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: 12 }}
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'Outfit' }}>#{order.id}</p>
                      {(order.isDemo || order.id?.startsWith('ORD00')) && (
                        <span style={{
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FCD34D',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '10px',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase'
                        }}>
                          Demo
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                      {new Date(order.createdAt).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{order.customerName}</p>
                      {(order.isDemo || order.customerName?.includes('Demo') || order.userId === 'u1' || order.userId === 'u2' || order.userId === 'u3') && (
                        <span style={{
                          background: '#F1F5F9',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          padding: '1px 5px',
                          borderRadius: '8px'
                        }}>
                          Demo User
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>📞 {order.phone}</p>
                  </div>
                  <span className={`status-badge ${order.status}`}>{order.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>₹{order.total}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{order.items.length} items</span>
                  <span style={{ color: 'var(--text4)' }}>{expandedId === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded */}
              {expandedId === order.id && (
                <div style={{ borderTop: '1px solid var(--border)', padding: 20 }}>
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
                      <span><strong>Demo Order:</strong> Preloaded sample order to demonstrate status updating, order details, and customer tracking.</span>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    {/* Items */}
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📦 Order Items</p>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text2)' }}>{item.name} × {item.qty}</span>
                          <span style={{ fontWeight: 600 }}>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, color: 'var(--primary)' }}>
                        <span>Total</span><span>₹{order.total}</span>
                      </div>
                    </div>

                    {/* Address + Status */}
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Delivery Info</p>
                      <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 16 }}>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text)', marginBottom: 4 }}>{order.address}</p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>📞 {order.phone}</p>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🔄 Update Status</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {STATUS_OPTIONS.map(s => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(order.id, s)}
                            disabled={updatingId === order.id}
                            style={{
                              padding: '8px 14px',
                              border: `2px solid ${order.status === s ? STATUS_COLORS[s] : 'var(--border)'}`,
                              borderRadius: 'var(--radius)',
                              background: order.status === s ? `${STATUS_COLORS[s]}15` : 'transparent',
                              color: order.status === s ? STATUS_COLORS[s] : 'var(--text2)',
                              fontWeight: order.status === s ? 700 : 400,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'var(--transition)',
                            }}
                          >
                            {updatingId === order.id && order.status !== s ? '⟳' : order.status === s ? '● ' : '○ '}
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

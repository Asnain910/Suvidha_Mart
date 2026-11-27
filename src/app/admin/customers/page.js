'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';

export default function AdminCustomersPage() {
  const { getAllUsers, refreshUsers } = useAuth();
  const { getUserOrders, orders, refreshOrders } = useOrders();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const syncData = async () => {
    setSyncing(true);
    try {
      await Promise.all([
        refreshUsers ? refreshUsers() : Promise.resolve(),
        refreshOrders ? refreshOrders() : Promise.resolve(),
      ]);
    } catch (e) {
      console.warn('Sync error:', e);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  const customers = getAllUsers().filter(u => u.role === 'customer');

  const filtered = customers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const getCustomerStats = (userId) => {
    const userOrders = orders.filter(o => o.userId === userId || o.userId === String(userId));
    const totalSpent = userOrders.reduce((s, o) => o.status !== 'cancelled' ? s + o.total : s, 0);
    return { orderCount: userOrders.length, totalSpent, lastOrder: userOrders[0] };
  };

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-topbar-title">👥 Customers</h1>
          <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{customers.length} registered customers</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={syncData}
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
        <div className="filter-bar" style={{ marginBottom: 20 }}>
          <div className="filter-input-wrap">
            <span className="filter-input-icon">🔍</span>
            <input className="filter-input" style={{ paddingLeft: 36 }} placeholder="Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text3)', marginLeft: 'auto' }}>{filtered.length} customers</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 360px' : '1fr', gap: 20 }}>
          <div className="admin-table-card">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const stats = getCustomerStats(u.id);
                  return (
                    <tr key={u.id} style={{ background: selectedUser?.id === u.id ? 'var(--primary-bg)' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                            {u.avatar || u.name?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{u.name}</p>
                              {(u.isDemo || u.name?.includes('Demo') || u.id === 'u1' || u.id === 'u2' || u.id === 'u3' || u.id === 'u1-alt') && (
                                <span style={{
                                  background: '#FEF3C7',
                                  color: '#92400E',
                                  border: '1px solid #FCD34D',
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: '10px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em'
                                }}>
                                  Demo
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{u.phone || '—'}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text3)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address || '—'}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--info)', fontSize: '0.95rem' }}>{stats.orderCount}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>₹{stats.totalSpent.toLocaleString()}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}
                        >
                          {selectedUser?.id === u.id ? 'Close' : '👁️ View'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state"><div className="empty-state-icon">👥</div><h3 className="empty-state-title">No customers found</h3></div>
            )}
          </div>

          {/* Customer Detail Panel */}
          {selectedUser && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="admin-table-card">
                <div className="admin-table-header" style={{ justifyContent: 'space-between' }}>
                  <p className="admin-table-title">Customer Details</p>
                  <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.5rem', margin: '0 auto 10px' }}>
                      {selectedUser.avatar || selectedUser.name?.charAt(0)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '0 auto 4px' }}>
                      <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>{selectedUser.name}</h3>
                      {(selectedUser.isDemo || selectedUser.name?.includes('Demo') || selectedUser.id === 'u1' || selectedUser.id === 'u2' || selectedUser.id === 'u3' || selectedUser.id === 'u1-alt') && (
                        <span style={{
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FCD34D',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          Demo User
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{selectedUser.email}</p>
                  </div>
                  {[['📞 Phone', selectedUser.phone || '—'], ['📍 Address', selectedUser.address || '—'], ['🆔 User ID', selectedUser.id]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text3)', minWidth: 90, fontWeight: 600 }}>{k}</span>
                      <span style={{ color: 'var(--text)', wordBreak: 'break-all' }}>{v}</span>
                    </div>
                  ))}

                  {(() => {
                    const stats = getCustomerStats(selectedUser.id);
                    return (
                      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[['Orders', stats.orderCount, 'var(--info)'], ['Spent', `₹${stats.totalSpent}`, 'var(--primary)']].map(([l, v, c]) => (
                          <div key={l} style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '12px', textAlign: 'center' }}>
                            <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', color: c }}>{v}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{l}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Customer Orders */}
              <div className="admin-table-card">
                <div className="admin-table-header"><p className="admin-table-title">Order History</p></div>
                <div>
                  {orders.filter(o => o.userId === selectedUser.id).map(o => (
                    <div key={o.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>#{o.id}</p>
                          {(o.isDemo || o.id?.startsWith('ORD00')) && (
                            <span style={{
                              background: '#FEF3C7',
                              color: '#92400E',
                              border: '1px solid #FCD34D',
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '8px'
                            }}>
                              Demo
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{o.total}</p>
                        <span className={`status-badge ${o.status}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.userId === selectedUser.id).length === 0 && (
                    <p style={{ padding: 20, color: 'var(--text3)', textAlign: 'center', fontSize: '0.88rem' }}>No orders yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

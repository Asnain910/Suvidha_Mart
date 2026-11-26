'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const { count } = useCart();
  const { items: wishItems } = useWishlist();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [saved, setSaved] = useState(false);

  if (!user) return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content flex-center" style={{ minHeight: '60vh' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <h3 className="empty-state-title">Please Login First</h3>
          <Link href="/auth/login" className="btn btn-primary mt-20">Login</Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  const orders = getUserOrders(user.id);

  const handleSave = () => {
    updateUser(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div className="container"><h1>👤 My Profile</h1><p>Manage your account details</p></div>
        </div>

        <div className="container" style={{ padding: '40px 24px', maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

            {/* Sidebar */}
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80, height: 80,
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: '2rem',
                  margin: '0 auto 16px'
                }}>
                  {user.avatar || user.name?.charAt(0)}
                </div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{user.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: 4 }}>{user.email}</p>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
                  <span className="pill">{user.role === 'admin' ? '🔧 Admin' : '👤 Customer'}</span>
                  {(user.isDemo || user.name?.includes('Demo') || user.email === 'customer@suvidhamart.com' || user.id === 'u1') && (
                    <span style={{
                      background: '#FEF3C7',
                      color: '#92400E',
                      border: '1px solid #FCD34D',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      Demo Account
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['📦 Orders', orders.length], ['❤️ Wishlist', wishItems.length], ['🛒 Cart Items', count]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text2)' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{val}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="btn btn-danger btn-sm w-full"
                  style={{ marginTop: 20 }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>

            {/* Main */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Personal Info */}
              <div className="card">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700 }}>Personal Information</h3>
                  {!editing ? (
                    <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={handleSave}>💾 Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                  )}
                </div>
                <div className="card-body">
                  {saved && (
                    <div style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary-lighter)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                      ✅ Profile updated successfully!
                    </div>
                  )}
                  {editing ? (
                    <>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} maxLength={10} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Delivery Address</label>
                        <textarea className="form-input" rows={3} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                      </div>
                    </>
                  ) : (
                    <div>
                      {[['👤 Name', user.name], ['📧 Email', user.email], ['📞 Phone', user.phone || 'Not set'], ['📍 Address', user.address || 'Not set']].map(([label, val]) => (
                        <div key={label} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ color: 'var(--text3)', fontSize: '0.85rem', minWidth: 120, fontWeight: 600 }}>{label}</span>
                          <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="card">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700 }}>Recent Orders</h3>
                  <Link href="/orders" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>View All →</Link>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  {orders.length === 0 ? (
                    <p style={{ padding: 20, color: 'var(--text3)', textAlign: 'center', fontSize: '0.9rem' }}>No orders yet</p>
                  ) : orders.slice(0, 3).map(o => (
                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>#{o.id}</p>
                          {(o.isDemo || o.id?.startsWith('ORD00')) && (
                            <span style={{
                              background: '#FEF3C7',
                              color: '#92400E',
                              border: '1px solid #FCD34D',
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              padding: '1px 5px',
                              borderRadius: '6px'
                            }}>
                              DEMO
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{o.items.length} items · {new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.total}</p>
                        <span className={`status-badge ${o.status}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

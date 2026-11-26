'use client';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

function MiniChart({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 48 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: color,
            borderRadius: 3,
            opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { products, categories } = useProducts();
  const { orders } = useOrders();
  const { getAllUsers } = useAuth();

  const customers = getAllUsers().filter(u => u.role === 'customer');
  const totalRevenue = orders.reduce((s, o) => o.status !== 'cancelled' ? s + o.total : s, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  // Category breakdown
  const catBreakdown = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.id).length,
  })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  const chartData = [18, 25, 22, 30, 28, 35, 40, 32, 45, 50, 42, totalRevenue > 0 ? Math.min(60, Math.round(totalRevenue / 100)) : 55];

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">📊 Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <Link href="/admin/products/add" className="btn btn-primary btn-sm">+ Add Product</Link>
        </div>
      </div>

      <div className="admin-content">
        {/* Stat Cards */}
        <div className="stat-cards">
          {[
            { icon: '💰', label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+12.5%', up: true, color: '#E8F5E9', iconColor: 'var(--primary)' },
            { icon: '📦', label: 'Total Orders', value: orders.length, change: '+8.2%', up: true, color: '#E1F5FE', iconColor: 'var(--info)' },
            { icon: '🛍️', label: 'Products', value: products.length, change: '+3 this week', up: true, color: '#F3E5F5', iconColor: 'var(--purple)' },
            { icon: '👥', label: 'Customers', value: customers.length, change: '+2 today', up: true, color: '#FFF3E0', iconColor: 'var(--accent2)' },
            { icon: '⏳', label: 'Pending Orders', value: pendingOrders, change: 'Needs attention', up: false, color: '#FFEBEE', iconColor: 'var(--danger)' },
            { icon: '✅', label: 'Delivered', value: deliveredOrders, change: 'This month', up: true, color: '#E8F5E9', iconColor: 'var(--primary)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-icon" style={{ background: s.color, color: s.iconColor }}>{s.icon}</div>
              <div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
              <div className={`stat-card-change ${s.up ? 'up' : 'down'}`}>
                {s.up ? '▲' : '▼'} {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts + Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
          {/* Revenue Chart */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <p className="admin-table-title">📈 Revenue Overview</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Last 12 months</span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.8rem', color: 'var(--primary)' }}>₹{totalRevenue.toLocaleString()}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', marginLeft: 8, fontWeight: 600 }}>▲ Total Revenue</span>
              </div>
              {/* Bar chart simulation */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 }}>
                {chartData.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{
                      width: '100%',
                      height: `${(v / Math.max(...chartData)) * 100}%`,
                      background: i === chartData.length - 1
                        ? 'linear-gradient(180deg, var(--primary), var(--accent))'
                        : 'linear-gradient(180deg, var(--primary-lighter), var(--primary-bg))',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text4)' }}>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <p className="admin-table-title">🏷️ Product Categories</p>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              {catBreakdown.slice(0, 6).map(cat => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                      <span>{cat.name}</span>
                      <span>{cat.count} products</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(cat.count / products.length) * 100}%`, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)`, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <p className="admin-table-title">🚚 Recent Orders</p>
            <Link href="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ color: 'var(--text)' }}>#{order.id}</strong>
                      {(order.isDemo || order.id?.startsWith('ORD00')) && (
                        <span style={{
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FCD34D',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '8px'
                        }}>
                          DEMO
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p style={{ fontWeight: 600, color: 'var(--text)' }}>{order.customerName}</p>
                        {(order.isDemo || order.customerName?.includes('Demo') || order.userId === 'u1' || order.userId === 'u2' || order.userId === 'u3') && (
                          <span style={{
                            background: '#F1F5F9',
                            color: '#475569',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            padding: '1px 5px',
                            borderRadius: '6px'
                          }}>
                            Demo User
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{order.phone}</p>
                    </div>
                  </td>
                  <td>{order.items.length} items</td>
                  <td><strong style={{ color: 'var(--primary)' }}>₹{order.total}</strong></td>
                  <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                  <td style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                  </td>
                  <td>
                    <Link href="/admin/orders" className="btn btn-secondary btn-sm">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

const NAV = [
  { group: 'Overview', links: [{ href: '/admin', icon: '📊', label: 'Dashboard' }] },
  { group: 'Catalog', links: [
    { href: '/admin/products', icon: '📦', label: 'Products' },
    { href: '/admin/categories', icon: '🏷️', label: 'Categories' },
  ]},
  { group: 'Operations', links: [
    { href: '/admin/orders', icon: '🚚', label: 'Orders' },
    { href: '/admin/customers', icon: '👥', label: 'Customers' },
  ]},
  { group: 'Store', links: [
    { href: '/', icon: '🏪', label: 'Visit Store' },
  ]},
];

export default function AdminLayout({ children }) {
  const { adminUser, user, adminLogout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const currentAdmin = adminUser || (user?.role === 'admin' ? user : null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoginPage && currentAdmin && currentAdmin.role !== 'admin') {
      router.push('/');
    }
  }, [currentAdmin, router, isLoginPage]);

  // Allow rendering the confidential admin login page directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!currentAdmin || currentAdmin.role !== 'admin') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">Admin Access Only</h3>
        <p className="empty-state-desc">You need admin privileges to access this panel.</p>
        <Link href="/admin/login" className="btn btn-primary mt-20">Admin Login Portal</Link>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Mobile Admin Header */}
      <div className="admin-mobile-header">
        <button
          className="admin-hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <span style={{ fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text)' }}>
          🛒 Admin Panel
        </span>
        <button
          onClick={() => {
            adminLogout();
            router.push('/admin/login');
          }}
          style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer' }}
          title="Logout"
        >
          🚪
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <span>🛒</span>
          <div>
            Suvidha Mart
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map(group => (
            <div key={group.group} className="admin-nav-group">
              <p className="admin-nav-group-label">{group.group}</p>
              {group.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-nav-link ${pathname === link.href ? 'active' : ''}`}
                >
                  <span className="admin-nav-link-icon">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                {currentAdmin.avatar || currentAdmin.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{currentAdmin.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Administrator</p>
              </div>
            </div>
            <button
              onClick={() => {
                adminLogout();
                router.push('/admin/login');
              }}
              title="Logout from Admin"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                borderRadius: '6px',
                padding: '6px 8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar({ onSearch, searchValue }) {
  const { user, logout } = useAuth();
  const { count, total } = useCart();
  const { items: wishItems } = useWishlist();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">🛒</div>
          Suvidha Mart
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <span className="navbar-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for groceries, vegetables, fruits..."
            value={searchValue || ''}
            onChange={e => onSearch && onSearch(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <Link href="/products" className="nav-btn">
            🏪 Shop
          </Link>

          <Link href="/wishlist" className="nav-btn">
            <span className="nav-btn-icon">
              ❤️
              {wishItems.length > 0 && <span className="nav-badge">{wishItems.length}</span>}
            </span>
          </Link>

          <Link href="/cart" className="nav-btn">
            <span className="nav-btn-icon">
              🛒
              {count > 0 && <span className="nav-badge">{count}</span>}
            </span>
            {count > 0 && <span style={{fontSize:'0.82rem', fontWeight:700, color:'var(--primary)'}}>₹{total}</span>}
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <div className="nav-user-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer' }}>
                <div className="nav-avatar">{user.avatar || user.name?.charAt(0)}</div>
                <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>▼</span>
              </div>
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0,
                  background: '#fff', borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
                  minWidth: 180, zIndex: 200, overflow: 'hidden'
                }} onClick={() => setMenuOpen(false)}>
                  {user.role === 'admin' && (
                    <Link href="/admin" style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', fontSize:'0.88rem', color:'var(--text2)', transition:'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      🛠️ Admin Panel
                    </Link>
                  )}
                  <Link href="/profile" style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', fontSize:'0.88rem', color:'var(--text2)', transition:'var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    👤 My Profile
                  </Link>
                  <Link href="/orders" style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', fontSize:'0.88rem', color:'var(--text2)', transition:'var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    📦 My Orders
                  </Link>
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', fontSize:'0.88rem', color:'var(--danger)', width:'100%', background:'none', textAlign:'left' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--danger-light)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="nav-btn">Login</Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// tiny hook inline
function useCartTotal() {
  const { total } = useCart();
  return total;
}

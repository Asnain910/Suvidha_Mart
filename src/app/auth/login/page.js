'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      if (result.user.role === 'admin') router.push('/admin');
      else router.push(redirect);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ fontSize: '4rem', marginBottom: 24 }}>🛒</div>
        <div className="auth-left-title">Suvidha Mart</div>
        <p className="auth-left-desc">
          Fresh groceries, dairy, snacks and more — delivered to your door in just 60 minutes!
        </p>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[['🚚', 'Express Delivery', 'Get items in 60 min'], ['🌿', 'Fresh Guarantee', '100% fresh or full refund'], ['💰', 'Best Prices', 'Daily deals & discounts']].map(([icon, title, sub]) => (
            <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div style={{ marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            ← Back to Home
          </Link>
        </div>

        <h1 className="auth-title">Welcome Back! 👋</h1>
        <p className="auth-subtitle">Sign in to continue shopping</p>

        {/* Demo Customer Quick Fill */}
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 'var(--radius)',
          padding: '10px 14px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              👤 Demo Customer
            </div>
            <div style={{ fontSize: '0.8rem', color: '#15803D', marginTop: 2, fontWeight: 500 }}>
              customer@suvidhamart.com / customer123
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm({ email: 'customer@suvidhamart.com', password: 'customer123' });
              setError('');
            }}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#166534',
              background: '#DCFCE7',
              border: '1px solid #86EFAC',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Quick Fill
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid #FFCDD2', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem', color: 'var(--danger)' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? '🔄 Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--text3)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one free →</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}


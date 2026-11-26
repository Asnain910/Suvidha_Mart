'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminUser, user, adminLogin } = useAuth();
  const router = useRouter();

  const activeAdmin = adminUser || (user?.role === 'admin' ? user : null);

  // If already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    if (activeAdmin && activeAdmin.role === 'admin') {
      router.push('/admin');
    }
  }, [activeAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = await adminLogin(form.email, form.password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin');
      } else {
        setError('Access Denied: This portal is strictly for authorized administrators.');
      }
    } else {
      setError(result.error || 'Invalid admin credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg, 16px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        padding: '36px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 16px auto',
            border: '2px solid #e2e8f0'
          }}>
            🛡️
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            Confidential management access only
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-light, #fee2e2)',
            border: '1px solid #fca5a5',
            color: 'var(--danger, #dc2626)',
            borderRadius: 'var(--radius, 8px)',
            padding: '10px 14px',
            fontSize: '0.84rem',
            marginBottom: 20
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Quick Fill Box */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius, 8px)',
          padding: '10px 14px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🛡️ Demo Credentials
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0f172a', marginTop: 2, fontWeight: 500 }}>
              admin@suvidhamart.com / admin123
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm({ email: 'admin@suvidhamart.com', password: 'admin123' });
              setError('');
            }}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#0f172a',
              background: '#e2e8f0',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Quick Fill
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem' }}>
              Admin Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@suvidhamart.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={{ borderColor: '#cbd5e1' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label" style={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem' }}>
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{ borderColor: '#cbd5e1' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ fontWeight: 700 }}
          >
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 18 }}>
          <Link
            href="/"
            style={{
              fontSize: '0.82rem',
              color: '#64748b',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            ← Back to Customer Store
          </Link>
        </div>
      </div>
    </div>
  );
}


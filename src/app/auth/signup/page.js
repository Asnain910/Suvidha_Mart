'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = await signup(form.name, form.email, form.password, form.phone);
    setLoading(false);
    if (result.success) router.push('/');
    else setErrors({ email: result.error });
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ fontSize: '4rem', marginBottom: 24 }}>🌿</div>
        <div className="auth-left-title">Join Suvidha Mart</div>
        <p className="auth-left-desc">
          Sign up for free and enjoy exclusive member offers, faster checkout, and order tracking.
        </p>
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['🎁 20% off on first order', '🚀 Priority delivery', '💎 Exclusive member deals', '📦 Easy order tracking'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                <span>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right" style={{ overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>← Back to Home</Link>
        </div>
        <h1 className="auth-title">Create Account 🎉</h1>
        <p className="auth-subtitle">Start shopping fresh groceries today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" placeholder="10-digit mobile number" maxLength={10} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Re-enter your password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} />
            {errors.confirm && <p className="form-error">{errors.confirm}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? '🔄 Creating Account...' : '✨ Create Free Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.88rem', color: 'var(--text3)' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in →</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.75rem', color: 'var(--text4)' }}>
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

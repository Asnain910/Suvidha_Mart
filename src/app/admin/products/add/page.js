'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';

const EMPTY = { name: '', category: '', price: '', originalPrice: '', description: '', image: '', stock: '', unit: '', badge: '', featured: false };

export default function AddProductPage() {
  const { addProduct, categories } = useProducts();
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Valid stock required';
    if (!form.unit.trim()) e.unit = 'Unit is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    await addProduct({
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || Number(form.price),
      stock: Number(form.stock),
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => router.push('/admin/products'), 1500);
  };

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/products" style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>← Products</Link>
          <span style={{ color: 'var(--border)' }}>|</span>
          <h1 className="admin-topbar-title">➕ Add New Product</h1>
        </div>
      </div>

      <div className="admin-content">
        {success && (
          <div style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary-lighter)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 20, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            ✅ Product added successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

            {/* Main Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="admin-table-card">
                <div className="admin-table-header"><p className="admin-table-title">Product Information</p></div>
                <div style={{ padding: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input className="form-input" placeholder="e.g. Fresh Tomatoes" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} placeholder="Product description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input className="form-input" placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                    {form.image && <img src={form.image} alt="Preview" style={{ marginTop: 10, width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display='none'} />}
                  </div>
                </div>
              </div>

              <div className="admin-table-card">
                <div className="admin-table-header"><p className="admin-table-title">Pricing & Stock</p></div>
                <div style={{ padding: 20 }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Selling Price (₹) *</label>
                      <input className="form-input" type="number" placeholder="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} min="0" />
                      {errors.price && <p className="form-error">{errors.price}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Original Price (₹)</label>
                      <input className="form-input" type="number" placeholder="0 (for discount)" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} min="0" />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Stock Quantity *</label>
                      <input className="form-input" type="number" placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} min="0" />
                      {errors.stock && <p className="form-error">{errors.stock}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit *</label>
                      <input className="form-input" placeholder="e.g. 1 kg, 500 g, 1 pc" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
                      {errors.unit && <p className="form-error">{errors.unit}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="admin-table-card">
                <div className="admin-table-header"><p className="admin-table-title">Category & Status</p></div>
                <div style={{ padding: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                    {errors.category && <p className="form-error">{errors.category}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badge Label</label>
                    <input className="form-input" placeholder="e.g. New, Sale, Fresh, Hot" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 0' }}>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm({...form, featured: e.target.checked})}
                      style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>⭐ Featured Product</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Show on home page</p>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={saving}>
                {saving ? '💾 Saving...' : '✅ Add Product'}
              </button>
              <Link href="/admin/products" className="btn btn-secondary w-full" style={{ textAlign: 'center' }}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';

function EditProductForm() {
  const { id } = useParams();
  const { products, updateProduct, categories } = useProducts();
  const router = useRouter();
  const product = products.find(p => p.id === id);

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (product) setForm({ ...product, price: String(product.price), originalPrice: String(product.originalPrice || ''), stock: String(product.stock) });
  }, [product]);

  if (!product || !form) return (
    <div className="admin-content">
      <div className="empty-state"><div className="empty-state-icon">😕</div><h3 className="empty-state-title">Product Not Found</h3><Link href="/admin/products" className="btn btn-primary mt-20">Back to Products</Link></div>
    </div>
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.price || isNaN(form.price)) e.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock)) e.stock = 'Valid stock required';
    if (!form.unit.trim()) e.unit = 'Unit required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    await updateProduct(id, { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) || Number(form.price), stock: Number(form.stock) });
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
          <h1 className="admin-topbar-title">✏️ Edit Product</h1>
        </div>
      </div>
      <div className="admin-content">
        {success && (
          <div style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary-lighter)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 20, color: 'var(--primary)', fontWeight: 600 }}>
            ✅ Product updated! Redirecting...
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="admin-table-card">
                <div className="admin-table-header"><p className="admin-table-title">Product Information</p></div>
                <div style={{ padding: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input className="form-input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                    {form.image && <img src={form.image} alt="Preview" style={{ marginTop: 10, width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display='none'} />}
                  </div>
                </div>
              </div>
              <div className="admin-table-card">
                <div className="admin-table-header"><p className="admin-table-title">Pricing & Stock</p></div>
                <div style={{ padding: 20 }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Selling Price (₹) *</label>
                      <input className="form-input" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} min="0" />
                      {errors.price && <p className="form-error">{errors.price}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Original Price (₹)</label>
                      <input className="form-input" type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} min="0" />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Stock *</label>
                      <input className="form-input" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} min="0" />
                      {errors.stock && <p className="form-error">{errors.stock}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit *</label>
                      <input className="form-input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
                      {errors.unit && <p className="form-error">{errors.unit}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="admin-table-card">
                <div className="admin-table-header"><p className="admin-table-title">Category & Status</p></div>
                <div style={{ padding: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badge Label</label>
                    <input className="form-input" value={form.badge || ''} onChange={e => setForm({...form, badge: e.target.value})} placeholder="New, Sale, Fresh..." />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 0' }}>
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>⭐ Featured Product</span>
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={saving}>
                {saving ? '💾 Saving...' : '✅ Update Product'}
              </button>
              <Link href="/admin/products" className="btn btn-secondary w-full" style={{ textAlign: 'center' }}>Cancel</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      }
    >
      <EditProductForm />
    </Suspense>
  );
}

'use client';
import { useState } from 'react';
import { useProducts } from '@/context/ProductContext';

export default function AdminCategoriesPage() {
  const { categories, addCategory, deleteCategory, products } = useProducts();
  const [form, setForm] = useState({ name: '', icon: '🏪', color: '#4CAF50' });
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setAdding(true);
    await new Promise(r => setTimeout(r, 400));
    await addCategory(form);
    setForm({ name: '', icon: '🏪', color: '#4CAF50' });
    setAdding(false);
  };

  const EMOJI_OPTIONS = ['🥦','🥛','🍞','🍖','🥤','🌾','🌶️','🧊','🧴','🧹','🍎','🥕','🧅','🍋','🥥','🫐','🥑','🫚','🍯','🧂'];

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">🏷️ Categories</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{categories.length} categories</span>
      </div>

      <div className="admin-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

          {/* Categories List */}
          <div className="admin-table-card">
            <div className="admin-table-header"><p className="admin-table-title">All Categories</p></div>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Color</th>
                  <th>Products</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => {
                  const count = products.filter(p => p.category === cat.id).length;
                  return (
                    <tr key={cat.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, background: `${cat.color}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                            {cat.icon}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{cat.name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 20, height: 20, background: cat.color, borderRadius: 4 }} />
                          <span style={{ fontSize: '0.82rem', color: 'var(--text3)', fontFamily: 'monospace' }}>{cat.color}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: count > 0 ? 'var(--primary)' : 'var(--text4)' }}>{count} products</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}
                          onClick={() => setConfirmDelete(cat)}
                          disabled={count > 0}
                          title={count > 0 ? 'Remove all products first' : 'Delete category'}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Category */}
          <div>
            <div className="admin-table-card">
              <div className="admin-table-header"><p className="admin-table-title">➕ Add Category</p></div>
              <form onSubmit={handleAdd} style={{ padding: 20 }}>
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input className="form-input" placeholder="e.g. Baby Products" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon (Emoji)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {EMOJI_OPTIONS.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setForm(f => ({...f, icon: e}))}
                        style={{
                          width: 36, height: 36,
                          background: form.icon === e ? 'var(--primary-bg)' : 'var(--surface2)',
                          border: `2px solid ${form.icon === e ? 'var(--primary)' : 'transparent'}`,
                          borderRadius: 8, fontSize: '1.2rem', cursor: 'pointer', transition: 'var(--transition)'
                        }}
                      >{e}</button>
                    ))}
                  </div>
                  <input className="form-input" placeholder="Or type emoji" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} style={{ fontSize: '1.2rem' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} style={{ width: 44, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
                    <input className="form-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} style={{ flex: 1, fontFamily: 'monospace' }} />
                  </div>
                </div>

                {/* Preview */}
                <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 16, textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview</p>
                  <div className="cat-card" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 24px' }}>
                    <div className="cat-icon" style={{ background: `${form.color}18`, color: form.color, fontSize: '1.8rem' }}>{form.icon}</div>
                    <span className="cat-name">{form.name || 'Category Name'}</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={adding}>
                  {adding ? '⟳ Adding...' : '✅ Add Category'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Delete Confirm */}
        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">🗑️ Delete Category</h3>
                <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--text2)', lineHeight: 1.6 }}>
                  Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={async () => { await deleteCategory(confirmDelete.id); setConfirmDelete(null); }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

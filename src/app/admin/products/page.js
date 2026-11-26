'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';

export default function AdminProductsPage() {
  const { products, deleteProduct, categories } = useProducts();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setConfirmDelete(null);
  };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">📦 Products</h1>
        <Link href="/admin/products/add" className="btn btn-primary btn-sm">+ Add Product</Link>
      </div>

      <div className="admin-content">
        {/* Filter Bar */}
        <div className="filter-bar" style={{ marginBottom: 20 }}>
          <div className="filter-input-wrap">
            <span className="filter-input-icon">🔍</span>
            <input
              className="filter-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <span style={{ fontSize: '0.85rem', color: 'var(--text3)', marginLeft: 'auto' }}>
            {filtered.length} products
          </span>
        </div>

        <div className="admin-table-card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'; }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{p.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="pill" style={{ fontSize: '0.75rem' }}>
                      {categories.find(c => c.id === p.category)?.icon} {p.category}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{p.price}</p>
                      {p.originalPrice > p.price && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text4)', textDecoration: 'line-through' }}>₹{p.originalPrice}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      color: p.stock > 20 ? 'var(--primary)' : p.stock > 0 ? 'var(--accent2)' : 'var(--danger)',
                      fontWeight: 600, fontSize: '0.88rem'
                    }}>
                      {p.stock > 0 ? p.stock : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#FFB300' }}>★</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.rating}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>({p.reviews})</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
                      background: p.featured ? 'var(--primary-bg)' : 'var(--surface2)',
                      color: p.featured ? 'var(--primary)' : 'var(--text4)',
                    }}>
                      {p.featured ? '⭐ Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/admin/products/${p.id}/edit`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}
                        onClick={() => setConfirmDelete(p.id)}
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No products found</h3>
              <Link href="/admin/products/add" className="btn btn-primary mt-20">+ Add First Product</Link>
            </div>
          )}
        </div>

        {/* Delete Confirm Modal */}
        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">🗑️ Confirm Delete</h3>
                <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--text2)', lineHeight: 1.6 }}>
                  Are you sure you want to delete <strong>{products.find(p => p.id === confirmDelete)?.name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>🗑️ Delete Product</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

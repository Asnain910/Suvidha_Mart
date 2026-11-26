'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/context/ProductContext';

function ProductsContent() {
  const { products, categories } = useProducts();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    if (s) setSearch(s);
    if (c) setSelectedCat(c);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedCat && selectedCat !== 'all') {
      list = list.filter(p => p.category === selectedCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      list = list.filter(p => p.price >= min && (max ? p.price <= max : true));
    }
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, search, selectedCat, sortBy, priceRange]);

  return (
    <div className="page-wrapper">
      <Navbar onSearch={setSearch} searchValue={search} />
      <main className="main-content">

        {/* Page Header */}
        <div className="page-header">
          <div className="container">
            <h1>🛒 All Products</h1>
            <p>{filtered.length} products available{search ? ` for "${search}"` : ''}</p>
          </div>
        </div>

        <div className="container" style={{ padding: '32px 24px' }}>
          <div className="products-page-layout">

            {/* SIDEBAR */}
            <aside>
              <div className="card" style={{ position: 'sticky', top: 88 }}>
                <div className="card-body">
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>🔍 Filters</h3>

                  {/* Categories */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Category</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <button
                        onClick={() => setSelectedCat('all')}
                        style={{
                          padding: '8px 12px', borderRadius: 'var(--radius)', textAlign: 'left',
                          background: selectedCat === 'all' ? 'var(--primary-bg)' : 'transparent',
                          color: selectedCat === 'all' ? 'var(--primary)' : 'var(--text2)',
                          fontWeight: selectedCat === 'all' ? 700 : 400,
                          fontSize: '0.88rem', border: 'none', cursor: 'pointer',
                          transition: 'var(--transition)',
                        }}
                      >
                        🏪 All Categories
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCat(cat.id)}
                          style={{
                            padding: '8px 12px', borderRadius: 'var(--radius)', textAlign: 'left',
                            background: selectedCat === cat.id ? 'var(--primary-bg)' : 'transparent',
                            color: selectedCat === cat.id ? 'var(--primary)' : 'var(--text2)',
                            fontWeight: selectedCat === cat.id ? 700 : 400,
                            fontSize: '0.88rem', border: 'none', cursor: 'pointer',
                            transition: 'var(--transition)',
                          }}
                        >
                          {cat.icon} {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Price Range</p>
                    {[['all', 'All Prices'], ['0-50', 'Under ₹50'], ['50-100', '₹50 – ₹100'], ['100-200', '₹100 – ₹200'], ['200-', '₹200+']].map(([v, l]) => (
                      <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text2)' }}>
                        <input type="radio" name="price" checked={priceRange === v} onChange={() => setPriceRange(v)} style={{ accentColor: 'var(--primary)' }} />
                        {l}
                      </label>
                    ))}
                  </div>

                  {/* Reset */}
                  <button className="btn btn-secondary btn-sm w-full" onClick={() => { setSelectedCat('all'); setSortBy('default'); setPriceRange('all'); setSearch(''); }}>
                    Reset Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* PRODUCTS */}
            <div>
              {/* Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>
                  Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> results
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text3)', fontWeight: 600 }}>Sort:</label>
                  <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="default">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h3 className="empty-state-title">No products found</h3>
                  <p className="empty-state-desc">Try adjusting your search or filter to find what you&apos;re looking for.</p>
                  <button className="btn btn-primary mt-20" onClick={() => { setSelectedCat('all'); setSearch(''); }}>Clear Filters</button>
                </div>
              ) : (
                <div className="products-grid">
                  {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

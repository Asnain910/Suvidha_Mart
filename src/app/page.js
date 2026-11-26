'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/context/ProductContext';

export default function HomePage() {
  const { products, categories } = useProducts();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  const handleSearch = useCallback((val) => {
    setSearch(val);
    if (val.trim()) router.push(`/products?search=${encodeURIComponent(val)}`);
  }, [router]);

  return (
    <div className="page-wrapper">
      <Navbar onSearch={handleSearch} searchValue={search} />
      <main className="main-content">

        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-tag">
                🌿 100% Fresh & Organic
              </div>
              <h1>
                Fresh Groceries<br />
                <span>Delivered to</span><br />
                Your Doorstep
              </h1>
              <p className="hero-desc">
                Shop from over 500+ fresh products — vegetables, fruits, dairy, snacks and more.
                Fast delivery within 60 minutes!
              </p>
              <div className="hero-actions">
                <Link href="/products" className="btn-hero">
                  🛒 Shop Now
                </Link>
                <Link href="/auth/signup" className="btn-hero-ghost">
                  Join Free →
                </Link>
              </div>
              <div className="hero-stats">
                {[['500+', 'Products'], ['60min', 'Delivery'], ['10K+', 'Customers'], ['4.9★', 'Rating']].map(([num, label]) => (
                  <div key={label} className="hero-stat">
                    <div className="hero-stat-num">{num}</div>
                    <div className="hero-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual">
              {[
                { icon: '🥦', title: 'Fresh Vegetables', sub: 'Sourced daily from farms' },
                { icon: '🚚', title: 'Fast Delivery', sub: 'Arrives in 60 minutes' },
                { icon: '💚', title: 'Quality Guarantee', sub: 'Or we refund 100%' },
              ].map((card) => (
                <div key={card.title} className="hero-card">
                  <div className="hero-card-icon">{card.icon}</div>
                  <div className="hero-card-info">
                    <div className="hero-card-title">{card.title}</div>
                    <div className="hero-card-sub">{card.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES STRIP */}
        <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ padding: '0 24px' }}>
            <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
              {[
                { icon: '🚚', title: 'Free Delivery', sub: 'On orders over ₹299' },
                { icon: '↩️', title: 'Easy Returns', sub: '7-day return policy' },
                { icon: '🔒', title: 'Secure Payment', sub: 'UPI, Cards, Wallets' },
                { icon: '🌿', title: 'Fresh Guarantee', sub: '100% fresh or refund' },
                { icon: '🕐', title: '60 Min Delivery', sub: 'Express delivery available' },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: '1 0 180px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '16px 20px',
                  borderRight: i < 4 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Shop by Category</h2>
                <p className="section-subtitle">Find exactly what you need</p>
              </div>
              <Link href="/products" className="section-link">View All →</Link>
            </div>
            <div className="categories-grid">
              {categories.map(cat => (
                <Link key={cat.id} href={`/products?category=${cat.id}`}>
                  <div className="cat-card">
                    <div className="cat-icon" style={{ background: `${cat.color}18`, color: cat.color }}>
                      {cat.icon}
                    </div>
                    <span className="cat-name">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED BANNER */}
        <section style={{ padding: '0 0 48px' }}>
          <div className="container">
            <div className="promo-banners-grid">
              <div style={{
                background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 32px',
                color: '#fff',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: '5rem', opacity: 0.2 }}>🥦</div>
                <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: 12, display: 'inline-flex' }}>🌿 Fresh Today</span>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Organic Vegetables</h3>
                <p style={{ opacity: 0.85, fontSize: '0.9rem', marginBottom: 20 }}>Farm-to-table freshness every day</p>
                <Link href="/products?category=fruits" className="btn-hero" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>Shop Now →</Link>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #E65100, #FF8F00)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 32px',
                color: '#fff',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: '5rem', opacity: 0.2 }}>🥛</div>
                <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: 12, display: 'inline-flex' }}>⭐ Best Sellers</span>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Dairy & Eggs</h3>
                <p style={{ opacity: 0.85, fontSize: '0.9rem', marginBottom: 20 }}>Fresh dairy delivered daily</p>
                <Link href="/products?category=dairy" className="btn-hero" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>Shop Now →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Featured Products</h2>
                <p className="section-subtitle">Our most popular picks this week</p>
              </div>
              <Link href="/products" className="section-link">View All →</Link>
            </div>
            <div className="products-grid">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* OFFER BANNER */}
        <section style={{ padding: '0 0 56px' }}>
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, #388E3C 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 48px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 24, flexWrap: 'wrap',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', right: -40, top: -40, width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', right: 80, bottom: -60, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
              <div style={{ color: '#fff', position: 'relative' }}>
                <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
                  🎉 Get 20% OFF on First Order!
                </div>
                <p style={{ opacity: 0.85, fontSize: '1rem' }}>
                  Use code <strong>WELCOME20</strong> at checkout. Min order ₹499.
                </p>
              </div>
              <Link href="/auth/signup" style={{
                background: '#fff',
                color: 'var(--primary-dark)',
                padding: '14px 32px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700, fontSize: '1rem',
                whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'var(--transition)',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Claim Offer →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

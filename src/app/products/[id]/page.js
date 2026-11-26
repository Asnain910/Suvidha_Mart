'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: '#FFB300', fontSize: '1.1rem' }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, categories } = useProducts();
  const { addToCart, items, updateQty, removeFromCart } = useCart();
  const { toggle, isWished } = useWishlist();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === id);
  if (!product) return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content flex-center" style={{ padding: '80px 20px' }}>
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h2 className="empty-state-title">Product Not Found</h2>
          <Link href="/products" className="btn btn-primary mt-20">Back to Products</Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  const cartItem = items.find(i => i.id === product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">

        {/* Breadcrumb */}
        <div style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
          <div className="container" style={{ display: 'flex', gap: 8, fontSize: '0.85rem', color: 'var(--text3)', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--primary)' }}>Home</Link>
            <span>›</span>
            <Link href="/products" style={{ color: 'var(--primary)' }}>Products</Link>
            <span>›</span>
            <span>{product.name}</span>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 24px' }}>
          <div className="product-detail-layout">

            {/* Image */}
            <div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: 400, objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'; }}
                />
                {product.badge && (
                  <span className="product-card-badge" style={{ top: 16, left: 16, fontSize: '0.85rem', padding: '6px 16px' }}>
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={() => toggle(product)}
                  style={{
                    position: 'absolute', top: 16, right: 16,
                    width: 44, height: 44,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', border: 'none', cursor: 'pointer',
                    boxShadow: 'var(--shadow)',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isWished(product.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>

            {/* Info */}
            <div>
              <span className="pill" style={{ marginBottom: 12 }}>
                {categories.find(c => c.id === product.category)?.icon} {product.category}
              </span>
              <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8, marginTop: 8 }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <StarRating rating={product.rating} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>{product.rating} ({product.reviews} reviews)</span>
              </div>

              <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 24, fontSize: '0.95rem' }}>
                {product.description}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <span style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span style={{ fontSize: '1.1rem', color: 'var(--text4)', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                )}
                {discount && (
                  <span className="price-discount" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>{discount}% off</span>
                )}
              </div>

              {/* Details */}
              <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 24 }}>
                {[['Unit', product.unit], ['Stock', product.stock > 0 ? `${product.stock} available` : 'Out of stock'], ['Category', product.category]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text3)', fontWeight: 600 }}>{k}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Qty + Add to Cart */}
              {!cartItem ? (
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                  <div className="qty-control" style={{ borderRadius: 'var(--radius-md)', border: '2px solid var(--border)' }}>
                    <button className="qty-btn" style={{ width: 44, height: 44, fontSize: '1.3rem' }} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                    <span className="qty-num" style={{ minWidth: 40, fontSize: '1.1rem' }}>{qty}</span>
                    <button className="qty-btn" style={{ width: 44, height: 44, fontSize: '1.3rem' }} onClick={() => setQty(qty + 1)}>+</button>
                  </div>
                  <button
                    className={`btn ${added ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                    style={{ flex: 1, fontSize: '1rem' }}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    {added ? '✅ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                  <div className="qty-control" style={{ borderRadius: 'var(--radius-md)', border: '2px solid var(--primary)' }}>
                    <button className="qty-btn" style={{ width: 44, height: 44, fontSize: '1.3rem' }} onClick={() => cartItem.qty === 1 ? removeFromCart(product.id) : updateQty(product.id, cartItem.qty - 1)}>−</button>
                    <span className="qty-num" style={{ minWidth: 40, fontSize: '1.1rem' }}>{cartItem.qty}</span>
                    <button className="qty-btn" style={{ width: 44, height: 44, fontSize: '1.3rem' }} onClick={() => updateQty(product.id, cartItem.qty + 1)}>+</button>
                  </div>
                  <Link href="/cart" className="btn btn-primary btn-lg" style={{ flex: 1, textAlign: 'center', fontSize: '1rem' }}>
                    View Cart →
                  </Link>
                </div>
              )}

              <button className="btn btn-outline w-full" onClick={() => toggle(product)}>
                {isWished(product.id) ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
              </button>

              {/* Delivery info */}
              <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
                {['🚚 Free Delivery above ₹299', '↩️ 7-day Returns', '🔒 Secure Checkout'].map(t => (
                  <span key={t} style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <div className="section-header">
                <div>
                  <h2 className="section-title">Related Products</h2>
                  <p className="section-subtitle">More from {product.category}</p>
                </div>
              </div>
              <div className="products-grid">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

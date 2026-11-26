'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const deliveryFee = total >= 299 ? 0 : 49;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + deliveryFee + tax;

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header"><div className="container"><h1>🛒 Your Cart</h1><p>Review your selected items</p></div></div>
        <div className="container" style={{ padding: '40px 24px' }}>
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-desc">Looks like you haven&apos;t added any products yet. Start shopping now!</p>
            <Link href="/products" className="btn btn-primary mt-20">🛒 Start Shopping</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div className="container">
            <h1>🛒 Your Cart</h1>
            <p>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>

        <div className="container cart-page">
          <div className="cart-layout">
            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>Cart Items ({items.length})</h2>
                <button
                  onClick={clearCart}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger)' }}
                >
                  🗑️ Clear All
                </button>
              </div>

              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80'; }}
                  />
                  <div className="cart-item-info">
                    <Link href={`/products/${item.id}`}>
                      <p className="cart-item-name">{item.name}</p>
                    </Link>
                    <p className="cart-item-unit">{item.unit}</p>
                    <p className="cart-item-price">₹{item.price} × {item.qty} = <strong>₹{item.price * item.qty}</strong></p>
                  </div>
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => item.qty === 1 ? removeFromCart(item.id) : updateQty(item.id, item.qty - 1)}
                    >−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} title="Remove">✕</button>
                </div>
              ))}

              {/* Free delivery notice */}
              {total < 299 && (
                <div style={{ background: 'var(--accent2-light)', border: '1px solid #FFE0B2', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>🚚</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--accent2)', fontWeight: 600 }}>
                    Add ₹{299 - total} more for FREE delivery!
                  </span>
                </div>
              )}
              {total >= 299 && (
                <div style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary-lighter)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>✅</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600 }}>
                    You&apos;ve qualified for FREE delivery!
                  </span>
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <div className="order-summary">
                <p className="order-summary-title">Order Summary</p>

                <div className="summary-row"><span>Subtotal ({items.length} items)</span><span>₹{total}</span></div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span style={{ color: deliveryFee === 0 ? 'var(--primary)' : 'inherit' }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="summary-row"><span>GST (5%)</span><span>₹{tax}</span></div>
                <div className="divider" />
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>

                <button
                  className="btn btn-primary btn-lg w-full mt-20"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout →
                </button>

                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Link href="/products" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    ← Continue Shopping
                  </Link>
                </div>

                <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['🔒 Secure', '📦 Tracked', '↩️ Easy Return'].map(t => (
                    <span key={t} style={{ fontSize: '0.72rem', color: 'var(--text3)', padding: '3px 10px', background: 'var(--surface2)', borderRadius: 'var(--radius-full)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

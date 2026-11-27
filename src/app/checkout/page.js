'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (!items.length && !success) {
      router.push('/cart');
    }
  }, [items.length, success, router]);

  const deliveryFee = total >= 299 ? 0 : 49;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + deliveryFee + tax;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setPlacing(true);

    try {
      const fullAddress = `${form.address}, ${form.city} - ${form.pincode}`;
      const order = await placeOrder(
        user?.id || 'guest',
        form.name,
        items.map(i => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty, unit: i.unit })),
        grandTotal,
        fullAddress,
        form.phone,
        form.paymentMethod === 'upi' ? 'UPI Payment' : form.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'
      );
      setOrderId(order.id);
      clearCart();
      setPlacing(false);
      setSuccess(true);
    } catch (err) {
      setPlacing(false);
      setSubmitError(err.message || 'Failed to place order. Please try again.');
    }
  };

  if (success) return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content flex-center" style={{ minHeight: '70vh' }}>
        <div style={{ textAlign: 'center', padding: '60px 24px', maxWidth: 500 }}>
          <div style={{ fontSize: '4rem', marginBottom: 20, animation: 'toastIn 0.5s ease' }}>🎉</div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 12 }}>
            Order Placed Successfully!
          </h2>
          <p style={{ color: 'var(--text2)', marginBottom: 8 }}>
            Your order <strong style={{ color: 'var(--primary)' }}>#{orderId}</strong> has been placed.
          </p>
          <p style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: 32 }}>
            You&apos;ll receive a confirmation soon. Estimated delivery in 60 minutes!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/orders')} className="btn btn-primary btn-lg">Track My Order</button>
            <button onClick={() => router.push('/products')} className="btn btn-outline btn-lg">Continue Shopping</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (!items.length && !success) {
    return null;
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div className="container"><h1>💳 Checkout</h1><p>Complete your order</p></div>
        </div>

        <div className="container" style={{ padding: '40px 24px' }}>
          <form onSubmit={handleSubmit}>
            <div className="checkout-layout">

              {/* Left: Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Delivery Details */}
                <div className="card">
                  <div className="card-body">
                    <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>
                      📍 Delivery Details
                    </h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                        {errors.name && <p className="form-error">{errors.name}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" maxLength={10} />
                        {errors.phone && <p className="form-error">{errors.phone}</p>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Full Address *</label>
                      <textarea className="form-input" rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House no, Street, Area..." />
                      {errors.address && <p className="form-error">{errors.address}</p>}
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input className="form-input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" />
                        {errors.city && <p className="form-error">{errors.city}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input className="form-input" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="6-digit pincode" maxLength={6} />
                        {errors.pincode && <p className="form-error">{errors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="card">
                  <div className="card-body">
                    <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>💳 Payment Method</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[['cod', '💵 Cash on Delivery', 'Pay when order arrives'], ['upi', '📱 UPI Payment', 'Google Pay, PhonePe, Paytm'], ['card', '💳 Credit/Debit Card', 'Visa, Mastercard, RuPay']].map(([v, label, sub]) => (
                        <label key={v} style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px',
                          border: `2px solid ${form.paymentMethod === v ? 'var(--primary)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          background: form.paymentMethod === v ? 'var(--primary-bg)' : 'transparent',
                          transition: 'var(--transition)',
                        }}>
                          <input type="radio" name="payment" value={v} checked={form.paymentMethod === v} onChange={() => setForm({ ...form, paymentMethod: v })} style={{ accentColor: 'var(--primary)' }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{label}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{sub}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Summary */}
              <div>
                <div className="order-summary" style={{ position: 'sticky', top: 88 }}>
                  <p className="order-summary-title">Order Summary</p>

                  {/* Items */}
                  <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                        <img src={item.image} alt={item.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'; }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{item.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>x{item.qty}</p>
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-row"><span>Subtotal</span><span>₹{total}</span></div>
                  <div className="summary-row"><span>Delivery</span><span style={{ color: deliveryFee === 0 ? 'var(--primary)' : 'inherit' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                  <div className="summary-row"><span>GST (5%)</span><span>₹{tax}</span></div>
                  <div className="divider" />
                  <div className="summary-row total"><span>Grand Total</span><span>₹{grandTotal}</span></div>

                  {submitError && (
                    <div style={{
                      background: 'var(--danger-light, #fee2e2)',
                      border: '1px solid var(--danger, #ef4444)',
                      borderRadius: 'var(--radius)',
                      padding: '10px 14px',
                      color: 'var(--danger, #b91c1c)',
                      fontSize: '0.85rem',
                      marginTop: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <span>⚠️</span>
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-lg w-full mt-20" disabled={placing}>
                    {placing ? <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 3 }} /> Placing Order...</> : '🎉 Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
